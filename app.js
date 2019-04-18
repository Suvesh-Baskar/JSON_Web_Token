const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post Created...',
        authData
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  // Mock User
  const user = {
    id: 1,
    name: 'Suvesh',
    email: 'suvesh@ronin.com'
  };

  jwt.sign({ user }, 'secretkey', { expiresIn: '35s' }, (err, token) => {
    res.json({
      token
    });
  });
});

// TOKEN FORMAT
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get Auth header value
  const bearerHeader = req.headers['authorization'];

  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set token
    req.token = bearerToken;
    // Call next middleware
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(3000, () => console.log('Server started on port 3000'));
