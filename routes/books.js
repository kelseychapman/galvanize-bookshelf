'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const knex = require('../knex');
const {
  camelizeKeys,
  decamelizeKeys
} = require('humps');
const router = express.Router();

router.get('/', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((rows) => {
      const books = camelizeKeys(rows);
      res.send(books);
    })
    .catch((err) => {
      next(err);
    })
})

router.get('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }
  knex('books')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }
      const book = camelizeKeys(row);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    })
})

router.post('/', (req, res, next) => {
  const {
    title,
    author,
    genre,
    description,
    coverUrl
  } = req.body;

  const insertBook = {
    title,
    author,
    genre,
    description,
    coverUrl
  };

  knex('books')
    .insert(decamelizeKeys(insertBook), '*')
    .then((rows) => {
      const book = camelizeKeys(rows[0]);
      res.send(book);
    })
    .catch((err) => {
      next(err);
    })
})

router.patch('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }
  knex('books')
    .where('id', id)
    .first()
    .then((books) => {
      if (!books) {
        return next();
      }

      const {
        title,
        author,
        genre,
        description,
        coverUrl
      } = req.body;
      const updateBook = {};

      if (title) {
        updateBook.title = title;
      }

      if (author) {
        updateBook.author = author;
      }

      if (genre) {
        updateBook.genre = genre;
      }

      if (description) {
        updateBook.description = description;
      }

      if (coverUrl) {
        updateBook.coverUrl = coverUrl;
      }

      return knex('books')
        .update(decamelizeKeys(updateBook), '*')
        .where('id', id);
    })
    .then((rows) => {
      const book = camelizeKeys(rows[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  let book

  knex('books')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }

      book = camelizeKeys(row);

      return knex('books')
        .del()
        .where('id', id);
    })
    .then(() => {
      delete book.id;
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
