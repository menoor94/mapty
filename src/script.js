"use strict";

import { Workout, Running, Cycling } from "./Workout.js";
import { dom } from "./elements.js";

class App {
  #map;
  #mapEvent;
  #mapZoomLvl = 13;
  #workouts = [];

  constructor() {
    this._getPosition();

    //Event handlers
    dom.form.addEventListener("submit", this._newWorkout.bind(this));
    dom.workoutType.addEventListener("change", this._toggleElevationField);
    dom.workoutList.addEventListener("click", this._moveToPopup.bind(this));
    dom.workoutList.addEventListener("click", this._deleteWorkout.bind(this));
    // this._saveData();
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          console.error("could not do it");
        },
      );
    }
  }

  _loadMap(pos) {
    const { latitude } = pos.coords;
    const { longitude } = pos.coords;
    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, this.#mapZoomLvl);

    this._getData();
    L.tileLayer(
      "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      {
        attribution:
          "&copy; OpenStreetMap contributors, Tiles style by CyclOSM hosted by OpenStreetMap France",
      },
    ).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }
  _showForm(e) {
    this.#mapEvent = e;
    dom.formContainer.classList.remove("hidden");
    dom.formContainer.classList.remove("opacity-100");
    dom.workoutDistance.focus();
  }

  _hideForm() {
    dom.workoutElev.value =
      dom.workoutCadence.value =
      dom.workoutDuration.value =
      dom.workoutDistance.value =
        "";

    dom.formContainer.classList.add("hidden");
  }

  _newWorkout(e) {
    e.preventDefault();

    const checkInputValid = (...input) => {
      return input.every((inp) => Number.isFinite(inp));
    };
    const checkInputPositivity = (...input) => input.every((inp) => inp > 0);

    //Get data from form
    const type = dom.workoutType.value;
    const distance = +dom.workoutDistance.value;
    const duration = +dom.workoutDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (!type) return alert("set a workout type");
    //If workout running create running object
    if (type === "Running") {
      //Check data validation
      const cadence = +dom.workoutCadence.value;
      if (
        !checkInputValid(cadence, distance, duration) ||
        !checkInputPositivity(cadence, distance, duration)
      ) {
        return alert("Enter only positive numbers");
      }
      workout = new Running([lat, lng], duration, distance, cadence);
      // console.log(workout);
      // console.log(this.#workouts);
    }
    //If workout cycling create cycling object
    if (type === "Cycling") {
      const elevGain = +dom.workoutElev.value;
      if (
        !checkInputValid(elevGain, distance, duration) ||
        !checkInputPositivity(elevGain, distance, duration)
      ) {
        return alert("Enter only positive numbers");
      }
      workout = new Cycling([lat, lng], duration, distance, elevGain);
    }
    //Add new object to workout array
    this.#workouts.push(workout);

    //Render workout on map as a marker

    this._renderWorkoutMarker(workout);
    // Hide form  +  Clear input fields

    this._hideForm();

    dom.workoutType.value = type;
    this._renderWorkouts(workout);

    this._saveData();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          minWidth: 90,
          maxWidth: 150,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        }),
      )
      .setPopupContent(
        `${workout.type === "Running" ? "🏃‍♂️" : "🚴‍♂️"} ${workout.description}`,
      )
      .openPopup();
  }

  _toggleElevationField() {
    dom.workoutCadence.closest(".form--row").classList.toggle("hidden");
    dom.workoutElev.closest(".form--row").classList.toggle("hidden");
  }

  _renderWorkouts(workout) {
    const html = `
    <li
            data-id="${workout.id}"
            class="--workout-container --workout-container-${workout.type}  my-3 w-full h-44 md:h-24 flex flex-col justify-center pl-5 bg-gray-700 rounded relative"
          >
            <button 
              
             class="--delete-workout absolute top-0 right-1 cursor-pointer  text-center "
            >x</button>
            <h1 class="md:text-xl absolute top-1">${workout.description}</h1>
            <div
              class="w-full flex flex-col md:flex-row justify-between container mt-10"
            >
              <span>${workout.type === "Running" ? "🏃‍♂️" : "🚴‍♂️"} ${workout.distance} km</span>
              <span>⏲ ${workout.duration} min</span>
              <span>⚡ ${workout.type === "Running" ? `${workout.pace.toFixed(1)} pace` : `${workout.speed.toFixed(1)} speed`}</span>
              <span class="mr-4"> ${workout.type === "Running" ? `${workout.cadence} steps/m` : `${workout.elev} elevation`}</span>
            </div>
          </li>
    `;
    dom.workoutList.insertAdjacentHTML("beforeend", html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest(".--workout-container");
    if (!workoutEl) return;

    const workoutId = workoutEl.dataset.id;

    const getWorkout = this.#workouts.find(
      (workout) => workout.id === workoutId,
    );

    this.#map.setView(getWorkout.coords, this.#mapZoomLvl, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _saveData() {
    if (this.#workouts.length === 0) {
      localStorage.removeItem("workouts");
    } else {
      localStorage.setItem("workouts", JSON.stringify(this.#workouts));
    }
  }

  _getData(workout) {
    const data = JSON.parse(localStorage.getItem("workouts"));
    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach((workout) => {
      this._renderWorkouts(workout);
      this._renderWorkoutMarker(workout);
    });
  }

  _deleteWorkout(e) {
    const deleteBtn = e.target.closest(".--delete-workout");
    if (!deleteBtn) return;
    const getID = deleteBtn.parentElement.dataset.id;

    this.#workouts = this.#workouts.filter((w) => w.id !== getID);

    // this.#workouts.splice(find);

    deleteBtn.parentElement.remove();
    this._saveData();
    location.reload();
  }

  // _deleteWorkout(e) {
  //   const deleteBtn = e.target.closest(".--delete-workout");
  //   if (!deleteBtn) return;

  //   const workoutEl = deleteBtn.closest(".--workout-container");
  //   const workoutId = workoutEl.dataset.id;

  //   this.#workouts = this.#workouts.filter((w) => w.id !== workoutId);

  //   workoutEl.remove();
  //   this._saveData(); // must run AFTER the filter line above
  // }
}

const app = new App();
