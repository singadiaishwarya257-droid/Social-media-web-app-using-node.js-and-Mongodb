require('dotenv').config();

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = require('./src/app');
const { connectMongo } = require('./src/config/db');

// Explicit port from environment with a safe fallback to 5000.
const port = Number(process.env.PORT) || 5000;

// Connect to MongoDB before accepting inbound traffic.
connectMongo();

const startServer = () => {
  const useHttps = process.env.USE_HTTPS === 'true';

  // HTTPS support is optional, but the app is designed to run with native Node HTTPS if certificates exist.
  if (useHttps) {
    const certPath = process.env.HTTPS_CERT_PATH || path.join(__dirname, 'certs', 'server.crt');
    const keyPath = process.env.HTTPS_KEY_PATH || path.join(__dirname, 'certs', 'server.key');

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      console.warn('HTTPS certificates not found. Falling back to HTTP server.');
      return http.createServer(app).listen(port, () => {
        console.log(`HTTP server running on port ${port}`);
      });
    }

    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    return https.createServer(httpsOptions, app).listen(port, () => {
      console.log(`HTTPS server running on port ${port}`);
    });
  }

  return http.createServer(app).listen(port, () => {
    console.log(`HTTP server running on port ${port}`);
  });
};

startServer();
