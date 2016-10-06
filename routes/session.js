var express = require('express');
var router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt');
module.exports = router;
const {
    camelizeKeys,
    decamelizeKeys
} = require('humps');
const cookieSession = require('cookie-session')





router.get('/', (req, res, next) => {
    if (req.session.userInfo) {
        res.send(true)
    } else {
        res.send(false)
    }
})


router.post('/', (req, res, next) => {
    knex('users')
        .where('email', req.body.email)
        .then((user) => {
          if (user.length === 0){
          res.type('text/plain')
          res. status('400')
          res.send('Bad email or password');
        } else {
          if (bcrypt.compareSync(req.body.password, user[0].hashed_password)) {
              delete user[0].hashed_password;
          req.session.userInfo = user[0]
          res.json(camelizeKeys(user[0]));
        } else {
          res.type('text/plain')
          res. status('400')
          res.send('Bad email or password');
        }
      }
    })
})


router.delete('/', (req, res, next) => {
  req.session = null;
  res.send(true)
})
