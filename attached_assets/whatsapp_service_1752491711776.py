import requests
import json
import hmac
import hashlib
from typing import Dict, List, Optional
from datetime import datetime
from src.models.ai_agent import Conversation, UserProfile, db
from src.services.ai_processor import AIProcessor
from src.services.translation_service import TranslationService
from src.services.location_service import LocationService

class WhatsAppService:
    """WhatsApp Business API integration service"""
    
    def __init__(self, access_token: str = None, verify_token: str = None, phone_number_id: str = None):
        self.access_token = access_token or "your-whatsapp-access-token"
        self.verify_token = verify_token or "your-verify-token"
        self.phone_number_id = phone_number_id or "your-phone-number-id"
        self.api_url = f"https://graph.facebook.com/v18.0/{self.phone_number_id}/messages"
        
        # Initialize services
        self.ai_processor = AIProcessor()
        self.translation_service = TranslationService()
        self.location_service = LocationService()
    
    def verify_webhook(self, mode: str, token: str, challenge: str) -> Optional[str]:
        """Verify webhook subscription"""
        if mode == "subscribe" and token == self.verify_token:
            return challenge
        return None
    
    def process_webhook(self, data: Dict) -> Dict:
        """Process incoming webhook data from WhatsApp"""
        try:
            if not data.get('entry'):
                return {"status": "no_entry", "processed": False}
            
            responses = []
            
            for entry in data['entry']:
                if not entry.get('changes'):
                    continue
                
                for change in entry['changes']:
                    if change.get('field') != 'messages':
                        continue
                    
                    value = change.get('value', {})
                    
                    # Process incoming messages
                    if 'messages' in value:
                        for message in value['messages']:
                            response = self._process_incoming_message(message, value)
                            responses.append(response)
                    
                    # Process message status updates
                    if 'statuses' in value:
                        for status in value['statuses']:
                            self._process_message_status(status)
            
            return {
                "status": "success",
                "processed": True,
                "responses": responses
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "processed": False
            }
    
    def _process_incoming_message(self, message: Dict, value: Dict) -> Dict:
        """Process individual incoming message"""
        try:
            # Extract message details
            from_number = message.get('from')
            message_id = message.get('id')
            timestamp = datetime.fromtimestamp(int(message.get('timestamp', 0)))
            
            # Get contact info
            contact_info = self._get_contact_info(value.get('contacts', []), from_number)
            
            # Extract message content
            message_content = self._extract_message_content(message)
            
            # Store incoming message
            conversation = Conversation(
                user_phone=from_number,
                user_name=contact_info.get('name'),
                message_type='incoming',
                message_content=message_content,
                message_id=message_id,
                timestamp=timestamp
            )
            db.session.add(conversation)
            
            # Get or create user profile
            user_profile = UserProfile.query.filter_by(phone_number=from_number).first()
            if not user_profile:
                user_profile = UserProfile(
                    phone_number=from_number,
                    name=contact_info.get('name')
                )
                db.session.add(user_profile)
                db.session.flush()  # Get the ID
            
            # Detect language if not set
            if not user_profile.preferred_language or user_profile.preferred_language == 'en':
                detected_language = self.translation_service.detect_language(message_content)
                if detected_language and detected_language != 'en':
                    user_profile.preferred_language = detected_language
            
            # Get location if available
            location_data = self._extract_location_data(message)
            if location_data:
                location_info = self.location_service.get_location_info(
                    location_data.get('latitude'),
                    location_data.get('longitude')
                )
                user_profile.country = location_info.get('country')
                user_profile.city = location_info.get('city')
                conversation.location_data = json.dumps(location_data)
            
            # Process message with AI
            ai_response = self.ai_processor.process_message(
                message_content, from_number, user_profile
            )
            
            # Translate response if needed
            response_text = ai_response.get('response', '')
            if user_profile.preferred_language and user_profile.preferred_language != 'en':
                response_text = self.translation_service.translate_text(
                    response_text, 'en', user_profile.preferred_language
                )
            
            # Send response
            send_result = self.send_message(from_number, response_text)
            
            # Store outgoing message
            if send_result.get('success'):
                outgoing_conversation = Conversation(
                    user_phone=from_number,
                    user_name=contact_info.get('name'),
                    message_type='outgoing',
                    message_content=response_text,
                    message_id=send_result.get('message_id'),
                    timestamp=datetime.utcnow(),
                    language=user_profile.preferred_language
                )
                db.session.add(outgoing_conversation)
            
            # Mark as processed
            conversation.processed = True
            db.session.commit()
            
            return {
                "status": "success",
                "from": from_number,
                "message_processed": True,
                "response_sent": send_result.get('success', False),
                "ai_response": ai_response
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                "status": "error",
                "error": str(e),
                "from": message.get('from'),
                "message_processed": False
            }
    
    def _extract_message_content(self, message: Dict) -> str:
        """Extract content from different message types"""
        message_type = message.get('type')
        
        if message_type == 'text':
            return message.get('text', {}).get('body', '')
        
        elif message_type == 'image':
            image_data = message.get('image', {})
            caption = image_data.get('caption', '')
            return f"[Image received] {caption}".strip()
        
        elif message_type == 'document':
            doc_data = message.get('document', {})
            filename = doc_data.get('filename', 'document')
            caption = doc_data.get('caption', '')
            return f"[Document received: {filename}] {caption}".strip()
        
        elif message_type == 'audio':
            return "[Audio message received]"
        
        elif message_type == 'video':
            video_data = message.get('video', {})
            caption = video_data.get('caption', '')
            return f"[Video received] {caption}".strip()
        
        elif message_type == 'location':
            location = message.get('location', {})
            return f"[Location shared: {location.get('latitude')}, {location.get('longitude')}]"
        
        elif message_type == 'contacts':
            contacts = message.get('contacts', [])
            contact_names = [contact.get('name', {}).get('formatted_name', 'Contact') for contact in contacts]
            return f"[Contact(s) shared: {', '.join(contact_names)}]"
        
        else:
            return f"[{message_type} message received]"
    
    def _extract_location_data(self, message: Dict) -> Optional[Dict]:
        """Extract location data from message"""
        if message.get('type') == 'location':
            location = message.get('location', {})
            return {
                'latitude': location.get('latitude'),
                'longitude': location.get('longitude'),
                'name': location.get('name'),
                'address': location.get('address')
            }
        return None
    
    def _get_contact_info(self, contacts: List[Dict], phone_number: str) -> Dict:
        """Extract contact information"""
        for contact in contacts:
            if contact.get('wa_id') == phone_number:
                profile = contact.get('profile', {})
                return {
                    'name': profile.get('name', ''),
                    'phone': phone_number
                }
        return {'phone': phone_number}
    
    def _process_message_status(self, status: Dict):
        """Process message status updates (delivered, read, etc.)"""
        try:
            message_id = status.get('id')
            status_type = status.get('status')
            timestamp = datetime.fromtimestamp(int(status.get('timestamp', 0)))
            
            # Update conversation record
            conversation = Conversation.query.filter_by(message_id=message_id).first()
            if conversation:
                # You could add a status field to track delivery/read status
                pass
                
        except Exception as e:
            print(f"Error processing message status: {e}")
    
    def send_message(self, to_number: str, message: str, message_type: str = "text") -> Dict:
        """Send message via WhatsApp Business API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "messaging_product": "whatsapp",
                "to": to_number,
                "type": message_type
            }
            
            if message_type == "text":
                payload["text"] = {"body": message}
            
            response = requests.post(self.api_url, headers=headers, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "message_id": result.get('messages', [{}])[0].get('id'),
                    "response": result
                }
            else:
                return {
                    "success": False,
                    "error": response.text,
                    "status_code": response.status_code
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def send_template_message(self, to_number: str, template_name: str, language_code: str = "en", parameters: List[str] = None) -> Dict:
        """Send template message (for notifications)"""
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "messaging_product": "whatsapp",
                "to": to_number,
                "type": "template",
                "template": {
                    "name": template_name,
                    "language": {"code": language_code}
                }
            }
            
            if parameters:
                payload["template"]["components"] = [{
                    "type": "body",
                    "parameters": [{"type": "text", "text": param} for param in parameters]
                }]
            
            response = requests.post(self.api_url, headers=headers, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "message_id": result.get('messages', [{}])[0].get('id'),
                    "response": result
                }
            else:
                return {
                    "success": False,
                    "error": response.text,
                    "status_code": response.status_code
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def send_interactive_message(self, to_number: str, header_text: str, body_text: str, buttons: List[Dict]) -> Dict:
        """Send interactive message with buttons"""
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            interactive_buttons = []
            for i, button in enumerate(buttons[:3]):  # WhatsApp allows max 3 buttons
                interactive_buttons.append({
                    "type": "reply",
                    "reply": {
                        "id": f"btn_{i}",
                        "title": button.get("title", "")[:20]  # Max 20 chars
                    }
                })
            
            payload = {
                "messaging_product": "whatsapp",
                "to": to_number,
                "type": "interactive",
                "interactive": {
                    "type": "button",
                    "header": {"type": "text", "text": header_text},
                    "body": {"text": body_text},
                    "action": {"buttons": interactive_buttons}
                }
            }
            
            response = requests.post(self.api_url, headers=headers, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "message_id": result.get('messages', [{}])[0].get('id'),
                    "response": result
                }
            else:
                return {
                    "success": False,
                    "error": response.text,
                    "status_code": response.status_code
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_media_url(self, media_id: str) -> Optional[str]:
        """Get media URL from media ID"""
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}"
            }
            
            response = requests.get(
                f"https://graph.facebook.com/v18.0/{media_id}",
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json().get('url')
            
        except Exception as e:
            print(f"Error getting media URL: {e}")
        
        return None

