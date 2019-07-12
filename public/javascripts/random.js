let randomImg = document.getElementById("random-img");
let randomName = document.getElementById("random-name");
let randomText = document.getElementById("random-text");

console.log(randomImg)
console.log(randomText)
console.log(randomName)

axios.get("/auth/random").then(JSONPayload => {
  // randomImg.innerHTML = ``;
  // randomName.innerHTML = ``;
  // randomText.innerHTML = ``;
  randomImg.innerHTML = `<img class="normalize" src="${JSONPayload.data.animalImg}">`;
  randomName.innerHTML = `${JSONPayload.data.name}`;
  randomText.innerHTML = `${JSONPayload.data.description}`;
});
