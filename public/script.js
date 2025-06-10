document.addEventListener("DOMContentLoaded", () => {
  fetch("/events")
    .then(res => res.json())
    .then(events => {
      const eventList = document.querySelector(".event-list");
      eventList.innerHTML = "";
      events.forEach(event => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
          <h3>${event.title}</h3>
          <p>Date: ${event.event_date}</p>
          <p>Location: ${event.location}</p>
          <button onclick="bookTicket('${event.title}')">Book Now</button>
        `;
        eventList.appendChild(eventCard);
      });
    });
});

function bookTicket(eventTitle) {
  fetch("/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventTitle }),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
    })
    .catch(err => {
      alert("Booking failed.");
      console.error(err);
    });
}
