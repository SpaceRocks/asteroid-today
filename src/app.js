var UI = require('ui');
var ajax = require('ajax');
var asteroids = [];

function getMonthPlus(date) {
    var month = date.getMonth()+1;
    return month < 10 ? '0' + month : month; // ('' + month) for string result
}

function getDayPlus(date) {
    var day = date.getDate();
    return day < 10 ? '0' + day : day; // ('' + day) for string result
}  

var d = new Date();
var todayDate = d.getFullYear() + "-" + getMonthPlus(d) + "-" + getDayPlus(d);
var asteroid_list = new UI.Menu({
      sections: [{
        title: 'Asteroid Today',
        items: asteroids
       }]
     });

// var URL = 'https://raw.githubusercontent.com/AsteroidTracker/AsteroidTrackerService/master/v2/neo_recent/recent';
// var URL = 'https://raw.githubusercontent.com/AsteroidTracker/AsteroidTrackerService/master/v2/neo_upcoming/upcoming';
// http://mysterious-thicket-9681.herokuapp.com/rest/v1/feed?start_date=2015-04-27&end_date=2015-04-27
// var URL = "http://mysterious-thicket-9681.herokuapp.com/rest/v1/feed?start_date="+todayDate+"&end_date="+todayDate;
var URL = "http://www.neowsapp.com/rest/v1/feed?start_date="+todayDate+"&end_date="+todayDate;
     console.log(" URL !" + URL);
     ajax({
       url: URL,
       type: 'json'
     },
     function(data) {
     // Success!
     // console.log("Successfully fetched Asteroid data!" + data);
     var object = data;
     var nearEarthObjects = object.near_earth_objects ;
     for(var i = 0; i < nearEarthObjects[todayDate].length; i++) {
         var obj = nearEarthObjects[todayDate][i];
         var lunarDistance = obj.close_approach_data[0].miss_distance.lunar_distance;
         var relativeVelocity = obj.close_approach_data[0].relative_velocity.mph;
         asteroids.push( {
             title: obj.name,
             subtitle: "Lunar Distance " + lunarDistance,
             relvel: relativeVelocity,
             lunarDistance: lunarDistance
         });
     }

    asteroid_list.show();
  },
  function(error) {
    // Failure!
    console.log('Failed fetching Asteroid data: ' + URL +  error);
  }
);

asteroid_list.on('select', function(event) {

    var content = '\nVelocity: ' + asteroids[event.itemIndex].relvel + ' mph\nLunar Distance: ' +  asteroids[event.itemIndex].lunarDistance;
        
  // Show a card with clicked item details
  var detailCard = new UI.Card({
    title: asteroids[event.itemIndex].title,
    body: content
  });

  // Show the new Card
  detailCard.show();
});


