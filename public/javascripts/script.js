// document.addEventListener('DOMContentLoaded', () => {

//   console.log('IronGenerator JS imported successfully!');

// }, false);

const ironhackBCN = {
  lat: 41.3977381,
  lng: 2.190471916
};
const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 4,
  center: ironhackBCN
});

axios.get("/auth/json").then(JSONPayload => {
  console.log(JSONPayload);
  JSONPayload.data.forEach(animal => {
    var contentString = `<h1>${animal.name}</h1><p>${
      animal.description
    }</p> <img src="${animal.animalImg.url}" width="400px">`;

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    const marker = new google.maps.Marker({
      position: {
        lng: animal.location.coordinates[0],
        lat: animal.location.coordinates[1]
      },
      animation: google.maps.Animation.DROP,
      map: map,
      title: animal.name
    });

    marker.addListener("click", function() {
      infowindow.open(map, marker);
    });
  });
});
