"use strict";

//Menoor lat lng = 34.5060703531652 47.962886095047004

const form = document.getElementById("workout-form");
const formContainer = document.getElementById("form-container");
const workoutDistance = document.getElementById("distance");
const workoutType = document.getElementById("workout-type");
const workoutCadence = document.getElementById("workout-cadence");
const workoutDuration = document.getElementById("workout-duration");
const workoutElev = document.getElementById("workout-elev");
const workoutList = document.getElementById("workout-list");

// let mapEvent, map;

class Workout {
  date = new Date();
  id = (Date.now() + " ").slice(-10);
  constructor(coords, duration, distance) {
    this.coords = coords;
    this.duration = duration;
    this.distance = distance;
  }

  _setDescription(workout) {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', "October", "November", "December"]

    this.description = `${this.type} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    console.log(this.type);
  }
}

class Running extends Workout {
  type = "Running";
  constructor(coords, duration, distance, cadence) {
    super(coords, duration, distance);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    //Pace in KM
    return (this.pace = this.duration / this.distance);
  }
}

class Cycling extends Workout {
  type = "Cycling";
  constructor(coords, duration, distance, elev) {
    super(coords, duration, distance);
    this.elev = elev;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    //KM/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
// console.log(new Running([12.42, 41.14], 12, 3, 300));
// console.log(new Cycling([12.42, 41.14], 12, 4, 30));

//////////////////////////////////
//App class
class App {
  #map;
  #mapEvent;
  #mapZoomLvl = 13;
  #workouts = [];

  constructor() {
    this._getPosition();

    //Event handlers
    form.addEventListener("submit", this._newWorkout.bind(this));
    workoutType.addEventListener("change", this._toggleElevationField);
    workoutList.addEventListener("click", this._moveToPopup.bind(this));
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
    formContainer.classList.remove("hidden");
    formContainer.classList.remove("opacity-100");
    workoutDistance.focus();
  }

  _hideForm() {
    workoutElev.value =
      workoutCadence.value =
      workoutDuration.value =
      workoutDistance.value =
        "";

    formContainer.classList.add("hidden");
  }

  _newWorkout(e) {
    e.preventDefault();

    const checkInputValid = (...input) => {
      return input.every((inp) => Number.isFinite(inp));
    };
    const checkInputPositivity = (...input) => input.every((inp) => inp > 0);

    //Get data from form
    const type = workoutType.value;
    const distance = +workoutDistance.value;
    const duration = +workoutDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (!type) return alert("set a workout type");
    //If workout running create running object
    if (type === "Running") {
      //Check data validation
      const cadence = +workoutCadence.value;
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
      const elevGain = +workoutElev.value;
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
    console.log(workout);
    console.log(this.#workouts);

    //Render workout on map as a marker

    this._renderWorkoutMarker(workout);
    // Hide form  +  Clear input fields

    this._hideForm();

    workoutType.value = type;
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
    workoutCadence.closest(".form--row").classList.toggle("hidden");
    workoutElev.closest(".form--row").classList.toggle("hidden");
  }

  _renderWorkouts(workout) {
    const html = `
    <li
            data-id="${workout.id}"
            class="--workout-container my-3 w-full h-44 md:h-24 flex flex-col justify-center pl-5 bg-gray-700 rounded relative"
          >
            <h1 class="md:text-xl absolute top-1">${workout.description}</h1>
            <div
              class="w-full flex flex-col md:flex-row justify-between container mt-10"
            >
              <span>${workout.type === "Running" ? "🏃‍♂️" : "🚴‍♂️"} ${workout.distance} km</span>
              <span>⏲ ${workout.duration} min</span>
              <span>⚡ ${workout.type === "Running" ? `${workout.pace.toFixed(1)} pace` : `${workout.speed.toFixed(1)} speed`}</span>
              <span class="mr-4"> ${workout.type === "Running" ? `${workout.cadence} steps` : `${workout.elev} elevation`}</span>
            </div>
          </li>
    `;

    // workoutList.insertAdjacentHTML("afterbegin", html);
    workoutList.innerHTML += html;
    // workoutList.append(html);
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
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }

  _getData() {
    const data = JSON.parse(localStorage.getItem("workouts"));
    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach((workout) => {
      this._renderWorkouts(workout);
      this._renderWorkoutMarker(workout);
    });
    console.log(this.#workouts);
  }
}

const app = new App();

console.log(app);
