
import { Schema, model, Document } from 'mongoose';

// Conversation Schema
interface IConversation extends Document {
  phone_number: string;
  user_name?: string;
  message_type: 'incoming' | 'outgoing';
  message_content: string;
  message_id?: string;
  language?: string;
  location_data?: string;
  processed: boolean;
  timestamp: Date;
}

const ConversationSchema = new Schema<IConversation>({
  phone_number: { type: String, required: true },
  user_name: { type: String },
  message_type: { type: String, enum: ['incoming', 'outgoing'], required: true },
  message_content: { type: String, required: true },
  message_id: { type: String },
  language: { type: String, default: 'en' },
  location_data: { type: String },
  processed: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

// User Profile Schema
interface IUserProfile extends Document {
  phone_number: string;
  name?: string;
  email?: string;
  preferred_language: string;
  country?: string;
  city?: string;
  currency: string;
  business_type?: string;
  budget_range?: string;
  interests: string[];
  interaction_count: number;
  lead_score: number;
  last_interaction?: Date;
}

const UserProfileSchema = new Schema<IUserProfile>({
  phone_number: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  preferred_language: { type: String, default: 'en' },
  country: { type: String },
  city: { type: String },
  currency: { type: String, default: 'USD' },
  business_type: { type: String },
  budget_range: { type: String },
  interests: [{ type: String }],
  interaction_count: { type: Number, default: 0 },
  lead_score: { type: Number, default: 0 },
  last_interaction: { type: Date, default: Date.now }
});

// Lead Schema
interface ILead extends Document {
  phone_number: string;
  name?: string;
  email?: string;
  company?: string;
  service_interest: string;
  budget?: string;
  timeline?: string;
  status: string;
  notes?: string;
  created_at: Date;
}

const LeadSchema = new Schema<ILead>({
  phone_number: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  company: { type: String },
  service_interest: { type: String, required: true },
  budget: { type: String },
  timeline: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'], default: 'new' },
  notes: { type: String },
  created_at: { type: Date, default: Date.now }
});

// Analytics Schema
interface IAnalytics extends Document {
  metric_type: string;
  metric_name: string;
  metric_value: number;
  dimensions?: string;
  timestamp: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  metric_type: { type: String, required: true },
  metric_name: { type: String, required: true },
  metric_value: { type: Number, required: true },
  dimensions: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export const Conversation = model<IConversation>('Conversation', ConversationSchema);
export const UserProfile = model<IUserProfile>('UserProfile', UserProfileSchema);
export const Lead = model<ILead>('Lead', LeadSchema);
export const Analytics = model<IAnalytics>('Analytics', AnalyticsSchema);

export type { IConversation, IUserProfile, ILead, IAnalytics };
