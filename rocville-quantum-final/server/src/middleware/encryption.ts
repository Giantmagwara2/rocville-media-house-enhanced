
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

export class EncryptionService {
  static encrypt(text: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted, iv: iv.toString('hex') };
  }

  static decrypt(encrypted: string, ivHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  static verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }
}

// Middleware to encrypt sensitive response data
export const encryptSensitiveData = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    
    res.json = function(body: any) {
      if (body && typeof body === 'object') {
        fields.forEach(field => {
          if (body[field]) {
            const encrypted = EncryptionService.encrypt(body[field]);
            body[field] = encrypted.encrypted;
            body[`${field}_iv`] = encrypted.iv;
          }
        });
      }
      return originalJson.call(this, body);
    };
    
    next();
  };
};
