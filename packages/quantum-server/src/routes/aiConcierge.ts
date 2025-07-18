import express from 'express';
import { handleNLPQuestion, handlePredictPerformance, handleOptimizePortfolio } from '../services/aiConciergeService';

const router = express.Router();

router.post('/nlp', async (req, res) => {
  const { question, context } = req.body;
  try {
    const answer = await handleNLPQuestion(question, context);
    res.json({ answer });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/predict', async (req, res) => {
  const { portfolio, market, sustainability } = req.body;
  try {
    const prediction = await handlePredictPerformance(portfolio, market, sustainability);
    res.json({ prediction });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/optimize', (req, res) => {
  const { portfolio, userPrefs } = req.body;
  try {
    const optimized = handleOptimizePortfolio(portfolio, userPrefs);
    res.json({ optimized });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
