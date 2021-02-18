function handle404(req, res) {
  res.status(404).json({ url: req.originalUrl + ' not found' })
}

module.exports = { handle404 }