// server.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cors_origin = process.env.CORS_ORIGIN;
const backend_port = process.env.PORT;

const app = express();

let corsOptions = {
  origin: cors_origin,
};

app.use(cors(corsOptions));

// parse req content-type to json
app.use(express.json());

// parse req content-type application/x-ww-form-urlencoded
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ limit: "16mb", extended: true }));

// database
const db = require("./src/models");
db.sequelize.sync();

// test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

//routes
require("./src/routes/property.routes")(app);
require("./src/routes/agent.routes")(app);
require("./src/routes/auth.routes")(app);

// set port, listening
const PORT = backend_port || 8080;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING AT PORT: ${PORT}`);
});
