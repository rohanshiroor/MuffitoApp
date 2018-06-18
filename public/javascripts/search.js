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
    var sort = document.getElementById("sort");
    var sortBy =  sort.options[sort.selectedIndex].innerHTML;
    console.log(sortBy);
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
    //       cityArray.push(data.city);
    //       areaArray.push(data.area);
    //       //extraImageArray.push(data.)
    //       openInfoArray.push(data.openInfo);
    //         
    //       
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
        ratingArray.push(data[i].ratting);
        restaurantTypeArray.push(data[i]["restaurant type"]);
        //console.log(data[i]["restaurant type"]);
      }
      flag = 0;
    }
    
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
                  temp = imageUrlArray[j];
                  imageUrlArray[j] = imageUrlArray[j+1];
                  imageUrlArray[j+1] = temp;
                  temp = ratingArray[j];
                  ratingArray[j] = ratingArray[j+1];
                  ratingArray[j+1] = temp;
                  temp = restaurantTypeArray[j];
                  restaurantTypeArray[j] = restaurantTypeArray[j+1];
                  restaurantTypeArray[j+1] = temp;
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
                temp = imageUrlArray[j];
                imageUrlArray[j] = imageUrlArray[j+1];
                imageUrlArray[j+1] = temp;
                temp = ratingArray[j];
                ratingArray[j] = ratingArray[j+1];
                ratingArray[j+1] = temp;
                temp = restaurantTypeArray[j];
                restaurantTypeArray[j] = restaurantTypeArray[j+1];
                restaurantTypeArray[j+1] = temp;
                temp = costArrayhigh[j];
                costArrayhigh[j] = costArrayhigh[j+1];
                costArrayhigh[j+1] = temp;
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
                temp = imageUrlArray[j];
                imageUrlArray[j] = imageUrlArray[j+1];
                imageUrlArray[j+1] = temp;
                temp = ratingArray[j];
                ratingArray[j] = ratingArray[j+1];
                ratingArray[j+1] = temp;
                temp = restaurantTypeArray[j];
                restaurantTypeArray[j] = restaurantTypeArray[j+1];
                restaurantTypeArray[j+1] = temp;
                temp = costArray[j];
                costArray[j] = costArray[j+1];
                costArray[j+1] = temp;
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
        <div class="card">              
        <img class="card-img-top" src =`+imageUrlArray[i]+`alt="Card image cap" height="300" > 
        <div class="card-body">
          <h5 class="card-title">`+nameArray[i]+`</h5>
          <p class="card-text">`+ratingArray[i]+`</p>
          <p class="card-text">`+restaurantTypeArray[i]+`</p>
        </div>
        `);
        bodyDiv.append(`<br />`);
      }
    }
  });