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
homeRouter.get('/signout',function(req,res){
    //res.redirect('/home/add');
    //var token = req.headers['x-access-token'];
    //console.log(req.decoded.uid);
    Verify.setOpts(null);
    res.end("Success");
});
homeRouter.get('/add',function(req,res){
    res.set('Cache-Control','public,max-age=300,s-maxage=600');
    if (Verify.verifyOpts())
    res.sendFile(path.join(__dirname,'../views/home_addRestaurant.html'));
    else 
    res.redirect('/login');
});
homeRouter.get('/update',function(req,res){
    res.set('Cache-Control','public,max-age=300,s-maxage=600');
    if (Verify.verifyOpts())
    res.sendFile(path.join(__dirname,'../views/home_updateProfile.html'));
    else 
    res.redirect('/login');
});
homeRouter.get('/contactus',function(req,res){
    res.set('Cache-Control','public,max-age=300,s-maxage=600');
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
    console.log(req.body);
    if(!req.body.exists){
        firebase.database().ref('cities/'+req.body.city).set({
            latitude:req.body.cityLat,
            longitude:req.body.cityLng
        })
        console.log("Yo");
    }
    var restDataRef = firebase.database().ref('restaurants/' + req.body.city).push();
    //console.log(restDataRef); 
    restDataRef.set({
        area:req.body.restArea,
        city:req.body.restCity,
        street:req.body.restStreetName,
        ratting: req.body.rating,
        openInfo:"open now",
        "restaurant type": req.body.restType,
        stagEntry: req.body.stagEntry,
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
    })
    .then(function(){
        console.log(restDataRef.key);
        res.end(restDataRef.key);
    })
    .catch(function(error){
        console.log(error);
        res.end('Error');
    });
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
homeRouter.post('/update',Verify.verifyUser,function(req,res){
    var uid = req.decoded.uid
    var phone = req.body.phone;
    if(phone)
        phone = "+91"+phone;
    firebase.database().ref('/users/' + uid).once('value')
    .then(function(snapshot){
        var user = snapshot.val();
        //console.log(user);
        if (phone!="" && user.phone != phone) {
            admin_app.auth().updateUser(uid,{
                phoneNumber:phone
            })
            .then(function(userRecord){
                updateUser(uid,req);
                if(user.phone!="")
                    firebase.database().ref('phoneUidMap').child(user.phone).remove();
                firebase.database().ref('phoneUidMap').child(phone).set(uid)
                res.header('x-access-uid',uid).end('Success');
            });
        }
         else if(req.body.password!="" && req.body.password!= user.password){
            admin_app.auth().updateUser(uid,{
                password:req.body.password
            })
            .then(function(snapshot){
                updateUser(uid,req);
                res.header('x-access-uid',uid).end('Success');
            });
        }
        else {
            updateUser(uid,req);
            res.header('x-access-uid',uid).end('Success');
        }
    });

    function updateUser(uid,req){
        firebase.database().ref('users/' + uid).set({
            userName:req.body.username,
            password: req.body.password,
            firstName:req.body.firstname,
            lastName: req.body.lastname,
            phone: req.body.phone,
            email:req.body.email,
            age: req.body.age,
            dateOfBirth:req.body.dob,
            state: req.body.state,
            country: req.body.country,
            profileUrl:"",
            macID:""
          });
          firebase.database().ref('users/' + uid +'/address/').set({
            flatNo: req.body.flatno,
            streetName: req.body.streetName,
            area: req.body.area,
            city:req.body.city,
            pinCode: req.body.pincode
          });
    }
});

module.exports = homeRouter;



