document.addEventListener('DOMContentLoaded', function() 
{
$.backstretch("images/1.jpg");
$('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function() {
  $(this).removeClass('input-error');
});
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// Initialize the FirebaseUI Widget using Firebase.
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  var email = window.localStorage.getItem('emailForSignIn');
  firebase.auth().signInWithEmailLink(email, window.location.href)
  .then(function(result) {
    window.localStorage.removeItem('emailForSignIn');
  })
  .catch(function(error) {
    //console.log(error);
  });
}
var uiConfig = {
callbacks: {
  signInSuccess: function(currentUser,credential, redirectUrl) {
    // User successfully signed in.
    // Return type determines whether we continue the redirect automatically
    // or whether we leave that to developer to handle.
    var displayName = currentUser.displayName.split(" ");
    //console.log(currentUser.phoneNumber)
    username = currentUser.email.split('@');
      $.ajax({
        url: '/login/social',
        method:'POST',
        contentType:'application/json',
        data: JSON.stringify({
            uid:currentUser.uid,
            email: currentUser.email,
            phone:currentUser.phoneNumber,
            username:username[0],
            firstName: displayName[0],
            lastName: displayName[1],
        }),
        success:function(response,textStatus,xhr){
          //console.log(response);
          if (response=='Success'){
            var token = xhr.getResponseHeader('x-access-token');
            // console.log(token);
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
                  window.sessionStorage.setItem('uid',userId);
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
      });
      //var token = window.localStorage.getItem("token");
      //console.log(token);
      //if (token) {
    //}  
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
            //document.forms["login"]["emailOrPhone"].style.borderColor = 'red';
            $("#emailOrPhone").addClass('input-error');
            error = true;
      }
    }
    var password = document.forms["login"]["password"].value;
    if(!ck_password.test(password)){
            //document.forms["login"]["password"].style.borderColor = 'red';
            $("#password").addClass('input-error');
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
        success:function(response,textStatus,xhr){
          //console.log(response);
          if (response=='Success'){
            var token = xhr.getResponseHeader('x-access-token');
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
                  window.sessionStorage.setItem('uid',userId);
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
      });
    }
    //var token = window.localStorage.getItem("token");
    //if (token) {
    
  //}
    });