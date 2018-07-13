function tabChange(evt, met) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(met).style.display = "block";
    evt.currentTarget.className += " active";
    console.log(met=='phone');
    if(met=='phone'){
        document.getElementById('ph').style.display = "block";
        document.getElementById('regWithPhone').style.display = "block";
        document.getElementById('regWithEmail').style.display = "none";
        document.getElementById('em').style.display = "none";
        document.getElementById('phone').required = true;
        document.getElementById('email').required = false;
        document.getElementById('email').value = "";
    }
    else {
        document.getElementById('em').style.display = "block";
        document.getElementById('regWithEmail').style.display = "block";
        document.getElementById('regWithPhone').style.display = "none";
        document.getElementById('ph').style.display = "none";
        document.getElementById('email').required = true;
        document.getElementById('phone').required = false;
        document.getElementById('phone').value = "";
    }
}

document.addEventListener('DOMContentLoaded', function() {
if (top.location.pathname === '/verify'){
    
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phone-sign-in-recaptcha', {
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
      phone = getParameterByName("num");
      //console.log(phone);
      console.log(window);
      phone = "+91"+phone;
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
});

$('#register').on('submit',function(event){
    event.preventDefault();
    var ck_name = /^[A-Za-z]{3,20}$/;
    var ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var ck_username = /^[A-Za-z0-9_]{1,20}$/;
    var ck_password =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
    var numbers = /^\d+$/;
    var pin = /^[1-9][0-9]{5}$/;
    var ck_phone = /^[1-9][0-9]{9}$/;
    var ck_misctext = /^[A-Za-z0-9 ]+$/;
    var error = false;
    var fname = document.forms["register"]["firstname"].value; 
    if(!ck_name.test(fname)){
            document.forms["register"]["firstname"].style.borderColor = 'red';
            $("<span>Invalid First Name</span>").addClass('error').insertAfter("#firstname");
            error = true;
    }
    var lname = document.forms["register"]["lastname"].value;
    if(!ck_name.test(lname)){
            document.forms["register"]["lastname"].style.borderColor = 'red';
            $("<span>Invalid Last Name</span>").addClass('error').insertAfter("#lastname");
            error = true;
    }
    var age = document.forms["register"]["age"].value;
    if(!numbers.test(age)){
            document.forms["register"]["age"].style.borderColor = 'red';
            $("<span>Invalid Age</span>").addClass('error').insertAfter("#age");
            error = true;
    }
    var flatno = document.forms["register"]["flatno"].value;
    if(!numbers.test(flatno)){
            document.forms["register"]["flatno"].style.borderColor = 'red';
            $("<span>Invalid Flat no</span>").addClass('error').insertAfter("#flatno");
            error = true;
    }
    var streetName = document.forms["register"]["streetName"].value;
    if(!ck_misctext.test(streetName)){
            document.forms["register"]["streetName"].style.borderColor = 'red';
            $("<span>Invalid Street Name</span>").addClass('error').insertAfter("#streetName");
            error = true;
    }
    var area = document.forms["register"]["area"].value;
    if(!ck_misctext.test(area)){
            document.forms["register"]["area"].style.borderColor = 'red';
            $("<span>Invalid Area</span>").addClass('error').insertAfter("#area");
            error = true;
    }
    var city = document.forms["register"]["city"].value; 
    if(!ck_name.test(city)){
            document.forms["register"]["city"].style.borderColor = 'red';
            $("<span>Invalid City</span>").addClass('error').insertAfter("#city");
            error = true;
    }
    var pincode = document.forms["register"]["pincode"].value;
    if(!pin.test(pincode)){
            document.forms["register"]["pincode"].style.borderColor = 'red';
            $("<span>Invalid Pincode</span>").addClass('error').insertAfter("#pincode");
            error = true;
    }
    var dob = document.forms["register"]["dob"].value;
    var state = document.forms["register"]["state"].value;
    if(!ck_name.test(state)){
            document.forms["register"]["state"].style.borderColor = 'red';
            $("<span>Invalid State</span>").addClass('error').insertAfter("#state");
            error = true;
    }
    var country = document.forms["register"]["country"].value;
    if(!ck_name.test(country)){
            document.forms["register"]["country"].style.borderColor = 'red';
            $("<span>Invalid Country</span>").addClass('error').insertAfter("#country");
            error = true;
    }
    var email = document.forms["register"]["email"].value;
    if(!ck_email.test(email) && email!=''){
            document.forms["register"]["email"].style.borderColor = 'red';
            $("<span>Invalid Email</span>").addClass('error').insertAfter("#email");
            error = true;
    }
    var username = document.forms["register"]["username"].value;
    if(!ck_username.test(username)){
            document.forms["register"]["username"].style.borderColor = 'red';
            $("<span>Invalid Username</span>").addClass('error').insertAfter("#username");
            error = true;
    }
    var phone = document.forms["register"]["phone"].value;
    if(!ck_phone.test(phone) && phone!=''){
            document.forms["register"]["phone"].style.borderColor = 'red';
            $("<span>Invalid Phone Number</span>").addClass('error').insertAfter("#phone");
            error = true;
    }
    var password = document.forms["register"]["password"].value;
    if(!ck_password.test(password)){
            document.forms["register"]["password"].style.borderColor = 'red';
            $("<span>Invalid Password</span>").addClass('error').insertAfter("#password");
            error = true;
    }
    if (error){
      return false;
    }
    else { 
    $.ajax({
      url: '/register',
      method:'POST',
      contentType:'application/json',
      data: JSON.stringify({
        firstname:fname,
        lastname:lname,
        age: age,
        flatno: flatno,
        streetName: streetName,
        area: area,
        city:city,
        pincode:pincode,
        dob:dob,
        state:state,
        country:country,
        email:email,
        username:username,
        phone:phone,
        password:password
      }),
      success:function(response){
        console.log(response);
        // if (email && response=='sent'){
        //   //console.log(response);
        //   window.location.origin = window.location.protocol + "//" 
        //   + window.location.hostname 
        //   + (window.location.port ? ':' + window.location.port : '');
        //   window.location = window.location.origin+'/login';
        //   window.localStorage.setItem('emailForSignIn', email);
        // }
        // if(!email){
        if(response =="Success") {
        //var token = xhr.getResponseHeader('x-access-token');
        //window.localStorage.setItem("token",token);  
        window.location.origin = window.location.protocol + "//" 
          + window.location.hostname 
          + (window.location.port ? ':' + window.location.port : '');
          window.location = window.location.origin+'/verify?num='+phone;
        //}
        }
      }   
    });
  }
  });

  $('#otpverify').on('submit',function(event){
    event.preventDefault();
    var code = document.forms['otpverify']['otp'].value;
    phone = getParameterByName("num");
    console.log(phone);
    confirmationResult.confirm(code).then(function (result) {
    // User signed in successfully.
    var user = result.user;
    console.log(user.uid);
    $('#hidden').val(user.uid);
    // ...
    }).catch(function (error) {
    // User couldn't sign in (bad verification code?)
    // ...
    $('#hidden').val('wrong')
   });
   $.ajax({
    url: '/verify',
    method:'POST',
    contentType:'application/json',
    data: JSON.stringify({
     hidden: $('#hidden').val(),
     num: phone
    }),
    success:function(response,textStatus,xhr){
      if(response=='Success'){
        var token = xhr.getResponseHeader('x-access-token');
            //console.log(token);
            window.sessionStorage.setItem("token",token);
            $.ajax({
              url:'/home',
              method:'GET',
              headers: ({
                'x-access-token':token
              }),
              success:function(response,textStatus,xhr){
                if(response=="Success"){
                  var userId = xhr.getResponseHeader('x-access-uid');
                  firebase.database().ref('/users/' + userId).once('value')
                  .then(function(snapshot) {
                    var user = snapshot.val();
                  window.sessionStorage.setItem("user",JSON.stringify(user));            
                  window.location.origin = window.location.protocol + "//" 
                + window.location.hostname 
                + (window.location.port ? ':' + window.location.port : '');
                window.location = window.location.origin+'/search';
                  });
                }
              }
            });
        }
    }
   })
   });