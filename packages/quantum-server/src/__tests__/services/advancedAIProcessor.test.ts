
import { AdvancedAIProcessor } from '../../services/advancedAIProcessor.js';

describe('AdvancedAIProcessor', () => {
  let processor: AdvancedAIProcessor;

  beforeEach(() => {
    processor = new AdvancedAIProcessor();
  });

  describe('processMessage', () => {
    it('should process simple text messages', async () => {
      const message = 'Hello, how can you help me?';
      const result = await processor.processMessage(message, 'user123');

      expect(result).toBeDefined();
      expect(result.response).toBeTruthy();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should handle empty messages gracefully', async () => {
      const result = await processor.processMessage('', 'user123');

      expect(result).toBeDefined();
      expect(result.response).toContain('please provide');
    });
  });

  describe('analyzeImage', () => {
    it('should analyze image buffer', async () => {
      const mockImageBuffer = Buffer.from('fake-image-data');
      const result = await processor.analyzeImage(mockImageBuffer);

      expect(result).toBeDefined();
      expect(result.description).toBeTruthy();
    });
  });

  describe('generateContent', () => {
    it('should generate marketing content', async () => {
      const prompt = 'Create a social media post about AI technology';
      const result = await processor.generateContent(prompt, 'marketing');

      expect(result).toBeDefined();
      expect(result.content).toBeTruthy();
      expect(result.type).toBe('marketing');
    });
  });
});
