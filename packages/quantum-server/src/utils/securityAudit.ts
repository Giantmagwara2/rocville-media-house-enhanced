
import { logger } from './logger.js';
import crypto from 'crypto';

export interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'data_access' | 'suspicious_activity';
  userId?: string;
  ip: string;
  userAgent?: string;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export class SecurityAuditor {
  private static events: SecurityEvent[] = [];
  private static maxEvents = 10000;

  static logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    this.events.push(securityEvent);
    
    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log critical events immediately
    if (event.severity === 'critical') {
      logger.error('CRITICAL SECURITY EVENT', securityEvent);
      this.alertAdministrators(securityEvent);
    } else {
      logger.warn('Security event logged', securityEvent);
    }
  }

  static getSecurityEvents(filters?: {
    type?: string;
    severity?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }): SecurityEvent[] {
    let filteredEvents = this.events;

    if (filters) {
      filteredEvents = filteredEvents.filter(event => {
        if (filters.type && event.type !== filters.type) return false;
        if (filters.severity && event.severity !== filters.severity) return false;
        if (filters.userId && event.userId !== filters.userId) return false;
        if (filters.startDate && event.timestamp < filters.startDate) return false;
        if (filters.endDate && event.timestamp > filters.endDate) return false;
        return true;
      });
    }

    return filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  static generateSecurityReport(): {
    summary: any;
    recentEvents: SecurityEvent[];
    recommendations: string[];
  } {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentEvents = this.getSecurityEvents({ startDate: last24Hours });

    const summary = {
      totalEvents: recentEvents.length,
      byType: this.groupBy(recentEvents, 'type'),
      bySeverity: this.groupBy(recentEvents, 'severity'),
      uniqueIPs: new Set(recentEvents.map(e => e.ip)).size,
      suspiciousActivity: recentEvents.filter(e => 
        e.type === 'suspicious_activity' || e.severity === 'critical'
      ).length
    };

    const recommendations = this.generateRecommendations(summary, recentEvents);

    return {
      summary,
      recentEvents: recentEvents.slice(0, 50),
      recommendations
    };
  }

  private static groupBy(array: SecurityEvent[], key: keyof SecurityEvent): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = String(item[key]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static generateRecommendations(summary: any, events: SecurityEvent[]): string[] {
    const recommendations: string[] = [];

    if (summary.suspiciousActivity > 10) {
      recommendations.push('High number of suspicious activities detected. Consider implementing stricter rate limiting.');
    }

    if (summary.bySeverity.critical > 0) {
      recommendations.push('Critical security events detected. Immediate investigation required.');
    }

    if (summary.uniqueIPs > 100) {
      recommendations.push('High number of unique IPs. Consider implementing geographic restrictions if applicable.');
    }

    const failedAuthEvents = events.filter(e => 
      e.type === 'authentication' && e.details.success === false
    );
    
    if (failedAuthEvents.length > 20) {
      recommendations.push('High number of failed authentication attempts. Consider implementing account lockout policies.');
    }

    return recommendations;
  }

  private static alertAdministrators(event: SecurityEvent) {
    // In production, implement email/SMS alerts
    logger.error('ADMINISTRATOR ALERT REQUIRED', {
      event,
      message: 'Critical security event requires immediate attention'
    });
  }
}

// Middleware to track suspicious activities
export const trackSuspiciousActivity = (req: any, res: any, next: any) => {
  const suspiciousPatterns = [
    /\.\.\//, // Path traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /eval\(/i, // Code injection
    /document\.cookie/i // Cookie theft attempts
  ];

  const requestString = JSON.stringify({
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    headers: req.headers
  });

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestString));

  if (isSuspicious) {
    SecurityAuditor.logSecurityEvent({
      type: 'suspicious_activity',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      details: {
        url: req.originalUrl,
        method: req.method,
        suspicious_content: requestString.substring(0, 500)
      },
      severity: 'high'
    });
  }

  next();
};
