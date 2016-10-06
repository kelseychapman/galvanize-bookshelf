var express = require('express');
var router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt');
module.exports = router;
const {
    camelizeKeys,
    decamelizeKeys
} = require('humps');


router.get('/', (req, res, next) => {
    knex('favorites')
        .innerJoin('books', 'favorites.book_id', 'books.id')
        .where('favorites.user_id', 1)
        .then((favorites) => {
            res.json(camelizeKeys(favorites));
        })
});


router.get('/:id', (req, res, next) => {
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


router.post('/', (req, res, next) => {
  knex('favorites')
  .insert({
    book_id: req.body.bookId,
    user_id: 1
  }) .returning('*')
  .then((favorites) => {
    res.json(camelizeKeys(favorites[0]));
  })
})
