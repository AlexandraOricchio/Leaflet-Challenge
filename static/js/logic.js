// create map object
var myMap = L.map('map', {
    center: [37.09, -95.71],
    zoom: 5
});

// create legend & add to map
var legend = L.control({position: 'bottomright'});
legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var magLabels = ["0-1","1-2","2-3","3-4","4-5","5+"];
    var labels = [];
    var colors = ["Lime", "GreenYellow", "Yellow", "Orange", "OrangeRed", "Red"];
    var legendInfo = '<div class="labels"></div>'; 
    div.innerHTML = legendInfo;
    colors.forEach(function(color, index) {
        labels.push('<li style="background-color: ' + color + '">' + magLabels[index] + '</li>');
    });
    div.innerHTML += '<ul>' + labels.join('') + '</ul>';
    return div;
};

legend.addTo(myMap);

// add tile layer to the map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);


// store API query url
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// creat color scale function 
// if mag<=1 == LawnGreen, mag>1 & mag<2 == GreenYellow, mag>2 & mag<3 == Yellow,
// mag>3 & mag<4 == Orange, mag>4 & mag<5 == OrangeRed, mag>=5 == Red
function colorScale(feature) {

    if (feature.properties.mag<1) {
        var color="Lime";
    }
    else if (feature.properties.mag>=1 && feature.properties.mag<2) {
        var color="GreenYellow";
    }
    else if (feature.properties.mag>=2 && feature.properties.mag<3) {
        var color= "Yellow";
    }
    else if (feature.properties.mag>=3 && feature.properties.mag<4) {
        var color="Orange";
    }
    else if (feature.properties.mag>=4 && feature.properties.mag<5) {
        var color="OrangeRed";
    }
    else if (feature.properties.mag>=5) {
        var color="Red";
    }
    else {
        var color="White";
    }
    
    return color;
}

// create function for markers & popups
function createMarkers(feature) {
    L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
        color: "White",
        fillColor: colorScale(feature),
        fillOpacity: 0.75,
        radius: feature.properties.mag*20000})
        .bindPopup(`<h4> ${feature.properties.place} </h4> <hr> <p> ${Date(feature.properties.time)} </p> <hr> <p> Magnitude: ${feature.properties.mag} </p>`)
        .addTo(myMap);
}

// grab data with d3 & create geoJSON layer using marker function
d3.json(url, function(data) {
    L.geoJson(data, {
        pointToLayer: createMarkers
    });
});


