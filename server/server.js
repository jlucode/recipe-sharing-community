require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(cors());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  // perform a database connection when server starts
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});