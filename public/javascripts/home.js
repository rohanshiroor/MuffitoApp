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
      headers: {
        'x-access-token':window.sessionStorage.getItem("token")
      },
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
    var loc = document.forms["restDet"]["restCity"].value;
    loc = loc.split(',');
    var restCity = loc[0]; 
    if(!ck_misctext.test(restCity)){
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
    var LatLngArray = [];
    var cities = [];
    var destination = null;
    var city;
    var min_dist = 0
    var min_city = "";
    var exists = null;
    pos = {
      lat: window.sessionStorage.getItem('cityLat'),
      lng: window.sessionStorage.getItem('cityLng')
    }
    var cityRef = firebase.database().ref().child('cities')
    cityRef.orderByValue().once('value',function(snapshot){
    snapshot.forEach(function(data){
      LatLngArray.push(data.val());
      cities.push(data.key);
    });
      var count = Object.keys(LatLngArray).length;
      for(var i=0;i<count;i++){
        
        destination = {
          lat:LatLngArray[i].latitude,
          lng:LatLngArray[i].longitude
        };
        var theta = pos.lng - destination.lng;
        var dist = Math.sin(deg2rad(pos.lat))*Math.sin(deg2rad(destination.lat))+Math.cos(deg2rad(pos.lat))*Math.cos(deg2rad(destination.lat))*Math.cos(deg2rad(theta));
        dist = Math.acos(dist);
        dist = rad2deg(dist);
        dist = dist*60*1.515;
        dist = (Math.round(dist*100)/100);
        if(i==0){
          min_dist = dist;
          min_city = cities[0];
        }
        else if(i!=0 && dist < min_dist){
        min_dist = dist;
        min_city = cities[i];
        console.log(min_dist);
        console.log(min_city)
        }
        destination = null;
      }
      if(min_dist < 30){
        city = min_city
        exists = true;
      }
      else {
        city = restCity;
        exists = false;
      }  
      //console.log(ImagesRef.fullPath);
      var token = window.sessionStorage.getItem("token")
      $.ajax({
        url: '/home/add',
        headers: {
          'x-access-token':token
        },
        method:'POST',
        contentType:'application/json',
        data: JSON.stringify({
          restName: name,
          restCity: restCity,
          restArea: area,
          restStreetName: streetName,
          rating: rating,
          city:city,
          exists: exists,
          restType: document.forms["restDet"]["restType"].value,
          stagEntry: document.forms["restDet"]["stagEntry"].value, 
          latitude: window.sessionStorage.getItem('restLat'),
          longitude: window.sessionStorage.getItem('restLng'),
          cityLat:window.sessionStorage.getItem('cityLat'),
          cityLng:window.sessionStorage.getItem('cityLng'),
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
          console.log(response);
          if(response!='Error'){ 
            var selectedFile = document.getElementById('restImage');
            if(selectedFile.files.length != 0){
            var storageRef = firebase.storage().ref();
            //console.log(selectedFile);
            var ImagesRef = storageRef.child('images/'+selectedFile.files[0].name);
            ImagesRef.put(selectedFile.files[0])
            .then(function(snapshot){
              snapshot.ref.getDownloadURL().then(function(downloadURL){
                firebase.database().ref('restaurants').child(city).child(response).child('restImage').set(downloadURL);
              });
              console.log('Uploaded File');
              var fileLength = selectedFile.files.length;
              for (var i=1; i < fileLength ; i++ ) {
                console.log(i);
              ImagesRef = storageRef.child('images/'+selectedFile.files[i].name);
              ImagesRef.put(selectedFile.files[i])
              .then(function(snapshot){
                snapshot.ref.getDownloadURL().then(function(downloadURL){
                  firebase.database().ref('restaurants').child(city).child(response).child('extraImage').push(downloadURL).then(function(){
                    if(i==fileLength){
                      $.ajax({
                        url:'/home',
                        method:'GET',
                        headers: ({
                          'x-access-token':token
                        }),
                        success:function(response){
                          if(response=="Success"){
                            window.location.origin = window.location.protocol + "//" 
                          + window.location.hostname 
                          + (window.location.port ? ':' + window.location.port : '');
                          window.location = window.location.origin+'/home/add';
                          }
                        }
                      });
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
          firebase.database().ref('restaurants').child(city).child(response).child('restImage').set("");
          firebase.database().ref('restaurants').child(city).child(response).child('extraImage').push("").then(function(){
          $.ajax({
            url:'/home',
            method:'GET',
            headers: ({
              'x-access-token':token
            }),
            success:function(response){
              if(response=="Success"){
                window.location.origin = window.location.protocol + "//" 
              + window.location.hostname 
              + (window.location.port ? ':' + window.location.port : '');
              window.location = window.location.origin+'/home/add';
              }
            }
          });
        });
        }
        }
        }
  });
  });
    }
  });
  // function setCity(city) {
    
  //     return city;
    
  // }

  function deg2rad(deg) {
    return (deg * Math.PI / 100.0);
  }
  
  function rad2deg(rad) {
    return (rad * 180.0 / Math.PI);
  }

  $(document).ready(function(){
    $('input.timepicker').timepicker({});
  });


document.addEventListener("DOMContentLoaded",function() {
    if (top.location.pathname === '/home/update'){
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        console.log(user);
        phone = user.phone.substring(3);
        document.forms["updateProf"]["firstname"].value = user.firstName; 
        document.forms["updateProf"]["lastname"].value = user.lastName;
        document.forms["updateProf"]["age"].value = user.age;
        document.forms["updateProf"]["dob"].value = user.dateOfBirth;
        document.forms["updateProf"]["flatno"].value = user.address.flatNo;
        document.forms["updateProf"]["streetName"].value = user.address.streetName;
        document.forms["updateProf"]["area"].value = user.address.area;
        document.forms["updateProf"]["city"].value = user.address.city; 
        document.forms["updateProf"]["pincode"].value = user.address.pinCode;
        document.forms["updateProf"]["state"].value = user.state;
        document.forms["updateProf"]["country"].value = user.country;
        document.forms["updateProf"]["email"].value = user.email;
        document.forms["updateProf"]["username"].value = user.userName;
        document.forms["updateProf"]["phone"].value = phone
        document.forms["updateProf"]["password"].value = user.password;
    }
  });

  $('#updateProf').on('submit',function(event){
    event.preventDefault();
    var ck_name = /^[A-Za-z]{2,20}$/;
    var ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var ck_username = /^[A-Za-z0-9_]{1,20}$/;
    var ck_password =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
    var numbers = /^\d+$/;
    var pin = /^[1-9][0-9]{5}$/;
    var ck_phone = /^[1-9][0-9]{9}$/;
    var ck_misctext = /^[A-Za-z0-9 ]+$/;
    var error = false;
    var fname = document.forms["updateProf"]["firstname"].value; 
    if(!ck_name.test(fname)){
            document.forms["updateProf"]["firstname"].style.borderColor = 'red';
            $("<span>Invalid First Name</span>").addClass('error').insertAfter("#firstname");
            error = true;
    }
    var lname = document.forms["updateProf"]["lastname"].value;
    if(!ck_name.test(lname)){
            document.forms["updateProf"]["lastname"].style.borderColor = 'red';
            $("<span>Invalid Last Name</span>").addClass('error').insertAfter("#lastname");
            error = true;
    }
    var age = document.forms["updateProf"]["age"].value;
    if(age!="" && !numbers.test(age)){
            document.forms["updateProf"]["age"].style.borderColor = 'red';
            $("<span>Invalid Age</span>").addClass('error').insertAfter("#age");
            error = true;
    }
    var flatno = document.forms["updateProf"]["flatno"].value;
    if(flatno!="" && !numbers.test(flatno)){
            document.forms["updateProf"]["flatno"].style.borderColor = 'red';
            $("<span>Invalid Flat no</span>").addClass('error').insertAfter("#flatno");
            error = true;
    }
    var streetName = document.forms["updateProf"]["streetName"].value;
    if(streetName!="" && !ck_misctext.test(streetName)){
            document.forms["updateProf"]["streetName"].style.borderColor = 'red';
            $("<span>Invalid Street Name</span>").addClass('error').insertAfter("#streetName");
            error = true;
    }
    var area = document.forms["updateProf"]["area"].value;
    if(area!="" && !ck_misctext.test(area)){
            document.forms["updateProf"]["area"].style.borderColor = 'red';
            $("<span>Invalid Area</span>").addClass('error').insertAfter("#area");
            error = true;
    }
    var city = document.forms["updateProf"]["city"].value; 
    if(city!="" && !ck_name.test(city)){
            document.forms["updateProf"]["city"].style.borderColor = 'red';
            $("<span>Invalid City</span>").addClass('error').insertAfter("#city");
            error = true;
    }
    var pincode = document.forms["updateProf"]["pincode"].value;
    if(pincode!="" && !pin.test(pincode)){
            document.forms["updateProf"]["pincode"].style.borderColor = 'red';
            $("<span>Invalid Pincode</span>").addClass('error').insertAfter("#pincode");
            error = true;
    }
    var dob = document.forms["updateProf"]["dob"].value;
    var state = document.forms["updateProf"]["state"].value;
    if(state!="" && !ck_name.test(state)){
            document.forms["updateProf"]["state"].style.borderColor = 'red';
            $("<span>Invalid State</span>").addClass('error').insertAfter("#state");
            error = true;
    }
    var country = document.forms["updateProf"]["country"].value;
    if(country!="" && !ck_name.test(country)){
            document.forms["updateProf"]["country"].style.borderColor = 'red';
            $("<span>Invalid Country</span>").addClass('error').insertAfter("#country");
            error = true;
    }
    var username = document.forms["updateProf"]["username"].value;
    if(!ck_username.test(username)){
            document.forms["updateProf"]["username"].style.borderColor = 'red';
            $("<span>Invalid Username</span>").addClass('error').insertAfter("#username");
            error = true;
    }
    var email = document.forms["updateProf"]["email"].value;
    var phone = document.forms["updateProf"]["phone"].value;
    var password = document.forms["updateProf"]["password"].value;
    if(email!='') {
    if(!ck_email.test(email)){
            document.forms["updateProf"]["email"].style.borderColor = 'red';
            $("<span>Invalid Email</span>").addClass('error').insertAfter("#email");
            error = true;
    }
  }
   if(phone!='' || password!=''){ 
    if(!ck_phone.test(phone)){
            document.forms["updateProf"]["phone"].style.borderColor = 'red';
            $("<span>Invalid Phone Number</span>").addClass('error').insertAfter("#phone");
            error = true;
    }
    
    if(!ck_password.test(password)){
            document.forms["updateProf"]["password"].style.borderColor = 'red';
            $("<span>Invalid Password</span>").addClass('error').insertAfter("#password");
            error = true;
    }
  }
    if (error){
      return false;
    }
    else { 
    var token = window.sessionStorage.getItem('token');
    $.ajax({
      url: '/home/update',
      method:'POST',
      contentType:'application/json',
      headers:{
        'x-access-token':token
      },
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
      success:function(response,textStatus,xhr){
        console.log(response);
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
            window.location = window.location.origin+'/home/update';
              });
            }
          }
        });
      }   
    });
  }
  });
  