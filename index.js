const express = require("express");
const modulesAdmin = require("./routes/modulesAdmin");
const studyprogramme = require("./routes/studyprogramme");
const locations = require("./routes/locations");
const student = require("./routes/student");
const user = require("./routes/user");
const home = require("./routes/home");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Set up the Request Processing Pipeline

// Executed every time no matter what the URL is
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(helmet());
app.use(morgan("tiny"));

// Routehandlers: Executed when the base path matches --> mounts the specified module
app.use("/api/admin/modules", modulesAdmin);
app.use("/api/student", student);
app.use("/api/studyprogramme", studyprogramme);
app.use("/api/locations", locations);
app.use("/api/user", user);
app.use("/", home);

// Starts the server and is ready to receive connections either on the specified port or port 3000
app.listen(process.env.PORT || "3000", () =>
  console.log(`Listening on port: ${process.env.PORT || "3000"}..`)
);
