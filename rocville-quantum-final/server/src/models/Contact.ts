
import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: 'website' | 'email' | 'phone' | 'social' | 'referral';
  tags: string[];
  assignedTo?: string;
  notes: Array<{
    content: string;
    author: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'in-progress', 'resolved', 'closed'], default: 'new' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  source: { type: String, enum: ['website', 'email', 'phone', 'social', 'referral'], default: 'website' },
  tags: [{ type: String, trim: true }],
  assignedTo: { type: String, trim: true },
  notes: [{
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ source: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
