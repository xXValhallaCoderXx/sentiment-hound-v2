import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Request/Response types to match sentiment analysis service
interface TextItem {
  id: string;
  value: string;
}

interface SpamDetectionRequest {
  data: TextItem[];
}

interface SpamDetectionResult {
  id: string;
  content: string;
  isSpam: boolean;
  spamScore: number;
  reasons: string[];
  confidence: number;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'spam-detection' });
});

// Spam detection endpoint - now processes batches like sentiment analysis
app.post('/detect', (req, res) => {
  const request: SpamDetectionRequest = req.body;

  if (!request.data || !Array.isArray(request.data)) {
    return res.status(400).json({ error: 'Data array is required' });
  }

  if (request.data.length === 0) {
    return res.json([]);
  }

  const results: SpamDetectionResult[] = [];

  // Process each item in the batch
  for (const item of request.data) {
    if (!item.value) {
      results.push({
        id: item.id,
        content: item.value || '',
        isSpam: false,
        spamScore: 0,
        reasons: [],
        confidence: 0
      });
      continue;
    }

    // Placeholder spam detection logic
    // In the future, this will be replaced with ML model inference
    const spamScore = detectSpamPlaceholder(item.value);
    const isSpam = spamScore > 0.7;

    results.push({
      id: item.id,
      content: item.value,
      isSpam,
      spamScore,
      reasons: isSpam ? getSpamReasons(item.value) : [],
      confidence: spamScore
    });
  }

  res.json(results);
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