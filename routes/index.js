const express = require('express');
const auth = require('../app/auth/routes');
const records = require('../app/records/routes');

const get = () => {
  const router = express.Router();

  router.use('/auth', auth.get());
  router.use('/records', records.get());

  return router;
}

module.exports = { get }