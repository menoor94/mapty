"use strict";

//Menoor lat lng = 34.5060703531652 47.962886095047004

const form = document.getElementById("workout-form");
const formContainer = document.getElementById("form-container");
const distance = document.getElementById("distance");
const workoutType = document.getElementById("workout-type");
const workoutCadence = document.getElementById("workout-cadence");
const workoutDuration = document.getElementById("workout-duration");
const workoutElev = document.getElementById("workout-elev");

let mapEvent, map;
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude } = pos.coords;
      const { longitude } = pos.coords;
      const coords = [latitude, longitude];

      map = L.map("map").setView(coords, 15);

      L.tileLayer(
        "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
        {
          attribution:
            "&copy; OpenStreetMap contributors, Tiles style by CyclOSM hosted by OpenStreetMap France",
        },
      ).addTo(map);

      map.on("click", function (e) {
        mapEvent = e;
        formContainer.classList.remove("hidden");
        distance.focus();
      });
    },
    () => {
      console.error("could not do it");
    },
  );
}
console.log(form);
form.addEventListener("submit", function (e) {
  e.preventDefault();

  workoutType.value = "Running";
  workoutCadence.value = workoutDuration.value = distance.value = "";

  let type;
  workoutType.value === "Running"
    ? (type = "running-popup")
    : (type = "cycling-popup");

  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        minWidth: 90,
        maxWidth: 150,
        autoClose: false,
        closeOnClick: false,
        className: type,
      }),
    )
    .setPopupContent(workoutType.value)
    .openPopup();
});
workoutType.addEventListener("change", function () {
  workoutCadence.closest(".form--row").classList.toggle("hidden");
  workoutElev.closest(".form--row").classList.toggle("hidden");
});
