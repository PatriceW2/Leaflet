/* NOTE FOR STEP 2
/  You can use the javascript Promise.all function to make two d3.json calls, 
/  and your then function will not run until all data has been retreived.
/
/ ----------------------------------------
/  Promise.all(
/    [
/        d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"),
/        d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
/    ]
/  ).then( ([data,platedata]) => {
/
/        console.log("earthquakes", data)
/        console.log("tectonic plates", platedata)
/
/    }).catch(e => console.warn(e));
/
/ ----------------------------------------*/

//create the map
const myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
  });


  //add a tile layer
  //const darkmap = 
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  }).addTo(myMap);






const geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"


d3.json(geoData).then(data => {
    console.log(data);
    //function styling (feature) {
       // return {
           // opacity: 1,
           // fillOpacity: 1,
           // color: "Red",
           // radius : findRadius (feature.properties.mag),
          //  fillColor: findColor (feature.geometry.coordinates[2]),
          //  stroke: true,
          //  weight: 0.5
       // };
    //};

    function findRadius (magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return (magnitude * 200000);
        
    };

    function findColor(depth) {
        switch(true){
           case depth > 90:
               return "Red";
            case depth > 70:
               return "Orange";
            case depth > 50:
               return "Yellow";
            case depth > 30:
               return "Blue";
            case depth > 10:
               return "Green"
            
            default:
               return "Black";
        };
    };

    L.geoJson(data, {
        
        pointtolayer: (feature, latlng) => {
            return new L.Circle(latlng, {
                opacity: 1,
                fillOpacity: 1,
                color: "Black",
                radius : findRadius (feature.properties.mag),
                fillColor: findColor (feature.geometry.coordinates[2]),
                stroke: true,
                weight: 0.5
            });
        },
        //style: styling,

        onEachFeature: (feature, layer) => {
            layer.bindPopup("Magnitude: " + feature.properties.mag 
            + "<br> Depth: " + feature.geometry.coordinates[2] 
            + "<br> Location: " + feature.properties.title
            )
    }
    }).addTo(myMap);

    //add legend here
    const legend = L.control({ position: "bottomright", fillColor : "White"});
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");
        const limits = ["<10", "30", "50", "70", "90"];
        const labels = [];
        const colors = ["Green" , "Blue" , "Yellow", "Orange", "Red"]
        

        div.innerHTML = `<h3>Earthquake Depth</h3>`;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color:" + colors[index] + ";list-styoe-type: none" + "\">" + limits[index] + "</li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        
        return div;
    };legend.addTo(myMap);
  


});
