const express = require("express");
const LoginRouter = require("./routes/login");
const CallbackRouter = require("./routes/callback");
const app = express();
const port = 8000;

app.use("/login", LoginRouter);
app.use("/callback", CallbackRouter);

app.listen(port, () => {
  console.log(`Backend app running on http://localhost:${port}`);
});
