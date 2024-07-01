const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();
app.use(cors());
const port = process.env.PORT || 3000;

app.get("/api/hello", async (req, res) => {
  const name = req.query.visitor_name || "Guest";
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    // Get location data
    const locationResponse = await axios.get(`http://ip-api.com/json/${ip}`);
    const locationData = locationResponse.data;
    const city = locationData.city || "Unknown city";

    // Get weather data
    const weatherApiKey = process.env.TEMP_API;
    const weatherResponse = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}`
    );
    const weatherData = weatherResponse.data;
    const temperature = weatherData.current.temp_c;

    res.json({
      client_ip: ip,
      location: city,
      greeting: `Hello, ${name}!, the temperature is ${temperature} degrees Celsius in ${city}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;