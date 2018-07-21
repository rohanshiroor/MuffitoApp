const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const indexRouter = express.Router();
const path = require('path'); 
// const validator = require('express-validator');
const admin = require('firebase-admin');
// const firebaseui = require('firebaseui');
indexRouter.use(bodyParser.json());
// indexRouter.use(validator());
indexRouter.get('/',function(req,res){
    res.set('Cache-Control','public,max-age=300,s-maxage=600');
    //res.send('Correcto');
    res.sendFile(path.join(__dirname,'../views/index.html'));
    //res.render('register');
});

module.exports = indexRouter;