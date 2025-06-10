const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend from /public
app.use(express.static(path.join(__dirname, "../public")));

// Database config
const dbConfig = {
  host: "hostname",
  user: "service-account",
  password: "password",
  database: "dbname",
};

app.get("/events", async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute("SELECT * FROM events");
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/book", async (req, res) => {
  const { eventTitle, userName = "Guest" } = req.body;

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [event] = await conn.execute("SELECT id FROM events WHERE title = ? LIMIT 1", [eventTitle]);

    if (event.length === 0) {
      await conn.end();
      return res.status(404).json({ message: "Event not found" });
    }

    const eventId = event[0].id;
    await conn.execute("INSERT INTO bookings (event_id, user_name) VALUES (?, ?)", [eventId, userName]);
    await conn.end();

    res.json({ message: `Successfully booked for ${eventTitle}` });
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
