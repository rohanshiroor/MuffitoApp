var phone;
var restData;
(function($) {
	$.sanitize = function(input) {
		var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
					 replace(/<[\/\!]*?[^<>]*?>/gi, '').
					 replace(/<style[^>]*?>.*?<\/style>/gi, '').
					 replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
	    return output;
	};
})(jQuery);

function getParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var map, infoWindow;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 14
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            document.getElementById("latitude").value = position.coords.latitude;
            document.getElementById("longitude").value = position.coords.longitude; 
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }  
$('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
})
  
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

function valInp(form,field) {
    //console.log("Yo");
    var formInp = document.forms[form][field].value;
    formInp = $.sanitize(formInp);
    document.forms[form][field].value = formInp;
    $(document.forms[form][field]).next().remove();
    document.forms[form][field].style.borderColor = 'black';
}

function val_phone() {  
    var phone_num = document.forms["register"]["phone"].value;
    //alert(phone);
    phone_num = $.sanitize(phone_num);
    document.forms["register"]["phone"].value = phone_num;
    $(document.forms["register"]["phone"]).next().remove();
    document.forms[form][field].style.borderColor = 'black';
}

// Initialize Firebase
// TODO: Replace with your project's customized code snippet


document.addEventListener('DOMContentLoaded', function() {
    //console.log("Ready");
    const config = {
        apiKey: 'AIzaSyBRIt05f_gxZGvC0HTPpjxGh0hsglgl2I4',
        authDomain: 'muffito-88994.firebaseapp.com',
        databaseURL: 'https://muffito-88994.firebaseio.com',
        projectId: 'muffito-88994',
        storageBucket: 'muffito-88994.appspot.com',
        messagingSenderId: '1072542373026'
    };
    firebase.initializeApp(config);
    // var storage = firebase.storage();
    // var auth = app.auth();
    if (top.location.pathname === '/login')
    {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // Initialize the FirebaseUI Widget using Firebase.
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem('emailForSignIn');
      firebase.auth().signInWithEmailLink(email, window.location.href)
      .then(function(result) {
        window.localStorage.removeItem('emailForSignIn');
      })
      .catch(function(error) {
        console.log(error);
      });
    }
    var uiConfig = {
    callbacks: {
      signInSuccess: function(currentUser,credential, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
          firebase.database().ref('users/' + currentUser.uid).set({
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            displayName: currentUser.displayName,
            username:"",
            password: "",
            age: "",
            dateOfBirth:"",
            state: "",
            country: ""
          });
          firebase.database().ref('users/' + currentUser.uid +'/address/').set({
            flatNo: "",
            streetName: "",
            area: "",
            city:"",
            pinCode: ""
          })
          .then(function(){
            window.location.origin = window.location.protocol + "//" 
            + window.location.hostname 
            + (window.location.port ? ':' + window.location.port : '');
            window.location = window.location.origin+'/home';
          });  
        return false;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    //signInSuccessUrl: top.location.pathname+'/home',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
  };
  ui.start('#firebaseui-auth-container', uiConfig);
}
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
      if (email && response=='sent'){
        //console.log(response);
        window.location.origin = window.location.protocol + "//" 
        + window.location.hostname 
        + (window.location.port ? ':' + window.location.port : '');
        window.location = window.location.origin+'/login';
        window.localStorage.setItem('emailForSignIn', email);
      }
      if(!email){
        window.location.origin = window.location.protocol + "//" 
        + window.location.hostname 
        + (window.location.port ? ':' + window.location.port : '');
        window.location = window.location.origin+'/verify?num='+phone;
      }
    }   
  });
}
});
$('#login').on('submit',function(event){
  event.preventDefault();
  //console.log('Im here');
  var ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  var ck_password =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
  var ck_phone = /^[1-9][0-9]{9}$/;
  var error = false;
  var emailOrPhone = document.forms["login"]["emailOrPhone"].value;
  if(!ck_email.test(emailOrPhone) && emailOrPhone!=''){
    if(!ck_phone.test(emailOrPhone) && phone!=''){
          document.forms["login"]["emailOrPhone"].style.borderColor = 'red';
          $("<span>Invalid Email</span>").addClass('error').insertAfter("#emailOrPhone");
          error = true;
    }
  }
  var password = document.forms["login"]["password"].value;
  if(!ck_password.test(password)){
          document.forms["login"]["password"].style.borderColor = 'red';
          $("<span>Invalid Password</span>").addClass('error').insertAfter("#password");
          error = true;
  }
  if (error){
    return false;
  }
  else {
    $.ajax({
      url: '/login',
      method:'POST',
      contentType:'application/json',
      data: JSON.stringify({
        emailOrPhone: emailOrPhone,
        password: password
      }),
      success:function(response){
        console.log(response);
        if (response=='Success'){
          window.location.origin = window.location.protocol + "//" 
          + window.location.hostname 
          + (window.location.port ? ':' + window.location.port : '');
          window.location = window.location.origin+'/home';
        }
      }
    });
  }
  });
