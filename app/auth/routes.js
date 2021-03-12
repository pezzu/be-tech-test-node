const express = require('express');
const { authenticate } = require('./controller');

const get = () => {
  const router = express.Router();

  router.post('/', authenticate);

  return router;
}

module.exports = { get }