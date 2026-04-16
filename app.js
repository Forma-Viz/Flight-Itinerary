(function () {
  const trips = Array.isArray(window.TRIPS) ? window.TRIPS.slice() : [];
  const tripList = document.getElementById('tripList');
  const pastTripList = document.getElementById('pastTripList');
  const pastSection = document.getElementById('pastSection');
  const tripTemplate = document.getElementById('tripTemplate');
  const legTemplate = document.getElementById('legTemplate');
  const todayText = document.getElementById('todayText');
  const tripCount = document.getElementById('tripCount');

  function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  function getTripOffsetDays(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tripDate = new Date(dateStr + 'T00:00:00');
    return Math.round((tripDate - today) / 86400000);
  }

  function getTripState(dateStr) {
    const offsetDays = getTripOffsetDays(dateStr);
    if (offsetDays < 0) return 'past';
    if (offsetDays === 0) return 'today';
    if (offsetDays <= 3) return 'soon';
    return 'upcoming';
  }

  function getUpcomingBadgeLabel(dateStr) {
    const offsetDays = getTripOffsetDays(dateStr);
    if (offsetDays <= 0) return 'Upcoming';
    return `Upcoming · ${offsetDays} day${offsetDays === 1 ? '' : 's'}`;
  }

  function buildStatusUrl(flight) {
    const q = `${flight.airline} ${flight.flightNumber} flight status`;
    return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
  }

  const sortedTrips = trips.sort((a, b) => {
    const aOffset = getTripOffsetDays(a.date);
    const bOffset = getTripOffsetDays(b.date);
    const aPast = aOffset < 0;
    const bPast = bOffset < 0;

    if (aPast !== bPast) return aPast ? 1 : -1;
    if (!aPast) return aOffset - bOffset;
    return bOffset - aOffset;
  });

  todayText.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date());
  tripCount.textContent = String(sortedTrips.length);

  if (!sortedTrips.length) {
    tripList.innerHTML = '<div class="empty-state">No trips found.</div>';
    return;
  }

  let hasPastTrips = false;

  sortedTrips.forEach((trip) => {
    const state = getTripState(trip.date);
    const node = tripTemplate.content.firstElementChild.cloneNode(true);
    const summaryBtn = node.querySelector('.trip-summary');
    const details = node.querySelector('.trip-details');
    const legsWrap = node.querySelector('.legs');

    node.classList.toggle('past', state === 'past');
    node.classList.toggle('today', state === 'today');
    node.classList.toggle('soon', state === 'soon');

    node.querySelector('.trip-date').textContent = formatDate(trip.date);
    node.querySelector('.trip-badge').textContent = state === 'past' ? 'Past' : getUpcomingBadgeLabel(trip.date);
    node.querySelector('.trip-center-date').textContent = formatDate(trip.date);
    node.querySelector('.trip-center-badge').textContent = state === 'past' ? 'Past' : getUpcomingBadgeLabel(trip.date);
    node.querySelector('.from-city').textContent = trip.summary.fromCity;
    node.querySelector('.from-code').textContent = `${trip.summary.fromIATA} · ${trip.summary.fromCountry}`;
    node.querySelector('.to-city').textContent = trip.summary.toCity;
    node.querySelector('.to-code').textContent = `${trip.summary.toIATA} · ${trip.summary.toCountry}`;
    node.querySelector('.depart-time').textContent = trip.summary.departTime;
    node.querySelector('.arrive-time').textContent = trip.summary.arriveTime;

    trip.flights.forEach((flight) => {
      const leg = legTemplate.content.firstElementChild.cloneNode(true);
      leg.querySelector('.leg-flight').textContent = `${flight.airline} ${flight.flightNumber}`;
      leg.querySelector('.leg-route').textContent = `${flight.departCity} (${flight.departIATA}) → ${flight.arriveCity} (${flight.arriveIATA})`;
      leg.querySelector('.leg-times').textContent = `${flight.departTime} to ${flight.arriveTime}`;
      const link = leg.querySelector('.status-link');
      link.href = buildStatusUrl(flight);
      legsWrap.appendChild(leg);
    });

    summaryBtn.addEventListener('click', () => {
      const expanded = summaryBtn.getAttribute('aria-expanded') === 'true';
      summaryBtn.setAttribute('aria-expanded', String(!expanded));
      details.hidden = expanded;
    });

    if (state === 'past') {
      hasPastTrips = true;
      pastTripList.appendChild(node);
    } else {
      tripList.appendChild(node);
    }
  });

  if (hasPastTrips) {
    pastSection.hidden = false;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
