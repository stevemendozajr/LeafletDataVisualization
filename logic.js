// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

function radiusSize(mag_parm) {
  return mag_parm * 5;
};  


// Perform a GET request to the query URL 
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  
});


function createFeatures(earthquakeData) {


  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.mag + 
    " magnitude " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");    
  }

  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: radiusSize(feature.properties.mag),
        fill: true,
        fillColor: circleColor(feature.properties.mag),
        color: "black",
        weight: 1,
        opacity: .75,
        stroke: true,
        fillOpacity: .75
      });
    }  
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function circleColor(m) {

  if (m > 5) {
    return "red";
  } else if (m > 4) {
    return "darkorange";
  } else if (m > 3) {
    return 'orange';
  } else if (m > 2) {
    return "yellow";
  } else if (m > 1) {
    return "yellowgreen";
  } else {
    return "green";
  } 
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  
  var legend = L.control({ position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
      mag_size = [0, 1, 2, 3, 4, 5],
      labels = [];
      

    div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

    for (var i = 0; i < mag_size.length; i++) {
      div.innerHTML +=
        '<i class="square" style="background:' + circleColor(mag_size[i] + 1) + '"></i> ' +
        mag_size[i] + (mag_size[i + 1] ? '&ndash;' + mag_size[i + 1] + '<br>' : '+');
    } 
    return div;

  };

  legend.addTo(myMap);

}








