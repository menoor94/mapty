# 🗺️ Mapty 

A workout-tracking web app built with **vanilla JavaScript**, **Leaflet**, and the **Geolocation API**. Log your running and cycling workouts on an interactive map — no frameworks, no build step, just clean modern JavaScript.

---

## ✨ Features

- 🗺️ **Interactive map** — Powered by Leaflet & OpenStreetMap
- 📍 **Click to log workouts** — Click anywhere on the map to add a workout
- 🏃 **Running & cycling** — Different fields for each workout type
- 📊 **Workout list** — All workouts shown in a scrollable sidebar
- 🧭 **Geolocation** — Map auto-centers on your current position
- 💾 **Local storage** — Workouts persist across page reloads
- ⚡ **Zero dependencies** — Pure HTML, CSS, and JavaScript
- 📱 **Responsive** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vanilla JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | App logic (ES6+) |
| [Leaflet](https://leafletjs.com/) | Interactive maps |
| [OpenStreetMap](https://www.openstreetmap.org/) | Map tiles |
| [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) | User's current position |
| [Local Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) | Persist workouts |
| HTML5 + CSS3 | Markup and styling |

---

## 🚀 Getting Started

### Prerequisites

None! Mapty runs entirely in the browser.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mapty.git
cd mapty
```

### Run it

Just open `index.html` in your browser:

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

> 💡 **Tip:** For the best experience (and to avoid geolocation issues), serve it locally:
> ```bash
> npx serve .
> # or
> python3 -m http.server 8000
> ```
> Then visit **http://localhost:8000**.

---

## 📁 Project Structure

```
mapty/
├── index.html          # Main HTML file
├── style.css           # Styles
├── script.js           # App logic
├── logo.png            # App logo
└── README.md
```

Simple, flat structure — no bundler, no framework.

---

## 🎮 How to Use

1. **Allow geolocation** when prompted — the map centers on your location.
2. **Click anywhere on the map** — a form appears in the sidebar.
3. **Choose workout type:**
   - 🏃 **Running** — distance (km), duration (min), cadence (steps/min)
   - 🚴 **Cycling** — distance (km), duration (min), elevation gain (m)
4. **Submit** — the workout appears in the list and a marker is added to the map.
5. **Click a workout** in the list — the map flies to its location.
6. **Reload the page** — your workouts are still there (saved in local storage).

---

## 🧠 Key Concepts Demonstrated

This project is a great showcase of modern vanilla JavaScript:

| Concept | Where it's used |
|---------|-----------------|
| **ES6+ Classes** | `Workout`, `Running`, `Cycling`, `App` |
| **Inheritance** | `Running` and `Cycling` extend `Workout` |
| **Private class fields** | `#map`, `#workouts` |
| **`navigator.geolocation`** | Getting user's position |
| **Leaflet API** | Map, markers, popups, events |
| **`localStorage`** | Persisting workouts |
| **Event delegation** | Handling clicks on workout list items |
| **`Intl` API** | Formatting dates nicely |
| **Async patterns** | Geolocation callbacks |

---

## 🗃️ Data Model

Each workout is stored as an object:

```js
// Running
{
  type: "running",
  distance: 5.2,       // km
  duration: 28,        // min
  cadence: 178,        // steps/min
  coords: { lat: 51.5, lng: -0.09 },
  date: "2025-01-15T07:30:00.000Z",
  id: "abc123"
}

// Cycling
{
  type: "cycling",
  distance: 22.4,      // km
  duration: 65,        // min
  elevation: 320,      // m
  coords: { lat: 51.5, lng: -0.09 },
  date: "2025-01-15T08:00:00.000Z",
  id: "def456"
}
```

---

## 🗺️ Map Configuration

The map uses Leaflet with OpenStreetMap tiles:

```js
const map = L.map("map").setView(coords, 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);
```

---

## 💾 Local Storage

Workouts are saved under the key `workouts`:

```js
localStorage.setItem("workouts", JSON.stringify(this.#workouts));
```

To clear all workouts, run in your browser console:

```js
localStorage.removeItem("workouts");
location.reload();
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
