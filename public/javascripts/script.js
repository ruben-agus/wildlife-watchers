// document.addEventListener('DOMContentLoaded', () => {

//   console.log('IronGenerator JS imported successfully!');

// }, false);

const ironhackBCN = {
  lat: 41.3977381,
  lng: 2.190471916};
const map = new google.maps.Map(
  document.getElementById('map'),
  {
    zoom: 4,
    center: ironhackBCN
  }
);


axios
      .get("http://localhost:3000/auth/json")
      .then(JSONPayload => {
        console.log(JSONPayload)
          JSONPayload.data.forEach(place => {
              
              var contentString = `<p>Hola Miriam, ¿te apetece Salmorejo?</p> <img src="https://okdiario.com/img/recetas/2017/04/17/salmorejo-de-mango-2.jpg">`

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        const marker = new google.maps.Marker({
          position: {
              lng: place.location.coordinates[0],
              lat: place.location.coordinates[1],
          },
          animation: google.maps.Animation.DROP,
          map: map,
          title: place.name
      });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
          })
      })
