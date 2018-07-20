document.addEventListener("DOMContentLoaded",function() {
  var count = 1;
  var token = window.sessionStorage.getItem('token');
  $('#searchTabs li').hide();
  $("#searchTabs li").each(function(n) {
    $(this).attr('id',"tab"+n);
  //console.log($(this));
  });
  if(token) {
   $("#tab0").show();
   $("#tab1").show();
   $("#tab2").hide();
   $("#tab3").show();
   $("#tab4").show();
   $("#tab5").hide();
   $("#tab6").hide();
  }
  else {
   $("#tab0").hide();
   $("#tab1").hide();
   $("#tab2").show();
   $("#tab3").hide();
   $("#tab4").hide();
   $("#tab5").show();
   $("#tab6").show();
   $('[data-toggle="tooltip"]').tooltip(); 
  }
  //count=count+1;

});
function calcDistTime(dataArray){ 
  //console.log("Yes");
  var distArray = [];
  var durArray = [];
  var origin = {
  lat:window.localStorage.getItem("lat"),
  lng:window.localStorage.getItem("lng")
  }
  var count = Object.keys(dataArray).length;
  //var service = new google.maps.DistanceMatrixService();
  var destination = null;
  //window.count = count;
  const speed = 350;
  for(var i=0;i<count;i++){
    //window.localStorage.setItem("item",i);
    destination = {
      lat:dataArray[i].latitude,
      lng:dataArray[i].longitude
    };
    //calcDistTime(origin,destination);
    var theta = origin.lng - destination.lng;
    var dist = Math.sin(deg2rad(origin.lat))*Math.sin(deg2rad(destination.lat))+Math.cos(deg2rad(origin.lat))*Math.cos(deg2rad(destination.lat))*Math.cos(deg2rad(theta));
    dist = Math.acos(dist);
    dist = rad2deg(dist);
    dist = dist*60*1.515;
    distArray.push((Math.round(dist*100)/100));
    var time = (dist*1000/speed);
    var strTime = parseInt((time/60)) + " hours " + parseInt((time%60)) + " min ";
    durArray.push(strTime);
    destination = null;
  }
  window.localStorage.setItem("distance",JSON.stringify(distArray));
  window.localStorage.setItem("duration",JSON.stringify(durArray));
}

function distToNum(distance) {
  var temp_dist = distance.split(" ");
  temp_dist[0] = temp_dist[0].replace(",","");
  var dist = parseFloat(temp_dist[0]);   
  return dist;
}

function deg2rad(deg) {
  return (deg * Math.PI / 100.0);
}

function rad2deg(rad) {
  return (rad * 180.0 / Math.PI);
}

function Data(data) {
  //console.log("Yes");
  //durationArray.push(duration);
  //console.log(data);
  var bodyDiv = $('#restCards');
  $('#restCards').empty();
  var distArray = JSON.parse(window.localStorage.getItem('distance'));
  var durArray = JSON.parse(window.localStorage.getItem("duration"));
  //var data = JSON.parse(window.localStorage.getItem("snapshot"));
  //var itm = window.localStorage.getItem("item");
  if(data.length!=0) {
  for(var i=0;i<data.length;i++){
  if(distArray[i]<10.0 && data[i].name){  
  bodyDiv.append(`
      <div class="thumbnail sized">              
      <img src = '${data[i].imageUri}' onerror="this.onerror=null;this.src='images/bar_substitute.jpg';"> 
      <div class="caption">
        <h3 >${data[i].name}</h3>
        <div class="row">
        <div class="col-md-6 mr-auto"><h6>Rating  : </h6><p>${data[i].ratting}</p></div>
        <div class="col-md-6 ml-auto"><h6>Category  : </h6><p>${data[i]["restaurant type"]}</p></div>
        </div>
        <br />
        <div class="row">
        <div class="col-md-6 mr-auto"><h6>Distance  : </h6><p>${distArray[i]} km</p></div>
        <div class="col-md-6 ml-auto"><h6>ETA  : </h6><p>${durArray[i]}</p></div>
        </div>
        <br />
        <h6>Address  : </h6><p>${data[i].street},${data[i].area}</p>
        <p>${data[i].city}</p>
        <br />
      <button type="button" onclick = "knowMore(event,'${i}')" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
      Know More
      </button>
      </div>
      `);
      bodyDiv.append(`<br />`);
      //if(i == count)
      // /  document.getElementById("searchText").disabled = false;
      //console.log(i);
  }
}
}
else {
bodyDiv.append(`<img src="./images/no_restaurant2.jpg" alt="No Results Found! Please Try Again!">`);
}
}

