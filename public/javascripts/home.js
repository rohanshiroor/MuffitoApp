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
        'x-access-token':window.localStorage.getItem("token")
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
        headers: {
          'x-access-token':window.localStorage.getItem("token")
        },
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

document.addEventListener("DOMContentLoaded",function() {
    if (top.location.pathname === '/home/update'){
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        console.log(user);
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
        document.forms["updateProf"]["phone"].value = user.phone;
        document.forms["updateProf"]["password"].value = user.password;
    }
  });