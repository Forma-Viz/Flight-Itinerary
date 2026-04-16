# Family Travel Itinerary Site

Files:
- `index.html` — main page
- `styles.css` — dark responsive styling
- `app.js` — rendering logic, date sorting, past trip styling
- `data/trips.js` — editable trip data blocks

## Editing future trips
Open `data/trips.js` and duplicate one trip object inside `window.TRIPS = [ ... ]`.
Each object represents one trip day, and each flight leg is listed inside its `flights` array.

Dates use `YYYY-MM-DD`.
Times use 24-hour format `HH:MM`.

## GitHub Pages
Upload the full folder contents to your repo root (or docs folder if that is how your Pages site is configured).
