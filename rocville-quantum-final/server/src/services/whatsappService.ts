
import { Conversation, UserProfile, Analytics } from '../models/AIAgent';
import { AIProcessor } from './aiProcessor';
import { logger } from '../utils/logger';

export class WhatsAppService {
  private accessToken: string;
  private verifyToken: string;
  private phoneNumberId: string;
  private apiUrl: string;
  private aiProcessor: AIProcessor;
  private failover: ((providers: Array<() => Promise<any>>) => Promise<any>) | null;
  private getCache: ((key: string) => Promise<any>) | null;
  private setCache: ((key: string, value: any, ttl?: number) => Promise<void>) | null;
  private logMetric: ((name: string, value: string | number, tags?: Record<string, string>) => void) | null;
  private logError: ((error: Error, context?: any) => void) | null;

  constructor(accessToken?: string, verifyToken?: string, phoneNumberId?: string) {
    this.accessToken = accessToken || process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.verifyToken = verifyToken || process.env.WHATSAPP_VERIFY_TOKEN || 'rocville_verify_token';
    this.phoneNumberId = phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.apiUrl = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;
    this.aiProcessor = new AIProcessor();
    // Reliability utilities
    this.failover = null;
    this.getCache = null;
    this.setCache = null;
    this.logMetric = null;
    this.logError = null;
    (async () => {
      const failoverMod = await import('../utils/failoverProvider');
      const cacheMod = await import('../utils/cacheService');
      const obsMod = await import('../utils/observability');
      this.failover = failoverMod.failover;
      this.getCache = cacheMod.getCache;
      this.setCache = cacheMod.setCache;
      this.logMetric = obsMod.logMetric;
      this.logError = obsMod.logError;
    })();
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === "subscribe" && token === this.verifyToken) {
      return challenge;
    }
    return null;
  }

  async processWebhook(data: any): Promise<any> {
    try {
      if (!data.entry) {
        return { status: "no_entry", processed: false };
      }

      const responses = [];

      for (const entry of data.entry) {
        if (!entry.changes) continue;

        for (const change of entry.changes) {
          if (change.field !== 'messages') continue;

          const value = change.value || {};

          // Process incoming messages
          if (value.messages) {
            for (const message of value.messages) {
              const response = await this.processIncomingMessage(message, value);
              responses.push(response);
            }
          }

          // Process message status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              await this.processMessageStatus(status);
            }
          }
        }
      }

      if (this.logMetric) this.logMetric('whatsapp_webhook_success', 1, {});
      return {
        status: "success",
        processed: true,
        responses
      };

    } catch (error) {
      if (this.logError) this.logError(error as Error, {});
      logger.error('WhatsApp webhook processing error:', error);
      return {
        status: "error",
        error: (error as Error).message,
        processed: false
      };
    }
  }

  private async processIncomingMessage(message: any, value: any): Promise<any> {
    try {
      const fromNumber = message.from;
      const messageId = message.id;
      const timestamp = new Date(parseInt(message.timestamp) * 1000);

      // Get contact info
      const contactInfo = this.getContactInfo(value.contacts || [], fromNumber);

      // Extract message content
      const messageContent = this.extractMessageContent(message);

      // Store incoming message
      const conversation = new Conversation({
        phone_number: fromNumber,
        user_name: contactInfo.name,
        message_type: 'incoming',
        message_content: messageContent,
        message_id: messageId,
        timestamp,
        processed: false
      });

      await conversation.save();

      // Get or create user profile
      let userProfile = await UserProfile.findOne({ phone_number: fromNumber });
      if (!userProfile) {
        userProfile = new UserProfile({
          phone_number: fromNumber,
          name: contactInfo.name,
          preferred_language: 'en',
          currency: 'USD',
          interests: [],
          interaction_count: 0,
          lead_score: 0
        });
        await userProfile.save();
      }

      // Process message with AI
      const aiResponse = await this.aiProcessor.processMessage(
        messageContent,
        fromNumber,
        userProfile
      );

      // Send response
      const sendResult = await this.sendMessage(fromNumber, aiResponse.response);

      // Store outgoing message
      if (sendResult.success) {
        const outgoingConversation = new Conversation({
          phone_number: fromNumber,
          user_name: contactInfo.name,
          message_type: 'outgoing',
          message_content: aiResponse.response,
          message_id: sendResult.message_id,
          timestamp: new Date(),
          language: userProfile.preferred_language,
          processed: true
        });

        await outgoingConversation.save();
      }

      // Mark as processed
      conversation.processed = true;
      await conversation.save();

      return {
        status: "success",
        from: fromNumber,
        message_processed: true,
        response_sent: sendResult.success,
        ai_response: aiResponse
      };

    } catch (error) {
      logger.error('Error processing incoming message:', error);
      return {
        status: "error",
        error: (error as Error).message,
        from: message.from,
        message_processed: false
      };
    }
  }

  private extractMessageContent(message: any): string {
    const messageType = message.type;

    switch (messageType) {
      case 'text':
        return message.text?.body || '';
      case 'image':
        const caption = message.image?.caption || '';
        return `[Image received] ${caption}`.trim();
      case 'document':
        const filename = message.document?.filename || 'document';
        const docCaption = message.document?.caption || '';
        return `[Document received: ${filename}] ${docCaption}`.trim();
      case 'audio':
        return '[Audio message received]';
      case 'video':
        const videoCaption = message.video?.caption || '';
        return `[Video received] ${videoCaption}`.trim();
      case 'location':
        const location = message.location || {};
        return `[Location shared: ${location.latitude}, ${location.longitude}]`;
      case 'contacts':
        const contacts = message.contacts || [];
        const contactNames = contacts.map((contact: any) => 
          contact.name?.formatted_name || 'Contact'
        );
        return `[Contact(s) shared: ${contactNames.join(', ')}]`;
      default:
        return `[${messageType} message received]`;
    }
  }

  private getContactInfo(contacts: any[], phoneNumber: string): any {
    for (const contact of contacts) {
      if (contact.wa_id === phoneNumber) {
        const profile = contact.profile || {};
        return {
          name: profile.name || '',
          phone: phoneNumber
        };
      }
    }
    return { phone: phoneNumber };
  }

  private async processMessageStatus(status: any): Promise<void> {
    try {
      const messageId = status.id;
      const statusType = status.status;
      const timestamp = new Date(parseInt(status.timestamp) * 1000);

      // Update conversation record if needed
      const conversation = await Conversation.findOne({ message_id: messageId });
      if (conversation) {
        // Could add status tracking here
        logger.info(`Message ${messageId} status: ${statusType}`);
      }

    } catch (error) {
      logger.error('Error processing message status:', error);
    }
  }

  async sendMessage(toNumber: string, message: string, messageType: string = "text"): Promise<any> {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        // For development, simulate successful send
        return {
          success: true,
          message_id: `msg_${Date.now()}`,
          simulated: true
        };
      }

      const headers = {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json"
      };

      const payload: any = {
        messaging_product: "whatsapp",
        to: toNumber,
        type: messageType
      };

      if (messageType === "text") {
        payload.text = { body: message };
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message_id: result.messages?.[0]?.id,
          response: result
        };
      } else {
        return {
          success: false,
          error: await response.text(),
          status_code: response.status
        };
      }

    } catch (error) {
      logger.error('Error sending WhatsApp message:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  async sendInteractiveMessage(toNumber: string, headerText: string, bodyText: string, buttons: any[]): Promise<any> {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        return {
          success: true,
          message_id: `interactive_${Date.now()}`,
          simulated: true
        };
      }

      const headers = {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json"
      };

      const interactiveButtons = buttons.slice(0, 3).map((button, i) => ({
        type: "reply",
        reply: {
          id: `btn_${i}`,
          title: button.title?.substring(0, 20) || ""
        }
      }));

      const payload = {
        messaging_product: "whatsapp",
        to: toNumber,
        type: "interactive",
        interactive: {
          type: "button",
          header: { type: "text", text: headerText },
          body: { text: bodyText },
          action: { buttons: interactiveButtons }
        }
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message_id: result.messages?.[0]?.id,
          response: result
        };
      } else {
        return {
          success: false,
          error: await response.text(),
          status_code: response.status
        };
      }

    } catch (error) {
      logger.error('Error sending interactive message:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}
