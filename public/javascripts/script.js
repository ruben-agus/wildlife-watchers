// document.addEventListener('DOMContentLoaded', () => {

//   console.log('IronGenerator JS imported successfully!');

// }, false);



let cities = {
  madrid: {lat : 40.416775, lng : -3.703790},
  barcelona:  {lat :41.390205, lng : 2.154007},
  zaragoza: {lat : 41.649693, lng : -0.887712}
}




class City {
  constructor(name, lat, lng) {
      if (lat<-90 || lat> 90) throw new RangeError("You have specified a wrong lat")
      this.name = name
      this.lat = lat
      this.lng = lng
  }
}


const theMap = new google.maps.Map(
  document.getElementById('map'),
  {
      zoom: 4,
      center: {
          lat: cities.madrid.lat,
          lng: cities.madrid.lng
      }
  }
);