function getData(){
  var dataArray = [];
  var restKeys = [];
  //window.localStorage.removeItem('snapshot');
  var city = window.localStorage.getItem("minCity");
  var dist = window.localStorage.getItem("minDist")
  //var latArray = [];
  //var lngArray = [];
  console.log(city);
  if(dist < 100){
  var restRef = firebase.database().ref().child('restaurants').child(city)
  restRef.orderByValue().once('value',function(snapshot){
    //console.log(snapshot.val());
    snapshot.forEach(function(data){
        //console.log(data.key);
        dataArray.push(data.val());
        restKeys.push(data.key);
  }); 
    //console.log(dataArray);
    calcDistTime(dataArray);
    Data(dataArray);
    window.localStorage.setItem("snapshot",JSON.stringify(dataArray));
    window.localStorage.setItem("restKeys",JSON.stringify(restKeys));
  });
}
else {
  var bodyDiv = $('#restCards');
  $('#restCards').empty();
  bodyDiv.append(`<img src="./images/no_restaurant2.jpg" alt="No Results Found! Please Try Again!">`);
}
}

// $("#searchRest").on('change',function(){
//   restSearch();
// });

// $("#searchText").on('input',function(){
//   restSearch();
// });

function restSearch() {
  var data = JSON.parse(window.localStorage.getItem("snapshot"));
  //console.log(imageUrlArray);
  nameArray = [];
  cityArray = [];
  areaArray = [];
  imageUriArray = [];
  openInfoArray = [];
  ratingArray = [];
  streetArray = [];
  distanceArray = [];
  duration = [];
  costArray = [];
  costArrayhigh = [];
  restaurantTypeArray = [];
  restId = [];
  distTextArray = JSON.parse(window.localStorage.getItem("distance"));//distTextArray;
  durationArray = JSON.parse(window.localStorage.getItem("duration"));

  $('#restCards').empty();
  var ck_misctext = /^[A-Za-z0-9 ]+$/;
  var error = false;
  var searText = document.forms["searchRest"]["searchText"].value; 
  var stagEntry = document.forms["searchRest"]["stagEntryBox"].checked;
  var openNow = document.forms["searchRest"]["openNowBox"].checked;
  var sort = document.getElementById("sort");
  var sortBy =  sort.options[sort.selectedIndex].innerHTML;
  var filter = document.getElementById("filter");
  var filterBy = filter.options[filter.selectedIndex].innerHTML;
  //console.log(sortBy);
  if(!ck_misctext.test(searText) && searText != ""){
          document.forms["searchRest"]["searchText"].style.borderColor = 'red';
          $("<span>Invalid Search Text</span>").addClass('error').insertAfter("#searchText");
          error = true;
  }
  if (error) {
    return false
  }
  if(data)
    var count = Object.keys(data).length;
  //console.log(count);
  var flag = 0;
  var filterVal = 0;
  //console.log(data[0])
  switch(filterBy){
    case "Within 10 km":
    {
      filterVal = 10;
      break;
    }
    case "Within 15 km":
    {
      filterVal = 15;
      break;
    }
    case "Within 25 km":
    {   
      filterVal = 25;
      break;
    }
    default:
      filterVal = 10;
  }
  for(var i=0;i<count;i++){
    if(distTextArray[i]<filterVal && data[i].name){
    for(key in data[i]){
      data[i][key] = data[i][key].toString();
      if((data[i][key].toLowerCase()).indexOf(searText.toLowerCase())!=-1) {
        flag = 1;
      }
      //console.log(data[i].stagEntry=="yes");
      if(stagEntry){
      if(data[i].stagEntry == "yes")
        flag = 1;
      else 
        flag = 0;
      }
      if(openNow){
      if(data[i].openInfo == "open now" )
        flag = 1;
      else  
        flag = 0;
      }
    } 
    // if(stagEntry && (data[i].stagEntry != "yes" || data[i].stagEntry != "Yes"))
    //       flag = 0;
    // if(openNow && data[i].openInfo != "open now" )
    //       flag = 0;
    if (flag == 1) {
      nameArray.push(data[i].name);
      imageUriArray.push(data[i].imageUri);
      ratingArray.push(data[i].ratting);
      restaurantTypeArray.push(data[i]["restaurant type"]);
      cityArray.push(data[i].city);
      areaArray.push(data[i].area);
      streetArray.push(data[i].street);
      distanceArray.push(distTextArray[i]);
      duration.push(durationArray[i]);
      restId.push(i);
      //console.log(data[i]);
    }
    flag = 0;
  }
  }
  //console.log(extraImageArray);
  switch(sortBy) {
    
    case "Rating":
    {   
        var temp = null;
        console.log("R");
        for(var i=0;i<ratingArray.length;i++){
          for(var j=0;j<ratingArray.length-i-1;j++){
              if(ratingArray[j] < ratingArray[j+1]){
                temp = nameArray[j];
                nameArray[j] = nameArray[j+1];
                nameArray[j+1] = temp;
                temp = imageUriArray[j];
                imageUriArray[j] = imageUriArray[j+1];
                imageUriArray[j+1] = temp;
                temp = ratingArray[j];
                ratingArray[j] = ratingArray[j+1];
                ratingArray[j+1] = temp;
                temp = restaurantTypeArray[j];
                restaurantTypeArray[j] = restaurantTypeArray[j+1];
                restaurantTypeArray[j+1] = temp;
                temp = cityArray[j];
                cityArray[j] = cityArray[j+1];
                cityArray[j+1] = temp;
                temp = areaArray[j];
                areaArray[j] = areaArray[j+1];
                areaArray[j+1] = temp;
                temp = streetArray[j];
                streetArray[j] = streetArray[j+1];
                streetArray[j+1] = temp;
                temp = duration[j];
                duration[j] = duration[j+1];
                duration[j+1] = temp;
                temp = distanceArray[j];
                distanceArray[j] = distanceArray[j+1];
                distanceArray[j+1] = temp;
              }
          }
        }
        break;
    }
    case "Cost-High to Low":
    { 
      var temp = null;
      console.log("CHL");
      for(var i=0;i<restaurantTypeArray.length;i++){
        if(restaurantTypeArray[i]=="cheap")
        costArrayhigh.push(0);
        if(restaurantTypeArray[i]=="moderate")
        costArrayhigh.push(1);
        if(restaurantTypeArray[i]=="costly")
        costArrayhigh.push(2);
      }
      //console.log(costArrayhigh.length);
      for(var i=0;i<costArrayhigh.length;i++){
        for(var j=0;j<costArrayhigh.length-i-1;j++){
            if(costArrayhigh[j] < costArrayhigh[j+1]){
              temp = nameArray[j];
              nameArray[j] = nameArray[j+1];
              nameArray[j+1] = temp;
              temp = imageUriArray[j];
              imageUriArray[j] = imageUriArray[j+1];
              imageUriArray[j+1] = temp;
              temp = ratingArray[j];
              ratingArray[j] = ratingArray[j+1];
              ratingArray[j+1] = temp;
              temp = restaurantTypeArray[j];
              restaurantTypeArray[j] = restaurantTypeArray[j+1];
              restaurantTypeArray[j+1] = temp;
              temp = costArrayhigh[j];
              costArrayhigh[j] = costArrayhigh[j+1];
              costArrayhigh[j+1] = temp;
              temp = cityArray[j];
              cityArray[j] = cityArray[j+1];
              cityArray[j+1] = temp;
              temp = areaArray[j];
              areaArray[j] = areaArray[j+1];
              areaArray[j+1] = temp;
              temp = streetArray[j];
              streetArray[j] = streetArray[j+1];
              streetArray[j+1] = temp;
              temp = duration[j];
              duration[j] = duration[j+1];
              duration[j+1] = temp;
              temp = distanceArray[j];
              distanceArray[j] = distanceArray[j+1];
              distanceArray[j+1] = temp;
            }
        }
      }
      break;
    }
    case "Cost-Low to High":
    {
      var temp = null;
      console.log("CLH");
      for(var i=0;i<restaurantTypeArray.length;i++){
        if(restaurantTypeArray[i]=="cheap")
        costArray.push(0);
        if(restaurantTypeArray[i]=="moderate")
        costArray.push(1);
        if(restaurantTypeArray[i]=="costly")
        costArray.push(2);
      }
      //console.log(costArray);
      for(var i=0;i<costArray.length;i++){
        for(var j=0;j<costArray.length-i-1;j++){
            if(costArray[j] > costArray[j+1]){  
              temp = nameArray[j];
              nameArray[j] = nameArray[j+1];
              nameArray[j+1] = temp;
              temp = imageUriArray[j];
              imageUriArray[j] = imageUriArray[j+1];
              imageUriArray[j+1] = temp;
              temp = ratingArray[j];
              ratingArray[j] = ratingArray[j+1];
              ratingArray[j+1] = temp;
              temp = restaurantTypeArray[j];
              restaurantTypeArray[j] = restaurantTypeArray[j+1];
              restaurantTypeArray[j+1] = temp;
              temp = costArray[j];
              costArray[j] = costArray[j+1];
              costArray[j+1] = temp;
              temp = cityArray[j];
              cityArray[j] = cityArray[j+1];
              cityArray[j+1] = temp;
              temp = areaArray[j];
              areaArray[j] = areaArray[j+1];
              areaArray[j+1] = temp;
              temp = streetArray[j];
              streetArray[j] = streetArray[j+1];
              streetArray[j+1] = temp;
              temp = duration[j];
              duration[j] = duration[j+1];
              duration[j+1] = temp;
              temp = distanceArray[j];
              distanceArray[j] = distanceArray[j+1];
              distanceArray[j+1] = temp;
            }
        }
      }
      break;
    }
    case "Distance":
    {
      for(var i=0;i<distanceArray.length;i++){
        for(var j=0;j<distanceArray.length-i-1;j++){
            if(distanceArray[j] > distanceArray[j+1]){  
              temp = nameArray[j];
              nameArray[j] = nameArray[j+1];
              nameArray[j+1] = temp;
              temp = imageUriArray[j];
              imageUriArray[j] = imageUriArray[j+1];
              imageUriArray[j+1] = temp;
              temp = ratingArray[j];
              ratingArray[j] = ratingArray[j+1];
              ratingArray[j+1] = temp;
              temp = restaurantTypeArray[j];
              restaurantTypeArray[j] = restaurantTypeArray[j+1];
              restaurantTypeArray[j+1] = temp;
              temp = costArray[j];
              costArray[j] = costArray[j+1];
              costArray[j+1] = temp;
              temp = cityArray[j];
              cityArray[j] = cityArray[j+1];
              cityArray[j+1] = temp;
              temp = areaArray[j];
              areaArray[j] = areaArray[j+1];
              areaArray[j+1] = temp;
              temp = streetArray[j];
              streetArray[j] = streetArray[j+1];
              streetArray[j+1] = temp;
              temp = duration[j];
              duration[j] = duration[j+1];
              duration[j+1] = temp;
              temp = distanceArray[j];
              distanceArray[j] = distanceArray[j+1];
              distanceArray[j+1] = temp;
            }
        }
      }
      break;
    }
    default:
  }
//console.log(nameArray);
//console.log(document.forms["searchRest"]["stagEntryBox"].checked);

  var bodyDiv = $('#restCards');
  if (nameArray.length!=0){
    for(var i=0;i<nameArray.length;i++){
      
      bodyDiv.append(`
      <div class="thumbnail sized">              
      <img src = '${imageUriArray[i]}' onerror="this.onerror=null;this.src='images/bar_substitute.jpg';"> 
      <div class="caption">
        <h3>${nameArray[i]}</h5>
        <div class="row">
        <div class="col-md-6 mr-auto"><p >${ratingArray[i]}</p></div>
        <div class="col-md-6 ml-auto"><p >${restaurantTypeArray[i]}</p></div>
        </div>
        <br />
        <div class="row">
        <div class="col-md-6 mr-auto"><p >${distanceArray[i]} km</p></div>
        <div class="col-md-6 ml-auto"><p >${duration[i]}</p></div>
        </div>
        <br />
        <p >${streetArray[i]},${areaArray[i]}</p>
        <p >${cityArray[i]}</p>
        <br />
      <button type="button" onclick = "knowMore(event,'${restId[i]}')" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
      Know More
      </button>
      </div>
      `);
      bodyDiv.append(`<br />`);
    }
  }
  else {
    bodyDiv.append(`<img src="./images/no_restaurant2.jpg" alt="No Results Found! Please Try Again!">`);
  }
}

