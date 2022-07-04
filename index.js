const express = require("express");
const app = express();
const port = 8000;

app.get("/", (req, res) => {
  const data = {
    name: "Iron Maiden",
    isAwesome: true,
  };
});

app.listen(port, () => {
  console.log(`Backend app running on http://localhost:${port}`);
});
