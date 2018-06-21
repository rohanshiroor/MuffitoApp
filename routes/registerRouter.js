const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const registerRouter = express.Router();
const path = require('path'); 
const validator = require('express-validator');
const admin = require('firebase-admin');
// const firebaseui = require('firebaseui');
registerRouter.use(bodyParser.json());
registerRouter.use(validator());
registerRouter.get('/',function(req,res){
    //res.send('Correcto');
    res.sendFile(path.join(__dirname,'../views/register.html'));
    //res.render('register');
});

var rand,mailOptions,host,link;
/*
registerRouter.post('/',function(req,res){
    
    var ck_misctext = /^[A-Za-z0-9 ]+$/;
    var ck_password =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
    var ck_phone = /^[0-9]{10}$/;
    var email = req.body.email;
    var phone = req.body.phone;
    req.checkBody('firstname','Invalid First Name').isAlpha("en-IN").isLength({min:3,max:20});
    req.checkBody('lastname','Invalid Last Name').isAlpha("en-IN").isLength({min:3,max:20});
    req.checkBody('age','Invalid Age').isNumeric();
    req.checkBody('flatno','Invalid Flat no').isNumeric();
    req.checkBody('streetName','Invalid Street Name').matches(ck_misctext);
    req.checkBody('area','Invalid Area').matches(ck_misctext);
    req.checkBody('city','Invalid City').isAlphanumeric("en-IN");
    req.checkBody('pincode','Invalid Pincode').isPostalCode("IN");
    req.checkBody('state','Invalid State').isAlpha("en-IN");
    req.checkBody('country','Invalid Country').isAlpha("en-IN");
    if(!phone)
    req.checkBody('email','Invalid Email').isEmail().normalizeEmail();

    req.checkBody('username','Invalid Username').isAlphanumeric("en-IN");

    if (!email)
    req.checkBody('phone','Invalid Phone Number').matches(ck_phone);

    req.checkBody('password','Invalid Password').matches(ck_password);
    var errors = req.validationErrors();
    if(errors){
        res.render('register',{ flash: { type: 'alert-danger', messages: errors }});
    }
   
    firebase.database().ref('users/' + req.body.username+'/address/').set({
        flatNo: req.body.flatno,
        streetName: req.body.streetName,
        area: req.body.area,
        city:req.body.city,
        pinCode: req.body.pincode
      });
      rand=Math.floor((Math.random() * 100) + 54);
      host=req.get('host');
      
      //console.log(email);
    if(!email){
        
    firebase.database().ref('users/' + req.body.username).set({
        username:req.body.username,
        password: req.body.password,
        firstName:req.body.firstname,
        lastName: req.body.lastname,
        age: req.body.age,
        dateOfBirth:req.body.dob,
        phoneNumber: req.body.phone,
        state: req.body.state,
        country: req.body.country
      });
      res.redirect('/verify?num='+req.body.phone);
    } 
    else {
        //console.log("wwww");
        firebase.database().ref('users/' + req.body.username).set({
            username:req.body.username,
            password: req.body.password,
            firstName:req.body.firstname,
            lastName: req.body.lastname,
            age: req.body.age,
            dateOfBirth:req.body.dob,
            email: req.body.email,
            state: req.body.state,
            country: req.body.country
          });
          var actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be whitelisted in the Firebase Console.
            url: "http://"+req.get('host')+"/login/verify?user="+req.body.username,
            // This must be true.
            handleCodeInApp: true,
          };
          firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
            .then(function() {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            console.log("Message sent: " + res.message);
            res.end("sent");
            //window.localStorage.setItem('emailForSignIn', email);
          })
            .catch(function(error) {
            // Some error occurred, you can inspect the code: error.code
            console.log(error);
            res.end("error");
        }); 
    }
});
 */
registerRouter.post('/',function(req,res){
    
   
      rand=Math.floor((Math.random() * 100) + 54);
      host=req.get('host');
      var email = req.body.email;
      var phone = "+91"+req.body.phone;
      //console.log(email);
    if(!email){ 
      
      admin_app.auth().createUser({
        emailVerified: false,
        phoneNumber: phone ,
        password: req.body.password ,
        disabled: false
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          //console.log("Successfully created new user:", userRecord.uid);
          firebase.database().ref('users/' + userRecord.uid).set({
            userName:req.body.username,
            password: req.body.password,
            firstName:req.body.firstname,
            lastName: req.body.lastname,
            phoneNumber: phone,
            age: req.body.age,
            dateOfBirth:req.body.dob,
            state: req.body.state,
            country: req.body.country
          });
          firebase.database().ref('users/' + userRecord.uid +'/address/').set({
            flatNo: req.body.flatno,
            streetName: req.body.streetName,
            area: req.body.area,
            city:req.body.city,
            pinCode: req.body.pincode
          });
          firebase.database().ref('phoneUidMap').child(phone).set(userRecord.uid)
          res.end("Success");
        })
        .catch(function(error) {
          //console.log("Error creating new user:", error);
          res.send("Error");
        });
    } 
    else {
        //console.log("wwww");
        //console.log(email);
        //console.log(req.body.password);
          var password = req.body.password;
          firebase.auth().createUserWithEmailAndPassword(email,password)
          .then(function(user){
            if(user){
            //  console.log(user)
            var root = firebase.database().ref();
            var userId = firebase.auth().currentUser.uid;
            console.log(userId);
            var postData = {
              userName:req.body.username,
              password: req.body.password,
              firstName:req.body.firstname,
              lastName: req.body.lastname,
              email: req.body.email,
              age: req.body.age,
              dateOfBirth:req.body.dob,
              state: req.body.state,
              country: req.body.country
            };
            root.child("users").child(userId).set(postData);
            var postData1 = {
              flatNo: req.body.flatno,
              streetName: req.body.streetName,
              area: req.body.area,
              city:req.body.city,
              pinCode: req.body.pincode
            };
            root.child("users").child(userId).child("address").set(postData1);           
            var actionCodeSettings = {
              // URL you want to redirect back to. The domain (www.example.com) for this
              // URL must be whitelisted in the Firebase Console.
              url: "http://"+req.get('host')+"/login/verify?user="+userId,
              //url: "http://"+req.get('host')+"/login",
              // This must be true.
              handleCodeInApp: true,
            };
            firebase.auth().sendSignInLinkToEmail(req.body.email, actionCodeSettings)
              .then(function() {
              // The link was successfully sent. Inform the user.
              // Save the email locally so you don't need to ask the user for it again
              // if they open the link on the same device.
              console.log("Message sent: " + res.message);
              res.end("sent");
              //window.localStorage.setItem('emailForSignIn', email);
              })
              .catch(function(error) {
              // Some error occurred, you can inspect the code: error.code
              console.log(error);
              res.end("error");
          });   
            }
          })
          .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          res.send("Error");
          // ...
          });
          //console.log('Step');
          // firebase.auth().onAuthStateChanged(function(user) {
          //   if(user){
          //     //console.log(user);
          //     //console.log('in IF');  
                       
          // }
          // else {
          //   console.log("Error");
          //   res.write('Error');
          // }
          // });
    }
});
module.exports = registerRouter;