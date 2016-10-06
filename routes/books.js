var express = require('express');
var router = express.Router();
var knex = require('../knex');
module.exports = router;
const { camelizeKeys, decamelizeKeys } = require('humps');

router.get('/', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      res.json(camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    })
})


router.get('/:id', (req, res, next) => {
  knex('books')
    .first()
    .where('id', req.params.id)
    .then((books) => {
      res.json(camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    })
})

router.post('/', (req, res, next) => {
  knex('books')
  .insert(decamelizeKeys(req.body))
  .returning('*')
  // console.log(book)
  .then((books) => {
  res.json(camelizeKeys(books[0]));
})
.catch((err) => {
  next(err);
})
})

router.patch('/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .update({
      title: req.body.title,
      author: req.body.author,
      cover_url: req.body.coverUrl,
      description: req.body.description,
      genre: req.body.genre
    })
    .returning('*')
    .then((books) => {
    res.json(camelizeKeys(books[0]));
  })
  .catch((err) => {
    next(err);
  })
  })


router.delete('/:id', (req, res, next) => {
  knex('books')
   .where('id', req.params.id)
   .del()
   .returning('*')
   .then((books) => {
     delete books[0].id
   res.json(camelizeKeys(books[0]));
 })
 .catch((err) => {
   next(err);
 })
 })
