const express = require('express');
const app = require('../../server');

module.exports.handler = async (event, context) => {
  const server = express();
  server.use('/.netlify/functions/api', app);
  return server(event, context);
};