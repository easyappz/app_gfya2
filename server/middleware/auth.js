const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = 'mysecretkey123';

module.exports = function (req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Remove 'Bearer ' prefix if present
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};
