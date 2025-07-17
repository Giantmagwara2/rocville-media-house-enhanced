
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: any;
}

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const templates = {
  'contact-confirmation': (data: any) => ({
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for contacting RocVille Media House</h2>
        <p>Dear ${data.name},</p>
        <p>We have received your message regarding: <strong>${data.subject}</strong></p>
        <p>Our team will review your inquiry and get back to you within 24 hours.</p>
        <p>Best regards,<br>RocVille Media House Team</p>
      </div>
    `,
    text: `Thank you for contacting RocVille Media House, ${data.name}. We have received your message regarding: ${data.subject}. Our team will get back to you within 24 hours.`
  }),
  
  'contact-notification': (data: any) => ({
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <p><strong>Source:</strong> ${data.source}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
    text: `New contact form submission from ${data.name} (${data.email}). Subject: ${data.subject}. Message: ${data.message}`
  })
};

export const sendEmail = async ({ to, subject, template, data }: EmailData): Promise<void> => {
  try {
    // Skip email sending in development if no SMTP credentials
    if (process.env.NODE_ENV !== 'production' && !process.env.SMTP_USER) {
      logger.info(`Email would be sent to ${to} with subject: ${subject}`);
      logger.info(`Template: ${template}`, data);
      return;
    }

    const transporter = createTransporter();
    const emailTemplate = templates[template as keyof typeof templates];
    
    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found`);
    }

    const { html, text } = emailTemplate(data);

    const mailOptions = {
      from: `"RocVille Media House" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully: ${info.messageId}`);
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};
