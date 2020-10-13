const jwt = require('jsonwebtoken');
const secret = require('../config/secrets')

module.exports = (req, res, next) => {
  const  token = req.headers.authorization;
  
  if (token) {
    jwt.verify(token.split(" ")[1], secret.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({message: err, token:token});
      } else {
        req.decodedJwt = decodedToken;
        console.log(token);
        next();
      }
    })
  } else {
    res.status(401).json({message: 'you shall not pass'});
  }
};