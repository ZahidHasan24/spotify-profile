const express = require("express");
const router = express.Router();

router.get("/callback", (req, res) => {
  res.send("callback");
});

module.exports = router;