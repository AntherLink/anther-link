const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = 3000;
const PUBLIC_ROOT = path.resolve('.');
const SUBMISSIONS_PATH = path.join(PUBLIC_ROOT, 'submissions.json');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif'
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

async function readBody(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  return body;
}

async function loadSubmissions() {
  try {
    const existing = await fs.readFile(SUBMISSIONS_PATH, 'utf8');
    return JSON.parse(existing);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveSubmission(submission) {
  const submissions = await loadSubmissions();
  submissions.push({
    ...submission,
    submittedAt: new Date().toISOString()
  });
  await fs.writeFile(SUBMISSIONS_PATH, JSON.stringify(submissions, null, 2), 'utf8');
}

async function serveStatic(req, res) {
  let requestPath = req.url.split('?')[0];
  if (requestPath === '/') {
    requestPath = '/Contact/Contact.html';
  }

  const safePath = path.join(PUBLIC_ROOT, requestPath);
  if (!safePath.startsWith(PUBLIC_ROOT)) {
    res.writeHead(403, corsHeaders());
    return res.end('Forbidden');
  }

  try {
    const data = await fs.readFile(safePath);
    const ext = path.extname(safePath).toLowerCase();
    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType, ...corsHeaders() });
    res.end(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404, corsHeaders());
      res.end('Not Found');
    } else {
      console.error(error);
      res.writeHead(500, corsHeaders());
      res.end('Server Error');
    }
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders());
    return res.end();
  }

  if (req.url === '/submit' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const submission = JSON.parse(body);
      await saveSubmission(submission);
      res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders() });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      console.error('Submit error:', error);
      res.writeHead(400, { 'Content-Type': 'application/json', ...corsHeaders() });
      res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
    }
    return;
  }

  if (req.method === 'GET') {
    await serveStatic(req, res);
    return;
  }

  res.writeHead(405, corsHeaders());
  res.end('Method Not Allowed');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Open http://localhost:3000/Contact/Contact.html to use the form');
});
