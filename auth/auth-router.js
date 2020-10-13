const router = require('express').Router()
const secrets = require('../config/secrets')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../users/user-model')

const genToken = (user) => {
  const payload = {
    userid:user.id,
    username: user.username
  }
  const options = {
    expiresIn:'1hr'
  }
  const token = jwt.sign(payload,secrets.jwtSecret,options)
  return token
}
router.post('/register', (req, res) => {
  let user =req.body;
  const hash = bcrypt.hashSync(user.password,10)
    User.add({
      username:user.username,
      password: hash,
    })
    .then(success => {
      const token = genToken(success)
      res.status(200).json(success)
    })
    .catch(error => res.status(500).json({error_name: error, error: error.message}))
});

router.post('/login', (req, res) => {
  const {username,password} = req.body;
    User.findBy({ username })
    .then( ([user]) => {
      if(user && bcrypt.compareSync(password, user.password)){
        const token = genToken(user)
          res.status(200).json({token: token,username:user.username})
      }
      else{
        res.status(401).json({ message: 'wrong credentials' })
      }
    })
    .catch(error => res.status(500).json({error_name: error.name, error: error.message}))
});

module.exports = router;
