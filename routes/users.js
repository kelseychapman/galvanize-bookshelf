var express = require('express');
var router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt');
module.exports = router;
const { camelizeKeys, decamelizeKeys } = require('humps');



router.post('/', (req, res, next) => {
  knex('users')
  .insert({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    hashed_password: bcrypt.hashSync(req.body.password, 12)
  })
  .returning('*')
  .then((users) => {
    delete users[0].hashed_password
      res.json(camelizeKeys(users[0]));
    })
    .catch((err) => {
      next(err);
      })
    })
