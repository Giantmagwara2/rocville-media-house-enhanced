// Simple OTP service for MFA
import crypto from 'crypto';

const otpStore: Record<string, { otp: string; expires: number }> = {};

export function generateOTP(email: string): string {
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  };
  return otp;
}

export function verifyOTP(email: string, otp: string): boolean {
  const record = otpStore[email];
  if (!record) return false;
  if (Date.now() > record.expires) return false;
  return record.otp === otp;
}

export function clearOTP(email: string) {
  delete otpStore[email];
}
