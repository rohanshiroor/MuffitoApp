const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const path = require('path');
const searchRouter = express.Router();
/* GET home page. */
searchRouter.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.set('Cache-Control','public,max-age=300,s-maxage=600');
  res.sendFile(path.join(__dirname,'../views/search.html'));
});

module.exports = searchRouter;
