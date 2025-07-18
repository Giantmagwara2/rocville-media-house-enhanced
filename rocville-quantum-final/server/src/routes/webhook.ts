import express from 'express';
import { eventBus } from '../services/eventStreamService';

const router = express.Router();

// Universal webhook endpoint for external event triggers
router.post('/webhook/:source', (req, res) => {
  const { source } = req.params;
  const event = {
    type: 'webhook',
    source,
    payload: req.body,
    timestamp: new Date().toISOString()
  };
  eventBus.emit('event', event);
  res.json({ success: true, received: true });
});

export default router;
