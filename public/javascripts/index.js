document.addEventListener('DOMContentLoaded', function() {
    var map;
    var infoWindow;
    var geocoder;
    var searchBox;
    var location;
    if (top.location.pathname != '/search' && top.location.pathname != '/home/add'){
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
          showMap(pos);
        }    
  
        function showMap(pos){
          map = new google.maps.Map(document.getElementById('map'), {
            center: pos,
            zoom: 6
          });
          geocoder = new google.maps.Geocoder;
          infoWindow = new google.maps.InfoWindow;
          geocoder.geocode({'location': pos}, 
          function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                var marker = new google.maps.Marker({
                  position: pos,
                  map: map
                });
                //console.log(results);
                var card = document.getElementById('pac-card');
                location = document.getElementById("locationSet");
  
                window.localStorage.setItem("lat",pos.lat);
                window.localStorage.setItem("lng",pos.lng);
                //;
                //
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
                var autocomplete = new google.maps.places.Autocomplete(location);
                var infowindowContent = document.getElementById('infowindow-content');
                infoWindow.setContent(infowindowContent);
                //var marker = new google.maps.Marker({
                  //map:map,
                  //anchorPoint: new google.maps.Point(pos.lat,pos.lng)
                // });
                if (results[0].address_components) {
                  address = [
                    (results[0].address_components[0] && results[0].address_components[0].short_name || ''),
                    (results[0].address_components[1] && results[0].address_components[1].short_name || ''),
                    (results[0].address_components[2] && results[0].address_components[2].short_name || '')
                  ].join(' ');
                }
                infowindowContent.children['place-name'].textContent = results[0].name;
                infowindowContent.children['place-address'].textContent = address;
                infoWindow.open(map, marker);
                location.value=results[0].formatted_address;
  
                autocomplete.addListener('place_changed',function(){  
                 infoWindow.close();
                 marker.setVisible(false);
                 var place = autocomplete.getPlace();
                 if (!place.geometry) {
                  // User entered the name of a Place that was not suggested and
                  // pressed the Enter key, or the Place Details request failed.
                  window.alert("No details available for input: '" + place.name + "'");
                  return;
                 }     
                  map.setCenter(place.geometry.location);
                  map.setZoom(6);  // Why 17? Because it looks good.
                  marker.setPosition(place.geometry.location);
                  marker.setVisible(true);
                  var address = '';
                  if (place.address_components) {
                    address = [
                      (place.address_components[0] && place.address_components[0].short_name || ''),
                      (place.address_components[1] && place.address_components[1].short_name || ''),
                      (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                  }
                  infowindowContent.children['place-name'].textContent = place.name;
                  infowindowContent.children['place-address'].textContent = address;
                  infoWindow.open(map, marker);
                 window.localStorage.setItem("lat",place.geometry.location.lat());
                 window.localStorage.setItem("lng",place.geometry.location.lng());
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
    //$("#locationSet").change(function(){
  
      
      //console.log("Yo");
      //Ext.Ajax.cors = true;
      
      // var options = {
      //   types:['cities'],
      //   componentRestriction:{country:'in'}
      // };
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(location);
      // var autocomplete = new google.maps.places.Autocomplete(location,options);
    //});
    //searchBox =  new google.maps.places.SearchBox(location);
                //console.log(searchBox);
                // var options = {
                //   types:['cities'],
                //   componentRestriction:{country:'in'}
                // };
                //map.controls[google.maps.ControlPosition.TOP_LEFT].push(location);
                //;geocoder.geocode({'address':location.value},function(results,status){
  
    // $.ajax({
    //   url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location},types=(cities),key=AIzaSyBRIt05f_gxZGvC0HTPpjxGh0hsglgl2I4`,
    //   method: 'GET',
    //   //crossDomain: true,
    //   contentType:'text/plain',
    //   header: {},
    //   success:function(response){
    //     console.log(response);
    //   }
    // });
                
    $("#locSearch").click(function(){
      setLocation();
    });    
  } 
  });

  function setLocation() {
    var LatLngArray = [];
    var cities = [];
    var pos3 = {
      lat:window.localStorage.getItem("lat"),
      lng:window.localStorage.getItem("lng")
    };
    // var Ahmedabad = new google.maps.LatLng(23.033863,72.585022);
    // var Bangalore = new google.maps.LatLng(12.972442,77.580643);
    // var Chennai = new google.maps.LatLng(13.067439,80.237617);
    // var Faridabad = new google.maps.LatLng(28.341639,77.325348);
    // var Ghaziabad = new google.maps.LatLng(28.667856,77.449791);
    // var Gurgaon = new google.maps.LatLng(28.457523,77.026344);
    // var Howrah = new google.maps.LatLng(22.595770,88.263641);
    // var Hyderabad= new google.maps.LatLng(17.387140,78.491684);
    // var Kolkata = new google.maps.LatLng(22.572645,88.363892);
    // var Mumbai = new google.maps.LatLng(19.07283,72.88261);
    // var Navi_Mumbai = new google.maps.LatLng(19.077065,72.998993);
    // var New_Delhi= new google.maps.LatLng(28.644800,77.216721);
    // var Noida = new google.maps.LatLng(28.535517,77.391029);
    // var Pune = new google.maps.LatLng(18.516726,73.856255);
    // var Secunderabad = new google.maps.LatLng(17.439930,78.498276);
    // var Thane = new google.maps.LatLng(19.218330,72.978088);
    var cityRef = firebase.database().ref().child('cities')
    cityRef.orderByValue().once('value',function(snapshot){
    snapshot.forEach(function(data){
      LatLngArray.push(data.val());
      cities.push(data.key);
    });
      //console.log(cities);
      calcDistance(LatLngArray,cities,pos3);
    }); 
    //var service = new google.maps.DistanceMatrixService();
    
    //var city = new google.maps.LatLng(pos3.lat,pos3.lng);
      // service.getDistanceMatrix(
      //   {
      //     origins: [city],
      //     destinations: [Ahmedabad,Bangalore,Chennai,Faridabad,Ghaziabad,Gurgaon,Howrah,Hyderabad,Kolkata,Mumbai,Navi_Mumbai,New_Delhi,Noida,Pune,Secunderabad,Thane],
      //     travelMode: 'DRIVING',
      //   },calcDistance);      
    }
    function calcDistance(LatLngArray,cities,pos3){ 
      //console.log("Yes");
      var count = Object.keys(LatLngArray).length;
      //var service = new google.maps.DistanceMatrixService();
      var destination = null;
      //window.count = count;
      var min_dist = 0
      var min_city = "";
      //console.log(LatLngArray);
      for(var i=0;i<count;i++){
        //window.localStorage.setItem("item",i);
        
        destination = {
          lat:LatLngArray[i].latitude,
          lng:LatLngArray[i].longitude
        };
        //console.log(destination);
        //calcDistTime(origin,destination);
        var theta = pos3.lng - destination.lng;
        var dist = Math.sin(deg2rad(pos3.lat))*Math.sin(deg2rad(destination.lat))+Math.cos(deg2rad(pos3.lat))*Math.cos(deg2rad(destination.lat))*Math.cos(deg2rad(theta));
        dist = Math.acos(dist);
        dist = rad2deg(dist);
        dist = dist*60*1.515;
        dist = (Math.round(dist*100)/100);
        //console.log(dist);
        if(i==0){
          min_dist = dist;
          min_city = cities[0];
          //console.log(min_dist);
        }
        else if(i!=0 && dist < min_dist){
        min_dist = dist;
        min_city = cities[i];
        //console.log(min_dist);
        //console.log(min_city)
        }
        // if(j==(results.length-1)){
        //  
        // }
        destination = null;
      }
      window.localStorage.setItem("minDist",min_dist);
        window.localStorage.setItem("minCity",min_city);
        window.location.origin = window.location.protocol + "//" 
      + window.location.hostname 
      + (window.location.port ? ':' + window.location.port : '');
      window.location = window.location.origin+'/search';
      // window.localStorage.setItem("distance",JSON.stringify(distArray));
      // window.localStorage.setItem("duration",JSON.stringify(durArray));
    }
    
    function deg2rad(deg) {
      return (deg * Math.PI / 100.0);
    }
    
    function rad2deg(rad) {
      return (rad * 180.0 / Math.PI);
    }
    
//   function calcDistance(response,status){
//     var cities = ["Ahmedabad","Bangalore","Chennai","Faridabad","Ghaziabad","Gurgaon","Howrah","Hyderabad","Kolkata","Mumbai","Navi Mumbai","New Delhi","Noida","Pune","Secunderabad","Thane"];
//     if (status == 'OK') {
//       var destinations = response.destinationAddresses;
//       //console.log(destination[0].indexOf("Thane"));
//       var origins = response.originAddresses;
//       //console.log(destinations);
//       //console.log(response);
//       var min_dist = 0
//       var min_city = "";
//       //for(var i=0;i < destinations.length;i++) {
//       var results = response.rows[0].elements;
//       //console.log(results);
//       for(var j=0;j < results.length;j++) {
//       var element = results[j];
//       var distance = element.distance.text;
//       //var dist = parseInt(distance.match(/\d+/)[0]);
//       var temp_dist = distance.split(" ");
//       temp_dist[0] = temp_dist[0].replace(",","");
//       var dist = parseFloat(temp_dist[0]);
//       if(j==0){
//         min_dist = dist;
//         min_city = cities[0];
//       }
//       else if(j!=0 && dist < min_dist){
//         min_dist = dist;
//         min_city = cities[j];
//         console.log(min_dist);
//         console.log(min_city)
//       }
//       if(j==(results.length-1)){
//         window.localStorage.setItem("minDist",min_dist);
//         window.localStorage.setItem("minCity",min_city);
//         window.location.origin = window.location.protocol + "//" 
//       + window.location.hostname 
//       + (window.location.port ? ':' + window.location.port : '');
//       window.location = window.location.origin+'/search';
//       } 
//     }
//   }
// }     
      //console.log(dist);
      //if(destination[0].indexOf("Ahmedabad")!=-1) {
      //}
      //var min_dist = window.localStorage.getItem("minDist");
      // console.log(min_dist);
      // if(dist < min_dist) {
      // for(var i=0;i<cities.length;i++){
      //   if(destination[0].indexOf(cities[i])!=-1) {
          // if(cities[i]=="Thane")
          //   getData();
    //       break;
    //     }      
    //   }
    // }
    // if(destination[0].indexOf("Thane")!=-1)
    //   //getData();
    //   {
    //     console.log("Yo");
        
    // }
     (function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 48)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 54
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

})(jQuery); // End of use strict
