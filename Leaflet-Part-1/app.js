// app.js

// Initialize the Leaflet map
let map = L.map('map').setView([20, 0], 2);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Load the GeoJSON data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson').then(data => {
  // Function to determine marker size based on magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  }

  // Function to determine marker color based on depth
  function markerColor(depth) {
    return depth > 90 ? '#d73027' :
           depth > 70 ? '#fc8d59' :
           depth > 50 ? '#fee08b' :
           depth > 30 ? '#d9ef8b' :
           depth > 10 ? '#91cf60' :
                        '#1a9850';
  }

  // Add GeoJSON layer to the map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`
        <h3>${feature.properties.place}</h3>
        <hr>
        <p>Magnitude: ${feature.properties.mag}</p>
        <p>Depth: ${feature.geometry.coordinates[2]} km</p>
        <p><a href="${feature.properties.url}" target="_blank">More info</a></p>
      `);
    }
  }).addTo(map);

  // Create a legend
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'legend');
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'];

    div.innerHTML = '<strong>Depth (km)</strong><br>';
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(map);
});
