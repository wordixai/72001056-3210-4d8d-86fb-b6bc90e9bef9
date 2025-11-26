import express from 'express';
import cors from 'cors';
import tinify from 'tinify';

const app = express();
const PORT = process.env.PORT || 3001;

// TinyPNG API Key
tinify.key = 'tQzHVrC16K6Mr4kyyPsZzzy4Xk2BqrF4';

// Middleware
app.use(cors());
app.use(express.raw({ type: 'image/*', limit: '10mb' }));

// Compress endpoint
app.post('/api/compress', async (req, res) => {
  try {
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Compress using tinify
    const source = tinify.fromBuffer(req.body);
    const resultBuffer = await source.toBuffer();

    // Send compression count in header
    res.setHeader('Compression-Count', tinify.compressionCount || 0);

    // Send compressed image
    res.setHeader('Content-Type', 'image/png');
    res.send(resultBuffer);
  } catch (error) {
    console.error('Compression error:', error);
    res.status(500).json({
      error: error.message || 'Compression failed',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    compressionCount: tinify.compressionCount || 0,
  });
});

app.listen(PORT, () => {
  console.log(`Compression server running on port ${PORT}`);
});
