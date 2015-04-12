var UI = require('ui');
var ajax = require('ajax');

// Construct URL
var URL = 'https://raw.githubusercontent.com/AsteroidTracker/AsteroidTrackerService/master/v2/neo_upcoming/upcoming';
var asteroids = [];

var d = new Date();
var todayDate = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay();

// Make the request
ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    console.log("Successfully fetched Asteroid data!", data);

      for(var i = 0; i < data.length; i++) {
        var obj = data[i];
        console.log("DATA 2" + obj.date_group );
        if (obj.date_group == todayDate) {
            for(var n = 0; n < obj.neo_entities.length; n++) {
                console.log("DATA 2" + obj.neo_entities[n].name);                
                asteroids.push( {
                        title: obj.neo_entities[n].name,
                        subtitle: "Lunar Distance " + obj.neo_entities[n].miss_distance_ld
                    });
            }
        }
    }

    // Create the Menu, supplying the list of fruits
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
    console.log('Failed fetching weather data: ' + error);
  }
);
