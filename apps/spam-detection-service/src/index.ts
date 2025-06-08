import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'spam-detection' });
});

// Spam detection endpoint
app.post('/detect', (req, res) => {
  const { content, metadata } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  // Placeholder spam detection logic
  // In the future, this will be replaced with ML model inference
  const spamScore = detectSpamPlaceholder(content);
  const isSpam = spamScore > 0.7;

  res.json({
    content,
    isSpam,
    spamScore,
    reasons: isSpam ? getSpamReasons(content) : [],
    confidence: spamScore
  });
});

// Placeholder spam detection logic
function detectSpamPlaceholder(content: string): number {
  const spamIndicators = [
    /\b(buy now|click here|limited time|act fast|special offer)\b/i,
    /\b(free money|get rich|work from home|make \$\d+)\b/i,
    /\b(urgent|asap|immediate|instant)\b/i,
    /[A-Z]{5,}/g, // Excessive caps
    /(.)\1{3,}/g, // Repeated characters
  ];

  let score = 0;
  for (const pattern of spamIndicators) {
    if (pattern.test(content)) {
      score += 0.2;
    }
  }

  // Check for excessive links or mentions
  const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
  const mentionCount = (content.match(/@\w+/g) || []).length;
  
  if (linkCount > 3) score += 0.3;
  if (mentionCount > 5) score += 0.2;

  return Math.min(score, 1.0);
}

function getSpamReasons(content: string): string[] {
  const reasons: string[] = [];
  
  if (/\b(buy now|click here|limited time|act fast|special offer)\b/i.test(content)) {
    reasons.push('Contains promotional language');
  }
  if (/\b(free money|get rich|work from home|make \$\d+)\b/i.test(content)) {
    reasons.push('Contains get-rich-quick schemes');
  }
  if (/[A-Z]{5,}/g.test(content)) {
    reasons.push('Excessive use of capital letters');
  }
  if ((content.match(/https?:\/\/[^\s]+/g) || []).length > 3) {
    reasons.push('Too many links');
  }
  if ((content.match(/@\w+/g) || []).length > 5) {
    reasons.push('Too many mentions');
  }

  return reasons;
}

app.listen(port, () => {
  console.log(`Spam detection service running on port ${port}`);
});

export default app;