$('#contactus').on('submit',function(event){
  event.preventDefault();
  var ck_name = /^[A-Za-z ]{3,20}$/;
  var ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  var ck_misctext = /^[A-Za-z0-9 ]+$/;
  var error = false;
  var name = document.forms["contactus"]["name"].value; 
  if(!ck_name.test(name)){
    document.forms["contactus"]["name"].style.borderColor = 'red';
    $("<span>Invalid Name</span>").addClass('error').insertAfter("#name");
    error = true;
 }
 var email = document.forms["contactus"]["email"].value;
  if(!ck_email.test(email)){
          document.forms["contactus"]["email"].style.borderColor = 'red';
          $("<span>Invalid Email</span>").addClass('error').insertAfter("#email");
          error = true;
  }
  var subject = document.forms["contactus"]["subject"].value;
  if(!ck_misctext.test(subject)){
    document.forms["contactus"]["subject"].style.borderColor = 'red';
    $("<span>Invalid Subject</span>").addClass('error').insertAfter("#subject");
    error = true;
  }
  var message = document.forms["contactus"]["message"].value;
  if(!ck_misctext.test(message)){
    document.forms["contactus"]["message"].style.borderColor = 'red';
    $("<span>Invalid Message</span>").addClass('error').insertAfter("#message");
    error = true;
  }
  if (error){
    return false;
  }
  else {
  $.ajax({
    url: '/home/contactus',
    method:'POST',
    contentType:'application/json',
    data: JSON.stringify({
      name: name,
      email:email,
      subject:subject,
      message:message
    }),
    success:function(response){
      if (response=='Sent'){
        document.forms["contactus"]["name"].value = " ";
        document.forms["contactus"]["email"].value = " ";
        document.forms["contactus"]["subject"].value = " ";
        document.forms["contactus"]["message"].value = " ";
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
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
  success:function(response){
    if(response=='Success'){
      window.location.origin = window.location.protocol + "//" 
          + window.location.hostname 
          + (window.location.port ? ':' + window.location.port : '');
          window.location = window.location.origin+'/login';
    }
  }
 })
 });
$('#restDet').on('submit',function(event){
  event.preventDefault();
  var ck_misctext = /^[A-Za-z0-9 ]+$/;
  var ck_rating = /^[1-5]$/;
  var area = document.forms["restDet"]["restArea"].value;
  var error = false;
  if(!ck_misctext.test(area)){
          document.forms["restDet"]["restArea"].style.borderColor = 'red';
          $("<span>Invalid Area</span>").addClass('error').insertAfter("#restArea");
          error = true;
  }
  var city = document.forms["restDet"]["restCity"].value; 
  if(!ck_misctext.test(city)){
          document.forms["restDet"]["restCity"].style.borderColor = 'red';
          $("<span>Invalid City</span>").addClass('error').insertAfter("#restCity");
          error = true;
  }
  var streetName = document.forms["restDet"]["restStreetName"].value;
  if(!ck_misctext.test(streetName)){
          document.forms["restDet"]["restStreetName"].style.borderColor = 'red';
          $("<span>Invalid Street Name</span>").addClass('error').insertAfter("#restStreetName");
          error = true;
  }
  var name = document.forms["restDet"]["restName"].value; 
  if(!ck_misctext.test(name)){
          document.forms["restDet"]["restName"].style.borderColor = 'red';
          $("<span>Invalid Restaurant Name</span>").addClass('error').insertAfter("#restName");
          error = true;
  }
  var rating = document.forms["restDet"]["rating"].value;
  if(!ck_rating.test(rating)){
          document.forms["restDet"]["rating"].style.borderColor = 'red';
          $("<span>Invalid Rating</span>").addClass('error').insertAfter("#rating");
          error = true;
  }
  //console.log(storage);
  if (error){
    return false;
  }
  else {
    
    //console.log(ImagesRef.fullPath);
    $.ajax({
      url: '/home/add',
      method:'POST',
      contentType:'application/json',
      data: JSON.stringify({
        restName: name,
        restCity: city,
        restArea: area,
        restStreetName: streetName,
        rating: rating,
        restType: document.forms["restDet"]["restType"].value,
        stagEntry: document.forms["restDet"]["stagEntry"].value, 
        restOpen: document.forms["restDet"]["restOpen"].value,
        latitude: document.forms["restDet"]["latitude"].value,
        longitude: document.forms["restDet"]["longitude"].value,
        monOp: document.forms["restDet"]["monOp"].value,
        monCl: document.forms["restDet"]["monCl"].value,
        tueOp: document.forms["restDet"]["tueOp"].value,
        tueCl: document.forms["restDet"]["tueCl"].value,
        wedOp: document.forms["restDet"]["wedOp"].value,
        wedCl: document.forms["restDet"]["wedCl"].value,
        thOp: document.forms["restDet"]["thOp"].value,
        thCl: document.forms["restDet"]["thCl"].value,
        friOp: document.forms["restDet"]["friOp"].value,
        friCl: document.forms["restDet"]["friCl"].value,
        satOp: document.forms["restDet"]["satOp"].value,
        satCl: document.forms["restDet"]["satCl"].value,
        sunOp: document.forms["restDet"]["sunOp"].value,
        sunCl: document.forms["restDet"]["sunCl"].value
      }),
      success:function(response){
        if(response=='Success'){
          
          var selectedFile = document.getElementById('restImage');
          if(selectedFile.files.length != 0){
          var storageRef = firebase.storage().ref();
          //console.log(selectedFile);
          var ImagesRef = storageRef.child('images/'+selectedFile.files[0].name);
          ImagesRef.put(selectedFile.files[0])
          .then(function(snapshot){
            snapshot.ref.getDownloadURL().then(function(downloadURL){
              firebase.database().ref('restaurant').child(name).child('restImage').set(downloadURL);
            });
            console.log('Uploaded File');
            var fileLength = selectedFile.files.length;
            for (var i=1; i < fileLength ; i++ ) {
              console.log(i);
            ImagesRef = storageRef.child('images/'+selectedFile.files[i].name);
            ImagesRef.put(selectedFile.files[i])
            .then(function(snapshot){
              snapshot.ref.getDownloadURL().then(function(downloadURL){
                firebase.database().ref('restaurant').child(name).child('extraImage').push(downloadURL).then(function(){
                  if(i==fileLength){
                    window.location.origin = window.location.protocol + "//" 
                    + window.location.hostname 
                    + (window.location.port ? ':' + window.location.port : '');
                    window.location = window.location.origin+'/home/add';
                  }
                });
              })
              console.log('Uploaded File');
              
              //console.log(i,fileLength-1);
            });
          }
          });
      } 
      else {
        window.location.origin = window.location.protocol + "//" 
        + window.location.hostname 
        + (window.location.port ? ':' + window.location.port : '');
        window.location = window.location.origin+'/home/add';
      }
      }
      }
});
  }
});
function login(){
    var username = document.forms["login"]["username"];
    username = $.sanitize(username);
    document.forms["login"]["email"] = username;
    var password = document.forms["login"]["password"];
    password = $.sanitize(password);
    document.forms["login"]["password"] = password;
}

function pageChange(evt,page){
  if(page!='signout'){
  window.location.origin = window.location.protocol + "//" 
  + window.location.hostname 
  + (window.location.port ? ':' + window.location.port : '');
  window.location = window.location.origin+'/home/'+page;
  }
  else {
    firebase.auth().signOut()
    .then(function() {
      window.location.origin = window.location.protocol + "//" 
      + window.location.hostname 
      + (window.location.port ? ':' + window.location.port : '');
      window.location = window.location.origin+'/login';
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
  }
}

function getData(){
  var dataArray = [];
  var restRef = firebase.database().ref('restaurant')
  restRef.orderByValue().once('value',function(snapshot){
    snapshot.forEach(function(data){
        //console.log(data.key);
        dataArray.push(data.val());
    });
    //console.log(JSON.stringify(dataArray));
    window.localStorage.setItem("snapshot",JSON.stringify(dataArray));
  }); 
}
$("#searchRest").change(function restSearch() {
  var data = JSON.parse(window.localStorage.getItem("snapshot"));
  //console.log(data[0]);
  nameArray = [];
  cityArray = [];
  areaArray = [];
  extraImageArray = [];
  openInfoArray = [];
  ratingArray = [];
  restaurantTypeArray = [];
  stagEntryArray = [];
  streetArray = [];
  distanceArray = [];
  costArray = [];
  costArrayhigh = [];
  imageUrlArray = [];
  mondayOpenArray = [];
  tuesdayOpenArray = [];
  wednesdayOpenArray = [];
  thursdayOpenArray = [];
  fridayOpenArray = [];
  saturdayOpenArray = [];
  sundayOpenArray = [];
  mondayCloseArray = [];
  tuesdayCloseArray = [];
  wednesdayCloseArray = [];
  thursdayCloseArray = [];
  fridayCloseArray = [];
  saturdayCloseArray = [];
  sundayCloseArray = [];
  $('#restCards').empty();
  var ck_misctext = /^[A-Za-z0-9 ]+$/;
  var error = false;
  var searText = document.forms["searchRest"]["searchText"].value; 
  var stagEntry = document.forms["searchRest"]["stagEntryBox"].checked;
  var openNow = document.forms["searchRest"]["openNowBox"].checked;

  if(!ck_misctext.test(searText)){
          document.forms["searchRest"]["searchText"].style.borderColor = 'red';
          $("<span>Invalid Search Text</span>").addClass('error').insertAfter("#searchText");
          error = true;
  }
  if (error) {
    return false
  }
  var count = Object.keys(data).length;
  console.log(count);
  var flag = 0;
  //console.log(data[0])
  for(var i=0;i<count;i++){
    for(key in data[i]){
      data[i][key] = data[i][key].toString();
      // console.log(data[i]);
      if(data[i][key].indexOf(searText)!=-1) {
         //console.log(data[i].name);
  //       nameArray.push(data[i].name);
  //       cityArray.push(data.city);
  //       areaArray.push(data.area);
  //       //extraImageArray.push(data.)
  //       openInfoArray.push(data.openInfo);
  //       ratingArray.push(data.rating);
  //       restaurantTypeArray.push(data.restaurantType);
  //       stagEntryArray.push(data.stagEntry);
  //       streetArray.push(data.street);
  //       //distanceArray.push()
  //       //costArray.push()
  //       //costArrayhigh.push()
  //       imageUrlArray.push(data[i].imageUri);
  //       mondayOpenArray.push(data.mondayOpen);
  //       tuesdayOpenArray.push(data.tuesdayOpen);
  //       wednesdayOpenArray.push(data.wednesdayOpen);
  //       thursdayOpenArray.push(data.thursdayOpen);
  //       fridayOpenArray.push(data.fridayOpen);
  //       saturdayOpenArray.push(data.saturdayOpen);
  //       sundayOpenArray.push(data.sundayOpen);
  //       mondayCloseArray.push(data.mondayClose);
  //       tuesdayCloseArray.push(data.tuesdayClose);
  //       wednesdayCloseArray.push(data.wednesdayClose);
  //       thursdayCloseArray.push(data.thursdayClose);
  //       fridayCloseArray.push(data.fridayClose);
  //       saturdayCloseArray.push(data.saturdayClose);
  //       sundayCloseArray.push(data.sundayClose);
  flag = 1;
    }
  } 
    if(stagEntry && (data[i].stagEntry != "yes" || data[i].stagEntry != "Yes"))
          flag = 0;
    if(openNow && data[i].openInfo != "open now" )
          flag = 0;
    if (flag == 1) {
      nameArray.push(data[i].name);
      imageUrlArray.push(data[i].imageUri);
    }
    flag = 0;
  }
//console.log(nameArray);
console.log(document.forms["searchRest"]["stagEntryBox"].checked);
  var bodyDiv = $('#restCards');
  if (nameArray.length!=0){
    for(var i=0;i<nameArray.length;i++){
      
      bodyDiv.append(`
      <div class="card">              
      <img class="card-img-top" src =`+imageUrlArray[i]+`alt="Card image cap" height="300" > 
      <div class="card-body">
        <h5 class="card-title">`+nameArray[i]+`</h5>
      </div>
      `);
      bodyDiv.append(`<br />`);
    }
  }
});


