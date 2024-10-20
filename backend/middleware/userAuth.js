const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization'); // Access the Authorization header
  console.log('Authorization Header:', authHeader);

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Extract the token by removing 'Bearer ' prefix
  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token);

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'superNii'); // Your secret key
    req.user = decoded.userId; // Attach user info to the request
    next(); // Proceed to the next middleware/route
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
