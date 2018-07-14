const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const path = require('path'); 
const validator = require('express-validator');
const admin = require('firebase-admin');
const Verify = require('./verify');
//const firebaseui = require('firebaseui');
const loginRouter = express.Router();
loginRouter.use(bodyParser.json());
loginRouter.use(validator());
loginRouter.get('/',function(req,res){
    //res.send('Correcto');
    res.sendFile(path.join(__dirname,'../views/login.html'));
});
loginRouter.get('/verify',function(req,res){
    //res.send('Correcto');
    var userId = req.query.user;
    var oobCode = req.query.oobCode;
    var apiKey = req.body.apiKey;
    if(!oobCode && !apiKey){
        res.send(error);
    }
    admin_app.auth().updateUser(userId, {
        emailVerified: true,
    })
    .then(function(){
        res.redirect('/login');
    })
    .catch(function(error){
        res.send(error);
    });
});
// loginRouter.get('/home',function(req,res){
//     res.redirect('/home');
// });
loginRouter.post('/',function(req,res){
    //res.send('Correcto');
    var User = req.body.emailOrPhone;
    //console.log(User);
    req.checkBody('emailOrPhone').isEmail();
    var errors = req.validationErrors();
        if(errors){
            console.log(errors);
            var phoneNumber = "+91"+User;
            var password = "";
            admin_app.auth().getUserByPhoneNumber(phoneNumber)
            .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            //console.log("Successfully fetched user data:", userRecord.toJSON());
            firebase.database().ref('/users/' + userRecord.uid).once('value')
            .then(function(snapshot) {
               var user = snapshot.val();
               password = user.password;
               var macID = user.macID;
               console.log(password);
               if(password == req.body.password && (userRecord.emailVerified || macID!=""))
               {
                var token = Verify.getToken({uid:userRecord.uid});
                //console.log(token);
                res.header('x-access-token',token).send('Success');
                }
                else {
                    res.end('Invalid Password or Phone Number Unverified');
                }
            });
            })
            .catch(function(error) {
                console.log("Error fetching user data:", error);
            });
        }
        if(1 != 1) {
            //console.log(User);
            //console.log(req.body.password);
            //var user = firebase.auth().currentUser;
            //console.log(user);
            var password = req.body.password;
            firebase.auth().signInWithEmailAndPassword(User,password)
            .then(function(user){
                emailVerified = firebase.auth().currentUser.emailVerified;
                console.log(emailVerified);
                if (!emailVerified){
                    firebase.auth().signOut()
                    .then(function() {
                        res.end('Email Unverified');
                    })
                    .catch(function(error) {
                        //res.end(error);
                        res.send("Error");
                    });
                }
                else {
                    res.send('Success');
                }
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                //res.end(errorMessage+""+errorCode);
                res.send('Error');
                // ...
              });
            //   firebase.auth().onAuthStateChanged(function(user) {
            //     if(user){
         
            //   }
            //   else {
            //     firebase.auth().signOut()
            //     .then(function() {
            //         res.end('No User');
            //     })
            //     .catch(function(error) {
            //         res.end(error);
            //     });
            //   }
            // });
        }
    });
    // .catch(function(error) {
    //     // Some error occurred, you can inspect the code: error.code
    //     console.log(error);
    //     res.end("User does not exist");
    // }); 
// });
    // loginRouter.post('/auth',function(req,res){
    //     firebase.database().ref('users/' + req.body.uid).set({
    //         email: req.body.email,
    //         phoneNumber: req.body.phoneNumber,
    //         displayName: req.body.displayName,
    //         username:"",
    //         password: "",
    //         age: "",
    //         dateOfBirth:"",
    //         state: "",
    //         country: ""
    //       });
    //       firebase.database().ref('users/' + req.body.uid +'/address/').set({
    //         flatNo: "",
    //         streetName: "",
    //         area: "",
    //         city:"",
    //         pinCode: ""
    //       });
    //       //console.log("Done");
    //       res.end('Done');
    // })

    loginRouter.post("/social",function(req,res){
        //console.log(req.body.phoneNumber);
        firebase.database().ref('/users/' + req.body.uid).once('value')
        .then(function(snapshot){
        var user = snapshot.val();
        if(user==null) {
            firebase.database().ref('users/' + req.body.uid).set({
                email: req.body.email,
                phone: "",
                firstName: req.body.firstName,
                lastName:req.body.lastName,
                userName:"",
                password: "",
                age: "",
                dateOfBirth:"",
                state: "",
                country: "",
                profileUrl:"",
                macID:""
              });
              firebase.database().ref('users/' + req.body.uid +'/address/').set({
                flatNo: "",
                streetName: "",
                area: "",
                city:"",
                pinCode: ""
              })
              .then(function(){
                console.log("Social");
                var token = Verify.getToken({uid:req.body.uid});
                res.header('x-access-token',token).send('Success');
            })
              .catch(function(error) {
                console.log("Error creating new user:", error);
                res.end("Error");
              });
        }
        else {
            var token = Verify.getToken({uid:req.body.uid});
            res.header('x-access-token',token).send('Success');
        }
        });
        
    })
module.exports = loginRouter;