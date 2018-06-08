const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
//const admin = require('firebase-admin');
//const firebaseui = require('firebaseui');
const firebase = require('firebase');
const verifyRouter = express.Router();
verifyRouter.use(bodyParser.json());
verifyRouter.get('/',function(req,res){
    //res.send('Correcto');
    res.sendFile(path.join(__dirname,'../views/verify.html'));
});
verifyRouter.post('/',function(req,res){
    if(req.body.hidden == 'wrong')
        res.end('Error');
    else {
    console.log(req.body.hidden);
    admin_app.auth().updateUser(req.body.hidden, {
        emailVerified: true,
    })
    .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        //console.log("Successfully updated user", userRecord.toJSON());
        res.end('Success');
    })
    .catch(function(error) {
        console.log("Error updating user:", error);
        res.end(error);
    });
    }
});
module.exports = verifyRouter;
