const express = require('express');
const bodyParser = require('body-parser');
const privacyRouter = express.Router();
const path = require('path'); 
// const validator = require('express-validator');
// const firebaseui = require('firebaseui');
privacyRouter.use(bodyParser.json());
// indexRouter.use(validator());
privacyRouter.get('/',function(req,res){
    res.set('Cache-Control','public,max-age=300,s-maxage=600');
    //res.send('Correcto');
    res.sendFile(path.join(__dirname,'../views/privacy.html'));
    //res.render('register');
});

module.exports = privacyRouter;