function knowMore(evt,id){
var data = JSON.parse(window.localStorage.getItem("snapshot"));
var restKeys = JSON.parse(window.localStorage.getItem('restKeys'));
var review = data[id].reviews;
var uid = window.sessionStorage.getItem('uid');
var user = window.sessionStorage.getItem('user');
var usernames = [];
var comment = "";
var rateKey = "";
var userRating = "";
console.log(review);
//console.log(name);
var count = Object.keys(data).length;
// var city;
// areaArray;
// extraImageArray;
// openInfoArray;
// rattingArray;
// restaurantTypeArray;
// stagEntryArray;
// streetArray;
// distanceArray;
// costArray;
// costArrayhigh;
// imageUrlArray;
// mondayOpenArray;
// tuesdayOpenArray;
// wednesdayOpenArray;
// thursdayOpenArray;
// fridayOpenArray;
// saturdayOpenArray;
// sundayOpenArray;
// mondayCloseArray;
// tuesdayCloseArray;
// wednesdayCloseArray;
// thursdayCloseArray;
// fridayCloseArray;
// saturdayCloseArray;
// sundayCloseArray;
var username = null;
if(!user.username){
  username = "Muffito User"
} 
else {
  username = user.username;
}
var distArray = JSON.parse(window.localStorage.getItem("distance"));
var durArray = JSON.parse(window.localStorage.getItem("duration"));
    for(key in review){
      if(review[key].uid==uid){
        comment = review[key].comments;
        //userRating = parseInt(review[key].ratings);
        rateKey = key;
        usernames.push(username)
      }
      else{
        firebase.database().ref('users/'+review[key].uid).once('value')
        .then(function(snapshot){
            var users = snapshot.val();
            usernames.push(user.username);
        });
      }
    }
    console.log(usernames);
//for(var i=0;i<count;i++){
    //if(data[i]["imageUri"].indexOf(imageURL)!=-1) {
      name = data[id].name
      city = data[id].city;
      area = data[id].area;
      openInfo = data[id].openInfo;
      rating = data[id].ratting;
      restaurantType = data[id].restaurantType;
      stagEntry = data[id].stagEntry;
      street = data[id].street;
      mondayOpen = data[id].mondayOpen;
      tuesdayOpen = data[id].tuesdayOpen;
      wednesdayOpen = data[id].wednesdayOpen;
      thursdayOpen = data[id].thursdayOpen;
      fridayOpen = data[id].fridayOpen;
      saturdayOpen = data[id].saturdayOpen;
      sundayOpen = data[id].sundayOpen;
      mondayClose = data[id].mondayClose;
      tuesdayClose = data[id].tuesdayClose;
      wednesdayClose = data[id].wednesdayClose;
      thursdayClose = data[id].thursdayClose;
      fridayClose = data[id].fridayClose;
      saturdayClose = data[id].saturdayClose;
      sundayClose = data[id].sundayClose;
      extraImage = data[id].extraImage;
      distance = distArray[id];
      duration = durArray[id];
      imageURL = data[id].imageUri;
    //}
  //}
var modal = $('#myModal');
modal.append(`
<div  class="modal-dialog modal-lg" >
<div class="modal-content">
<div class="modal-header">
    <h4 class="modal-title">${name}</h4>
</div>
<div class="modal-body">
<div id="model" class="carousel slide" data-ride="carousel">
<ul class="carousel-indicators">
<li data-target="#model" data-slide-to="0" class="active"></li>
</ul>
<div class="carousel-inner">
<div class="item active">
<img class="d-block w-100"  src="${imageURL}" onerror="this.onerror=null;this.src='images/bar_substitute.jpg';"">
</div>
 </div>
    <a class="carousel-control left" href="#model" data-slide="prev">
      <span class="glyphicon glyphicon-chevron-left"></span>
    </a>
     <a class="carousel-control right" href="#model" data-slide="next">
        <span class="glyphicon glyphicon-chevron-right"></span>
    </a>
</div>
<div class="container-fluid">
  <div>
    <h5 class="modal-title">${name}</h5>
  </div><br>
  <div  class= "col-md-6 mr-auto row">   <h6>Rating  : </h6>
      <span class="fa fa-star checked" style="color: orange;"></span>
      <span class="fa fa-star checked"  style="color: orange;"></span>
      <span class="fa fa-star checked"style="color: orange;"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
  </div><br>
  <div>
      <h6>Address Of the restraunts: ${street},${area},${city}</h6>
  </div><br>
  <br>
<div class="row">
    <div class="col-md-6 mr-auto"><h6>Open Info : ${openInfo} </h6></div>
    <div class="col-md-6 ml-auto"><h6>Stag Entry : ${stagEntry} </h6></div>
</div><br>
<div class="row">
<div class="col-md-6 mr-auto"><h6>Distance : ${distance} km </h6></div>
<div class="col-md-6 ml-auto"><h6>ETA : ${duration} </h6></div>
</div><br>
<div >
      <h6><strong>Timings</strong></h6>  
  </div>
  <div class="row">
          <div class="col-md-6 mr-auto"><h6>Monday : ${mondayOpen}-${mondayClose}</h6></div>
          <div class="col-md-6 ml-auto"><h6>Tusday : ${tuesdayOpen}-${tuesdayClose} </h6></div>
      </div>
      <div class="row">
          <div class="col-md-6 mr-auto"><h6>Wednesday : ${wednesdayOpen}-${wednesdayClose} </h6></div>
          <div class="col-md-6 ml-auto"><h6>Thursday : ${thursdayOpen}-${thursdayClose} </h6></div>
      </div>
      <div class="row">
          <div class="col-md-6 mr-auto"><h6>Friday : ${fridayOpen}-${fridayClose} </h6></div>
          <div class="col-md-6 ml-auto"><h6>Saturday : ${saturdayOpen}-${saturdayClose} </h6></div>
      </div>
</div>
<br />
<div id="reviewRest">
<li class="divider"></li>
<div id='userReview'></div>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-danger" id="myModalClose">Close</button>
  </div>
</div>
</div>  
</div>
</div>
`);
$("#myModalClose").on('click',function(){
    console.log('Modal code');
    $("#myModal").modal('hide')
});
var review = $("#reviewRest");
if(user){
  review.prepend(`
  <button class="btn btn-danger btn-block" id="reviewBut" data-toggle="modal" data-target="#modalRev">REVIEW RESTAURANT</button>
  `);
}
else {
  review.prepend(`
  <button class="btn btn-danger btn-block" data-toggle="tooltip" id="revTemp" title="Please Login to Review" data-placement="bottom">REVIEW RESTAURANT</button>
  `)
  $('#revTemp').tooltip();
}

var revModal = $("#modalRev");
revModal.append(`
<div  class="modal-dialog" >
<div class="modal-content">
<div class="modal-header">
    <h4 class="modal-title">${username}</h4>
</div>
<div class="modal-body">
<div class='row'>
<div class="col-md-6 mr-auto"><h3>Review</h3></div>
<div class="col-md-6 ml-auto"><select id="restRate" name="restRate">
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
</select>
</div>
</div>
<div class="form-group">
<label for="message">Review</label>
<textarea class="form-control" id="review" name="review" rows="3">${comment}</textarea>
</div>
<button type="button" class="btn btn-primary" id="submitRev">Submit</button>
<div class="modal-footer">
    <button type="button" class="btn btn-danger" id="modalRevClose">Close</button>
</div>
`)
$("#modalRevClose").on('click',function(){
  console.log('modal 2');
  $("#modalRev").modal('hide');
});
var indicator = $("ul.carousel-indicators");
var addImages = $("div.carousel-inner");
var count = 1;
for(key in extraImage){
  indicator.append(`
  <li data-target="#model" data-slide-to="${count}" class="active"></li>
  `);
  addImages.append(`
  <div class="item">
  <img class="d-block w-100" src="${extraImage[key]}" alt="Res 1" height="500">
  </div>
  `);
  count++;
}
$('#myModal').on('hidden.bs.modal', function () {
  $('#myModal').empty();
});
$('#modalRev').on('hidden.bs.modal', function () {
  $('#modalRev').empty();
});
$("#submitRev").on('click',function(){
  var key = restKeys[id];
  console.log(uid);
  var review = document.getElementById("review").value;
  var textMsg = $.sanitize(review);
  var city = window.localStorage.getItem("minCity");
  var restRate  = document.getElementById("restRate");
  var restRateBy = restRate.options[restRate.selectedIndex].innerHTML;
  //firebase.database().ref().child()
  if(rateKey){
    firebase.database().ref('restaurants/' + city).child(key).child('reviews').child(rateKey).set({
      uid:uid,
      ratings:restRateBy,
      comments:textMsg
    })
    .then(function(){
      $("#modalRev").modal('hide');
    });
}
else{
  firebase.database().ref('restaurants/' + city).child(key).child('reviews').push({
    uid:uid,
    ratings:restRateBy,
    comments:textMsg
  })
  .then(function(){
    $("#modalRev").modal('hide');
  });
}
});
//var carousel
}


//  <!-- Modal Header -->
//         

      

//         <!-- Modal body -->
//         <div class="modal-body">
// 		<div id="model" class="carousel slide" data-ride="carousel">

//   <!-- Indicators -->
//   <ul class="carousel-indicators">
//     <li data-target="#model" data-slide-to="0" class="active"></li>
//     <li data-target="#model" data-slide-to="1"></li>
//     <li data-target="#model" data-slide-to="2"></li>
//   </ul>

//   <!-- The slideshow -->
//   <div class="carousel-inner">
//     <div class="carousel-item active">
//       <img src="" alt="Res 1">
//     </div>
//     <div class="carousel-item">
//       <img src="" alt="Res 2">
//     </div>
//     <div class="carousel-item">
//       <img src="" alt="Res 3">
//     </div>
//   </div>

//   <!-- Left and right controls -->
//   <a class="carousel-control-prev" href="#model" data-slide="prev">
//     <span class="carousel-control-prev-icon"></span>
// 	</a>
// 	<a class="carousel-control-next" href="#model" data-slide="next">
// 		<span class="carousel-control-next-icon"></span>
// 	</a>

// 	</div>	
    
//         </div>
      
//         <!-- Modal footer -->
//         <div class="modal-footer">
//           <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
//         </div>