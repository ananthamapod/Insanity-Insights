const express = require('express')
const app = express.Router()

app.get('/', function(req, res) {
  res.render('index', { ct: req._csrfToken });
});

module.exports = app
