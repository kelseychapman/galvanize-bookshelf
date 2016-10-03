'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');

router.get('/', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      res.json(humps.camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }

      res.json(humps.camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
 knex('books').insert(humps.decamelizeKeys(req.body)).returning('id').then(id => {
   console.log(id);
   const myId = id[0];
   knex('books').where('id', myId)
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url')
    .first()
    .then(row => {
     res.json(humps.camelizeKeys(row));
   })
 })
 .catch((err) => {
   next(err);
 });
})


router.patch('/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((artist) => {
      if (!artist) {
        return next();
      }

      return knex('books')
        .update({ name: req.body.name }, '*')
        .where('id', req.params.id);
    })
    .then((books) => {
      res.send(books[0]);
      res.json(humps.camelizeKeys(book));

    })
    .catch((err) => {
      next(err);
    });
});


// router.post('/',(req, res, next) => {
//   knex('books').insert(humps.decamelizeKeys(req.body))
//     .returning('id', 'title', 'author', 'genre', 'description', 'cover_url')
//     .first()
//     .then(row => {
//       res.json(humps.camelizeKeys(row));
//     })
//
// })



// router.post('/', (req, res) => {
//   knex('books').insert(humps.decamelizeKeys(req.body), 'id').then((num) => {
//     const id = num[0];
//     console.log('id:',id);
//     knex('books').where('id', id).first().then((data) => {
//       res.json(humps.camelizeKeys(data));
//     });
//   });
// });




module.exports = router;
