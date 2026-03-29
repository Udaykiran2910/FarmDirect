const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.message === 'Database connection failed') {
    return res.status(503).json({ error: 'Database service unavailable' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
