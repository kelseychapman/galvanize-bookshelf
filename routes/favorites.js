var express = require('express');
var router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt');
const {camelizeKeys, decamelizeKeys} = require('humps');
module.exports = router;

const authorize = function(req, res, next){
  if(!req.session.userInfo){
    res.type('text/plain')
    res.status('401')
    res.send('Unauthorized')
  } else {
    next();
  }

}

router.get('/', authorize, (req, res, next) => {
    knex('favorites')
        .innerJoin('books', 'favorites.book_id', 'books.id')
        .where('favorites.user_id', 1)
        .then((favorites) => {
            res.json(camelizeKeys(favorites));
        })
});


router.get('/:id', authorize, (req, res, next) => {
    knex('favorites')
        .where('book_id', req.query.bookId)
        .then((favorites) => {
            if (favorites.length === 0) {
                res.send(false)
            } else {
                res.send(true)
            }
        })
})


router.post('/', authorize, (req, res, next) => {
  knex('favorites')
  .insert({
    book_id: req.body.bookId,
    user_id: 1
  }) .returning('*')
  .then((favorites) => {
    res.json(camelizeKeys(favorites[0]));
  })
})


router.delete('/', authorize, (req, res, next) => {
knex('favorites')
  .where('book_id', req.body.bookId)
  .del()
  .returning('*')
  .then((favorites) => {
    delete favorites[0].id;
    res.json(camelizeKeys(favorites[0]));
  })
})
