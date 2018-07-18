$("#reset_submit").on('click',function(){
    var ck_phone = /^[1-9][0-9]{9}$/;
    var error=false;
    phone = $.sanitize(document.getElementById('reset_phone').value);
    if(!ck_phone.test(phone)){
        document.getElementById('reset_phone').style.borderColor = 'red';
        $("<span>Invalid Phone Number</span>").addClass('error').insertAfter("#phone");
        error = true;
    }
    if(error){
        return error;
    }
    else {
    phone = "+91"+phone;
    firebase.database().ref('phoneUidMap').child(phone).once('value')
    .then(function(snapshot){
        $('#errorPh').remove();
        var uid = snapshot.val();
        //console.log(user);
        window.sessionStorage.setItem('phoneNumber',phone);
        window.sessionStorage.setItem('uid',uid);
        window.location.origin = window.location.protocol + "//" 
          + window.location.hostname 
          + (window.location.port ? ':' + window.location.port : '');
          window.location = window.location.origin+'/reset/otp';
    })
    .catch(function(error){
        document.getElementById('reset_phone').style.borderColor = 'red';
        $("<span id='errorPh'>No Registered User Found</span>").addClass('error').insertAfter("#reset_phone");
    })
    }
})

document.addEventListener('DOMContentLoaded', function() {
    if (top.location.pathname === '/reset/otp'){
        phone = window.sessionStorage.getItem('phoneNumber');
        if(phone){
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phone-reset-recaptcha', {
            'size': 'invisible',
            'callback': function(response) {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              window.recaptchaVerifier.render().then(function(widgetId) {
                window.recaptchaWidgetId = widgetId;
              });
              //console.log(window.recaptchaVerifier);
              var recaptchaResponse = grecaptcha.getResponse(window.recaptchaWidgetId);
            
            },
            'expired-callback': function(){
                console.log("Error");
                grecaptcha.reset(window.recaptchaWidgetId);
            }
          });
          var appVerifier = window.recaptchaVerifier;
          //console.log(phone);
          //console.log(window);
          //phone = "+91"+phone;
            firebase.auth().signInWithPhoneNumber(phone, appVerifier)
            .then(function (confirmationResult) {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              window.confirmationResult = confirmationResult;
              console.log(confirmationResult);
            }).catch(function (error) {
              // Error; SMS not sent
              // ...
              console.log("SMS not sent"+error);
              grecaptcha.reset(window.recaptchaWidgetId);
            });  
    }
    else {
        window.location.origin = window.location.protocol + "//" 
        + window.location.hostname 
        + (window.location.port ? ':' + window.location.port : '');
        window.location = window.location.origin+'/login';
    }
    }
    if (top.location.pathname === '/reset/password'){
        var phone = window.sessionStorage.getItem('phoneNumber');
        var uid = window.sessionStorage.getItem('uid');
        if(phone || !uid){
            window.location.origin = window.location.protocol + "//" 
            + window.location.hostname 
            + (window.location.port ? ':' + window.location.port : '');
            window.location = window.location.origin+'/login';
        }
    }
    });

    $('#otp_submit').on('click',function(event){
        event.preventDefault();
        var code = document.getElementById('reset_otp').value;
        phone = window.sessionStorage.getItem('phoneNumber');
        //console.log(phone);
        confirmationResult.confirm(code).then(function (result) {
        // User signed in successfully.
        var user = result.user;
        //console.log(user.uid);
        $('#errorOtp').remove();
        window.sessionStorage.removeItem('phoneNumber');
        window.location.origin = window.location.protocol + "//" 
        + window.location.hostname 
        + (window.location.port ? ':' + window.location.port : '');
        window.location = window.location.origin+'/reset/password';
        // ...
        }).catch(function (error) {
        // User couldn't sign in (bad verification code?)
        // ...
        document.getElementById('reset_otp').style.borderColor = 'red';
        $("<span id='errorOtp'>Invalid OTP! Please Try Again</span>").addClass('error').insertAfter("#phone");
       });
                //console.log(token);
    });

    $("#reset_password").on('submit',function(event){
        event.preventDefault();
        var ck_password =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
        var error = false;
        var pass1 = document.forms['reset_password']['reset_pass1'].value;
        var pass2 = document.forms['reset_password']['reset_pass2'].value;
        //console.log(ck_password.test(pass1));
        if(!ck_password.test(pass1) || !ck_password.test(pass2)) {
            document.forms['reset_password']['reset_pass2'].style.borderColor = 'red';
            $('<span>Invalid Password</span>').addClass('error').insertAfter('#reset_pass2');
            error = true;
        }
        //console.log(pass1);
        //console.log(pass2);
        if(pass1!=pass2){
            document.forms['reset_password']['reset_pass2'].style.borderColor = 'red';
            $("<span>Passwords don't match</span>").addClass('error').insertAfter('#reset_pass2');
            error = true;
        }
        if(error){
            return false;
        }
        else {
            var uid = window.sessionStorage.getItem('uid');
            //console.log('reset');
            $.ajax({
               url:'/reset/password',
               method:'POST',
               contentType:'application/json',
               data:JSON.stringify({
                   password:pass1,
                   userId: uid
               }),
               success: function(response){
                    console.log(response);
                    if(response=='Success'){ 
                        window.sessionStorage.removeItem('uid');   
                        window.location.origin = window.location.protocol + "//" 
                        + window.location.hostname 
                        + (window.location.port ? ':' + window.location.port : '');
                        window.location = window.location.origin+'/login';
                    }
               }
            });
        }
    });
    