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

function snackbar() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function getParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
document.addEventListener('DOMContentLoaded', function() {
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
var user = JSON.parse(window.sessionStorage.getItem("user"));
var userInfo = $("#userInfo"); 
if(user) {
console.log(user);
var username = null;
if(!user.username){
  username = "Muffito User"
} 
else {
  username = user.username;
}
userInfo.append(
  `
  <li class="main-nav dropdown ">
  <a href="#" class="dropdown-toggle" data-toggle="dropdown">
      <span class="glyphicon glyphicon-user"></span> 
      <strong>${username}</strong>
      <span class="glyphicon glyphicon-chevron-down"></span>
  </a>
  <ul class="main-nav dropdown-menu">
      <li>
          <div class="navbar-login">
              <div class="row">
                  <div class="col-lg-4">
                      <p class="text-center ">
                        <img src = '' class=" img-rounded img-responsive aria-hidden="true"" onerror="this.onerror=null;this.src='images/bar_substitute.jpg'; "> 

                      </p>
                  </div>
                  <div class="col-lg-8">
                      <p class="text-left userInfo"><strong>${user.firstName} ${user.lastName}</strong></p>
                      <p class="text-left small userInfo">Email: ${user.email}</p>
                      <p class="text-left small userInfo">Phone: ${user.phone}</p>
                      <p class="text-left small userInfo">Address: ${user.address.streetName} ${user.address.area} ${user.address.city}</p>
                      <p class="text-left small userInfo">Country : ${user.country}</p>
                      
                  </div>
              </div>
          </div>
          </li>
          <li class="divider"></li>
        <li>
            <div class="navbar-login navbar-login-session">
                <div class="row">
                    <div class="col-lg-12">
                    <p>	
        <button id="signout" class="btn btn-danger" onclick="signOut()">Sign Out</button>
                        </p>
                    </div>
                </div>
            </div>
        </li>
      </ul>
  </li>
  `
)
}
else{
userInfo.empty();
}
if(top.location.pathname == '/home/add'){
  var map, infoWindow,geocoder,location;
  window.onload = getMyLocation;
  function getMyLocation() {
    if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(displayLocation);
}
else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}    
}
function displayLocation(position) {
  var pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  showMap(pos,map);
}



function showMap(pos){
  map = new google.maps.Map(document.getElementById('map'), {
    center: pos,
    zoom: 14
  });
  geocoder = new google.maps.Geocoder;
  infoWindow = new google.maps.InfoWindow;
  geocoder.geocode({'location': pos}, 
  function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          draggable:true,
          title:'drag me'
        });
        //console.log(results);
        var card = document.getElementById('pac-card');
        location = document.getElementById("restCity");

        window.sessionStorage.setItem("restLat",pos.lat);
        window.sessionStorage.setItem("restLng",pos.lng);
        //;
        //
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
        var autocomplete = new google.maps.places.Autocomplete(location);
        //var marker = new google.maps.Marker({
          //map:map,
          //anchorPoint: new google.maps.Point(pos.lat,pos.lng)
        // });
        // var address = '';
          if (results[0].address_components) {
             address = [
               (results[0].address_components[0] && results[0].address_components[0].short_name || ''),
               (results[0].address_components[1] && results[0].address_components[1].short_name || ''),
               (results[0].address_components[2] && results[0].address_components[2].short_name || '')
             ].join(' ');
           }
        marker.setVisible(false);
        var locationSet = false;
        $("#curLoc").on('click',function(){
          //showMap(pos,map);
          marker.setVisible(true);
          infoWindow.setContent(address);
          infoWindow.open(map, marker);
          console.log(results[0].address_components);
          locationSet = true;
        });
        //location.value=results[0].formatted_address;

        autocomplete.addListener('place_changed',function(){
         var place = autocomplete.getPlace();
         if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
         }
         if(!locationSet){   
         infoWindow.close();
         marker.setVisible(false);
              
          map.setCenter(place.geometry.location);
          map.setZoom(14);  // Why 17? Because it looks good.
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
          // infowindowContent.children['place-name'].textContent = place.name;
          // infowindowContent.children['place-address'].textContent = address;
          infoWindow.setContent('Please drag the marker to your restaurant location');
          infoWindow.open(map, marker);
        }
         window.sessionStorage.setItem("cityLat",place.geometry.location.lat());
         window.sessionStorage.setItem("cityLng",place.geometry.location.lng());
      });
        google.maps.event.addListener(marker,'dragend',function(){
            if(!locationSet) {
            position = marker.getPosition();
            window.sessionStorage.setItem("restLat",position.lat());
            window.sessionStorage.setItem("restLng",position.lng());
            //console.log(position);
            }
        });
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }

  });
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
infoWindow.setPosition(pos);
infoWindow.setContent(browserHasGeolocation ?
                    'Error: The Geolocation service failed.' :
                    'Error: Your browser doesn\'t support geolocation.');
infoWindow.open(map);
}
  } 
});
$('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
})
  

function valInp(form,field) {
    //console.log("Yo");
    var formInp = document.forms[form][field].value;
    formInp = $.sanitize(formInp);
    document.forms[form][field].value = formInp;
    $(document.forms[form][field]).next('.error').remove();
    document.forms[form][field].style.borderColor = '#fff';
    //$(document.forms[form][field]).empty();
}

function val_phone() {  
    var phone_num = document.forms["register"]["phone"].value;
    //alert(phone);
    phone_num = $.sanitize(phone_num);
    document.forms["register"]["phone"].value = phone_num;
    $(document.forms["register"]["phone"]).next('.error').remove();
    document.forms["register"]["phone"].style.borderColor = '#fff';
    //document.forms[form][field].style.borderColor = 'black';
}

// Initialize Firebase
// TODO: Replace with your project's customized code snippet


// document.addEventListener('DOMContentLoaded', function() {
//     //console.log("Ready");
    
// });



function login(){
    var username = document.forms["login"]["username"];
    username = $.sanitize(username);
    document.forms["login"]["email"] = username;
    var password = document.forms["login"]["password"];
    password = $.sanitize(password);
    document.forms["login"]["password"] = password;
}

function pageChange(evt,page){
  var token = window.sessionStorage.getItem("token");
  if(page!='search'){
  $.ajax({
    url:'/home',
    method:'GET',
    headers: {
      'x-access-token':token
    },
    success:function(response){
      if(response=="Success"){
        //var uid = xhr.getResponseHeader('x-access-uid');
        //window.sessionStorage.setItem("uid",uid);
        window.location.origin = window.location.protocol + "//" 
        + window.location.hostname 
        + (window.location.port ? ':' + window.location.port : '');
        window.location = window.location.origin+'/home/'+page;
      }
    }
  });
  }
  else {
    window.location.origin = window.location.protocol + "//" 
        + window.location.hostname 
        + (window.location.port ? ':' + window.location.port : '');
        window.location = window.location.origin+'/search';
  }
}

function signOut(){
  //var token = window.sessionStorage.getItem("token");
  firebase.auth().signOut()
    .then(function() {
      $.ajax({
        url:'/home/signout',
        method:'GET',
        success:function(response){
          if(response=='Success'){
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("user");
            window.sessionStorage.removeItem('uid');
            window.location.origin = window.location.protocol + "//" 
            + window.location.hostname 
            + (window.location.port ? ':' + window.location.port : '');
            window.location = window.location.origin+'/search';
          }
        }
      })  
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
}





