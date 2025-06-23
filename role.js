const role = (...allowed) => (req, res, next) => {
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied for your role' });
  }
  next();
};

export default role;
