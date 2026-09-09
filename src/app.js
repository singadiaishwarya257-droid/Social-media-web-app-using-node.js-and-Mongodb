const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { securityMiddleware } = require('./middleware/security');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');
const { registerAppEvents } = require('./events/appEvents');

const app = express();

// Parse incoming request bodies and cookies before any route logic executes.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Log requests in non-production environments for easier debugging.
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Security layers: CORS, Helmet, rate limiting, compression, validation hardening.
securityMiddleware(app);
registerAppEvents();

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'OK', uptime: process.uptime() },
    error: null,
  });
});

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
