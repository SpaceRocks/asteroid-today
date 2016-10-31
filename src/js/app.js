var UI = require('ui');
var ajax = require('ajax');
var asteroids = [];
var Platform = require('platform');
var Feature = module.exports;

function getMonthPlus(date) {
  var month = date.getMonth()+1;
  return month < 10 ? '0' + month : month; // ('' + month) for string result
}

function getDayPlus(date) {
  var day = date.getDate();
  return day < 10 ? '0' + day : day; // ('' + day) for string result
}  

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

var Vector2 = require('vector2');
var splashWindow = new UI.Window();
var logo = new UI.Image({
  position: new Vector2(0, 0),
  size: new Vector2(144, 144),
  backgroundColor: 'clear',
  image: 'images/androidlogo.png',
});

splashWindow.add(logo);
splashWindow.show();

var d = new Date();
var todayDate = d.getFullYear() + "-" + getMonthPlus(d) + "-" + getDayPlus(d);
var asteroid_list = new UI.Menu({
  sections: [{
    title: 'Asteroid Today',
    items: asteroids
  }]
});

var noAsteroidCard = new UI.Card({
  body: "0 Asteroids Today"
});

var URL = "http://www.neowsapp.com/rest/v1/feed/today";
// var URL = "http://www.neowsapp.com/rest/v1/feed?start_date="+todayDate+"&end_date="+todayDate;
console.log(" URL : " + URL);

ajax({
  url: URL,
  type: 'json',
  headers: { 'x-request-neows': 'neows_pebble' }
  },
     function(data) {
       // Success!
       // console.log("Successfully fetched Asteroid data!" + data);
       var object = data;
       var nearEarthObjects = object.near_earth_objects;
       if(nearEarthObjects.length==0) {
         // console.log(" neo is undefined ");
         noAsteroidCard.show();
       } else {
         try {
           for(var i = 0; i < nearEarthObjects[todayDate].length; i++) {
             var obj = nearEarthObjects[todayDate][i];
             var lunarDistance = obj.close_approach_data[0].miss_distance.lunar;
             var kilometers = obj.close_approach_data[0].miss_distance.kilometers;
             var relativeVelocity = obj.close_approach_data[0].relative_velocity.kilometers_per_hour;
             var absoluteMag = obj.absolute_magnitude_h;
             asteroids.push({
               title: obj.name,
               subtitle: "Lunar Distance " + lunarDistance,
               relvel: formatNumber(parseInt(relativeVelocity.replace(',', ''))),
               lunarDistance: lunarDistance,
               absoluteMag: absoluteMag,
               kilometers: formatNumber(parseInt(kilometers.replace(',', ''))),
             });
           }
           asteroid_list.section(0).title ='AsteroidToday - ' + nearEarthObjects[todayDate].length;
           asteroid_list.show();
         } catch(err) {
           console.log('Caught error' + err);
           splashWindow.hide();
         }
       }
       splashWindow.hide();
     },
     function(error) {
       console.log('Failed fetching Asteroid data: ' + URL +  error);
       splashWindow.hide();
     }
);

asteroid_list.on('select', function(event) {
    var content = ''+
        'Velocity: \n'+
        asteroids[event.itemIndex].relvel + ' kph\n'+
        'Distance:'+ '\n'+
        '-Lunar: '+asteroids[event.itemIndex].lunarDistance + '\n' +
        '-Kilometers: ' +asteroids[event.itemIndex].kilometers + '\n' +
        'Absolute mag\n' +asteroids[event.itemIndex].absoluteMag;
    
//    showCardUI(content, event);
    showDetailsUI(content, event);
});

function showCardUI(content, event) { 
    var detailCard = new UI.Card({
      title: asteroids[event.itemIndex].title,
      body: content,
      scrollable: true,
      style: 'mono'
     });
    detailCard.show();
}

function showDetailsUI(content, event) {
  if (Feature.round) {
     console.log(" neo is round ");    
  } else {
     console.log(" neo is not round ");
    
  }
  var detailsWindow = new UI.Window();
  var text = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    text:content,
    font:'GOTHIC_18_BOLD',
    color:'black',
    textOverflow:'wrap',
    textAlign:'center',
    backgroundColor:'white',
    scrollable: true
  });
    detailsWindow.add(text);
    detailsWindow.show();
}