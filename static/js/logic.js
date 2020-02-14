// create map object
var myMap = L.map('map', {
    center: [37.09, -95.71],
    zoom: 5
});

// add tile layer to the map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

// store API query url
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// create function for markers and popup
function createMarkers(feature) {
    L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
        color: "red",
        fillColor: "orange",
        fillOpacity: 0.75,
        radius: feature.properties.mag*20000})
        .bindPopup(`<h4> ${feature.properties.place} </h4> <hr> <p> ${Date(feature.properties.time)} </p>`)
        .addTo(myMap);
}

// grab data with d3 & create geoJSON layer using marker function
d3.json(url, function(data) {
    L.geoJson(data, {
        pointToLayer: createMarkers
    });
});

