
import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolio extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  client?: string;
  completedAt: Date;
  featured: boolean;
  technologies: string[];
  status: 'draft' | 'published' | 'archived';
  metadata: {
    views: number;
    likes: number;
    shares: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolio>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['web', 'mobile', 'design', 'branding', 'photography'] },
  tags: [{ type: String, trim: true }],
  images: [{ type: String, required: true }],
  liveUrl: { type: String, trim: true },
  githubUrl: { type: String, trim: true },
  client: { type: String, trim: true },
  completedAt: { type: Date, required: true },
  featured: { type: Boolean, default: false },
  technologies: [{ type: String, trim: true }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  metadata: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

portfolioSchema.index({ category: 1, status: 1 });
portfolioSchema.index({ featured: 1, status: 1 });
portfolioSchema.index({ createdAt: -1 });

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
