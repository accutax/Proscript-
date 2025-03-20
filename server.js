const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Document generation endpoint
app.post('/api/generate-document', (req, res) => {
  const { documentType, prompt, includeCharts, includeImages } = req.body;
  
  console.log('Received request:', req.body);
  
  // Process the request (this is a mock response)
  res.json({
    success: true,
    message: 'Document generated successfully',
    data: {
      documentType,
      prompt,
      includeCharts,
      includeImages,
      generatedContent: 'This is a sample generated document content.'
    }
  });
});

// Placeholder image endpoint
app.get('/placeholder', (req, res) => {
  const width = parseInt(req.query.width, 10) || 600;
  const height = parseInt(req.query.height, 10) || 300;
  const text = req.query.text || 'Placeholder';
  
  // Send a simple SVG as a placeholder
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#0a192f" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
