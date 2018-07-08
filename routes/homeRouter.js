const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const path = require('path'); 
const validator = require('express-validator');
const nodemailer = require('nodemailer');
const Verify = require('./verify');

// const flash = require('flash');
//const firebaseui = require('firebaseui');
const homeRouter = express.Router();
homeRouter.use(bodyParser.json());
homeRouter.use(validator());
// homeRouter.use(flash());
homeRouter.get('/',Verify.verifyUser,function(req,res){
    //res.redirect('/home/add');
    //console.log(req.decoded.uid);
    var token = req.headers['x-access-token'];
    var uid = req.decoded.uid
    Verify.setOpts(token);
    res.header('x-access-uid',uid).send('Success');
});
homeRouter.get('/signout',Verify.verifyUser,function(req,res){
    //res.redirect('/home/add');
    //var token = req.headers['x-access-token'];
    //console.log(req.decoded.uid);
    Verify.setOpts(null);
    res.end("Success");
});
homeRouter.get('/add',function(req,res){
    if (Verify.verifyOpts())
    res.sendFile(path.join(__dirname,'../views/home_addRestaurant.html'));
    else 
    res.redirect('/login');
});
homeRouter.get('/update',function(req,res){
    if (Verify.verifyOpts())
    res.sendFile(path.join(__dirname,'../views/home_updateProfile.html'));
    else 
    res.redirect('/login');
});
homeRouter.get('/contactus',function(req,res){
    if (Verify.verifyOpts())
    res.sendFile(path.join(__dirname,'../views/home_contactUs.html'));
    else 
    res.redirect('/login');
});
homeRouter.post('/add',Verify.verifyUser,function(req,res){
    //var ck_misctext = /^[A-Za-z0-9 ]+$/;
    // req.checkBody('restName','Invalid Restaurant Name').trim().isAlphanumeric("en-IN");
    // req.checkBody('restCity','Invalid Restaurant City').trim().isAlphanumeric("en-IN");
    // req.checkBody('restArea','Invalid Restaurant Area').trim().isAlphanumeric("en-IN");
    // req.checkBody('restStreetName','Invalid Restaurant Street Name').trim().isAlphanumeric("en-IN");
    // var errors = req.validationErrors();
    // if(errors){
    //     res.render('home',{ flash: { type: 'alert-danger', messages: errors }});
    // }
    firebase.database().ref('restaurant/' + req.body.restName).set({
        area:req.body.restArea,
        city:req.body.restCity,
        street:req.body.restStreetName,
        rating: req.body.rating,
        restaurantType: req.body.restType,
        stagEntry: req.body.stagEntry,
        openInfo:req.body.restOpen,
        name: req.body.restName,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        mondayOpen: req.body.monOp,
        mondayClose:req.body.monCl,
        tuesdayOpen: req.body.tueOp,
        tuesdayClose: req.body.tueCl,
        wednesdayOpen: req.body.wedOp,
        wednesdayClose: req.body.wedCl , 
        thursdayOpen: req.body.thOp,
        thursdayClose: req.body.thCl,
        fridayOpen: req.body.friOp,
        fridayClose: req.body.friCl,
        saturdayOpen: req.body.satOp,
        saturdayClose: req.body.satCl,
        sundayOpen: req.body.sunOp,
        sundayClose: req.body.sunCl
    });
    res.end('Success');
});
homeRouter.post('/contactus',Verify.verifyUser,function(req,res){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'muffito1234@gmail.com',
          pass: 'muffito1234$'
        }
      });
      var mailOptions = {
        from: 'muffito1234@gmail.com',
        to: 'info@muffito.com',
        subject: 'Feedback by  '+req.body.name,
        text: 'Name: '+req.body.name+'\nEmail: '+req.body.email+'\nSubject: '+req.body.subject+'\nMessage: '+req.body.message
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.send("Error");
        } else {
          res.send('Sent');
        }
      });      
});
module.exports = homeRouter;



