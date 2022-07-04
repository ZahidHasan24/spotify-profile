require("dotenv").config();
const express = require("express");
const router = express.Router();
const querystring = require("querystring");
const { generateRandomString } = require("../utils");

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const stateKey = "spotify_auth_state";

router.get("/", (req, res) => {
  const state = generateRandomString(20);
  res.cookie(stateKey, state);

  const scope = "user-read-private user-read-email";

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

module.exports = router;
