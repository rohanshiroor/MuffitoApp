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
          center: {lat: 20.5937, lng: 78.9629},
          zoom: 6
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
  

function valInp(form,field) {
    //console.log("Yo");
    var formInp = document.forms[form][field].value;
    formInp = $.sanitize(formInp);
    document.forms[form][field].value = formInp;
    //$(document.forms[form][field]).next().remove();
    document.forms[form][field].classList.remove('input-error');
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




