Family Travel Itinerary

Files:
- index.html
- styles.css
- app.js
- manifest.webmanifest
- sw.js
- data/trips.js
- icon.png (place your 288x288 icon here in the site root)

GitHub Pages:
1. Upload all files to your repository root or chosen folder.
2. Make sure icon.png is placed in the same folder as index.html.
3. Enable GitHub Pages.
4. Open the site once in Safari/Chrome so the service worker and manifest are detected.

Editing trips:
- Open data/trips.js
- Each trip is its own object block
- Duplicate a block and adjust values for future trips

Notes:
- Trips in the past are moved to the Previous Flights section automatically.
- Trips today are highlighted green.
- Trips within the next 3 days use a slightly lighter card color.
- The Upcoming badge shows days remaining when the trip is still ahead.
- Flight status links open a Google search for that specific flight.
- All times are shown exactly as entered in local 24-hour format.
