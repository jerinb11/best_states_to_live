console.log("javascript is loaded")

d3.json('/data', function (err, data) {
  if (err) throw err;
  console.log(data)
  // console.log(statesData)
  var statedata = statesData.features.map(obj => {
    var costsdata = data.filter(costs => costs.State == obj.properties.name)[0]
    // console.log(costsdata)

    //   filter will produce an array but with [0] it'll be an object (instead of an object in an array)
    obj.properties.density = costsdata.Cost_of_Living
    // obj.properties.State_Abbreviation = costsdata.State_Abbreviation
    // obj.properties.Healthcare = costsdata.Healthcare
    obj.properties.Opportunity = costsdata.Opportunity
    obj.properties.Workforce = costsdata.Workforce
    obj.properties.Economy = costsdata.Economy
    // obj.properties.Fiscal_Stability = costsdata.Fiscal_Stability
    obj.properties.Quality_of_Life = costsdata.Quality_of_Life
    obj.properties.Education = costsdata.Education
    obj.properties.Crime_Rate = costsdata.Crime_Rate
    obj.properties.Estimated_Income = costsdata.Estimated_Income


    return obj
  })

  console.log(statedata)
  // choropleth(statecrimedata)
  // });

  // Creating map object
  var myMap = L.map("map", {
    center: [45, -110],
    zoom: 4
  });

  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  // // Load in geojson data
  // var geoData = "static/data/test2.geojson";

  // var geojson;

  function getColor(d) {
    return d > 65 ? '#525252' :
      d > 55 ? '#525252' :
        d > 45 ? '#525252' :
          d > 35 ? '#88419d' :
            d > 25 ? '#8c6bb1' :
              d > 15 ? '#8c96c6' :
                d > 5 ? '#9ebcda' :
                  '#bfd3e6';
  }
  function style(feature) {
    return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  // Binding a pop-up to each layer
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      "<b>RANKED OUT OF 50</b><hr>" + "STATE: " + feature.properties.name + "<br>COST OF LIVING: " + feature.properties.density
      + "<br>OPPORTUNITY: " + feature.properties.Opportunity
      + "<br>WORKFORCE: " + feature.properties.Workforce + "<br>ECONOMY: " + feature.properties.Economy
      + "<br>QUALITY OF LIFE: " + feature.properties.Quality_of_Life + "<br>EDUCATION: " + feature.properties.Education
      + "<br>CRIME RATE: " + feature.properties.Crime_Rate + "/100,000" + "<br>ESTIMATED AVERAGE INCOME: " + "$" + feature.properties.Estimated_Income + ""
    );
  }

  // // Grab data with d3
  // d3.json(geoData, function(statedata) {
  L.geoJson(statedata, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(myMap)

  // Create a new choropleth layer
  // geojson = L.choropleth(statedata, {

  //   // Define what  property in the features to use
  //   valueProperty: "MHI2016",

  //   // Set color scale
  //   scale: ["#ffffb2", "#b10026"],

  //   // Number of breaks in step range
  //   steps: 10,

  //   // q for quartile, e for equidistant, k for k-means
  //   mode: "q",
  //   style: {
  //     // Border color
  //     color: "#fff",
  //     weight: 1,
  //     fillOpacity: 0.8
  //   },


  // }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Best States to Live</h1>" +
      "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function (limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});
