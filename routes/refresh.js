require("dotenv").config();
const axios = require("axios");
const express = require("express");
const querystring = require("querystring");
const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

router.get("/", async (req, res) => {
  const { refresh_token } = req.query;
  const data = querystring.stringify({
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  });
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${new Buffer.from(
      `${CLIENT_ID}:${CLIENT_SECRET}`
    ).toString("base64")}`,
  };
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      data,
      { headers }
    );
    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
