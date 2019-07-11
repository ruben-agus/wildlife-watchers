function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let cities = {
  madrid: { lat: 40.416775, lng: -3.703790 },
  barcelona: { lat: 41.390205, lng: 2.154007 },
  zaragoza: { lat: 41.649693, lng: -0.887712 }
}

var input = document.getElementById('search-box');
var searchBox = new google.maps.places.SearchBox(input);

const map = new google.maps.Map(
  document.getElementById('choose-map'),
  {
      zoom: 6,
      center: {
          lat: cities.madrid.lat,
          lng: cities.madrid.lng
      }
  }
);

let waypoints = []

markersIds = 0

map.addListener("click", (e) => {
  waypoints[markersIds] = {
      location: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
      },
      stopover: true
  }
  
  const marker = new google.maps.Marker({
      position: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
      },
      animation: google.maps.Animation.DROP,
      draggable: true,
      map: map,
      title: "Estoy aqui"
  });
  document.getElementById("lat").value = e.latLng.lat()
  document.getElementById("lng").value = e.latLng.lng()
})

// Bias the SearchBox results towards current map's viewport.
map.addListener('bounds_changed', function () {
  searchBox.setBounds(map.getBounds());
});

var markers = [];
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener('places_changed', function () {
  var places = searchBox.getPlaces();

  if (places.length == 0) {
      return;
  }

  // Clear out the old markers.
  markers.forEach(function (marker) {
      marker.setMap(null);
  });
  markers = [];

  // For each place, get the icon, name and location.
  var bounds = new google.maps.LatLngBounds();
  places.forEach(function (place) {
      if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
      }
      var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
      }));

      if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
      } else {
          bounds.extend(place.geometry.location);
      }
  });
  map.fitBounds(bounds);
});


