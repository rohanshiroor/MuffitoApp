const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
//const admin = require('firebase-admin');
//const firebaseui = require('firebaseui');
const Verify = require('./verify');
const firebase = require('firebase');
const resetRouter = express.Router();
resetRouter.use(bodyParser.json());
resetRouter.get('/phone',function(req,res){
    //res.send('Correcto');
    res.set('Cache-Control','public,max-age=300,s-maxage=600');
    res.sendFile(path.join(__dirname,'../views/reset.html'));
});
resetRouter.get('/otp',function(req,res){
    //res.send('Correcto');
    res.set('Cache-Control','public,max-age=300,s-maxage=600');
    res.sendFile(path.join(__dirname,'../views/reset_otp.html'));
});
resetRouter.get('/password',function(req,res){
    //res.send('Correcto');
    res.set('Cache-Control','public,max-age=300,s-maxage=600');
    res.sendFile(path.join(__dirname,'../views/reset_password.html'));
});
resetRouter.post('/password',function(req,res){
    var uid = req.body.userId;
    console.log(uid);
    var password = req.body.password;
    admin_app.auth().updateUser(uid,{
        password:password
    })
    .then(function(snapshot){
        firebase.database().ref('users/' + uid).child('password').set(password);
        res.end('Success');
    })
    .catch(function(error){
        console.log(error);
        res.end('Error');
    });
});
module.exports = resetRouter;
