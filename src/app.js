var UI = require('ui');
var ajax = require('ajax');
var asteroids = [];

function getMonthPlus(date) {
    var month = date.getMonth()+1;
    return month < 10 ? '0' + month : month; // ('' + month) for string result
}  

var d = new Date();
var todayDate = d.getFullYear() + "-" + getMonthPlus(d) + "-" + d.getDate();

// var URL = 'https://raw.githubusercontent.com/AsteroidTracker/AsteroidTrackerService/master/v2/neo_recent/recent';
// var URL = 'https://raw.githubusercontent.com/AsteroidTracker/AsteroidTrackerService/master/v2/neo_upcoming/upcoming';
// http://mysterious-thicket-9681.herokuapp.com/rest/v1/feed?start_date=2015-04-27&end_date=2015-04-27
var URL = "http://mysterious-thicket-9681.herokuapp.com/rest/v1/feed?start_date="+todayDate+"&end_date="+todayDate;

     ajax({
       url: URL,
       type: 'json'
     },
     function(data) {
     // Success!
//     console.log("Successfully fetched Asteroid data!" + data);
     var object = data;
     var nearEarthObjects = object.near_earth_objects ;
     for(var i = 0; i < nearEarthObjects[todayDate].length; i++) {
         var obj = nearEarthObjects[todayDate][i];
         var lunarDistance = obj.close_approach_data[0].miss_distiance.lunar_distance;
         asteroids.push( {
             title: obj.name,
             subtitle: "Lunar Distance " + lunarDistance
         });
     }

    var asteroid_list = new UI.Menu({
      sections: [{
        title: 'Asteroid Today',
        items: asteroids
       }]
     });
    asteroid_list.show();
  },
  function(error) {
    // Failure!
    console.log('Failed fetching Asteroid data: ' + error);
  }
);
