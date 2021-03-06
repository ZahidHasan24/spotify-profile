require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();
const querystring = require("querystring");

const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const FRONTEND_URI = process.env.FRONTEND_URI;

const getUserProfile = async (data) => {
  const { access_token, token_type } = data;
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });
    return {
      status: "ok",
      data: response.data,
    };
  } catch (error) {
    return {
      status: "error",
      data: response,
    };
  }
};

const getRefreshToken = async (refresh_token) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/refresh_token?refresh_token=${refresh_token}`
    );
    return {
      status: "ok",
      data: response.data,
    };
  } catch (error) {
    return {
      status: "error",
      data: response,
    };
  }
};

router.get("/", async (req, res) => {
  const code = req.query.code || null;
  const data = querystring.stringify({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
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
    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data;

      const queryParams = querystring.stringify({
        access_token,
        refresh_token,
        expires_in,
      });
      res.redirect(`${FRONTEND_URI}/?${queryParams}`);
    } else {
      res.redirect(`/?${querystring.stringify({ error: "invalid_token" })}`);
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
