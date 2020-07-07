const express = require("express");
const modulesAdmin = require("./routes/modulesAdmin");
const studyprogramme = require("./routes/studyprogramme");
const home = require("./routes/home");
const logger = require("./middleware/logger");
const authenticator = require("./middleware/authenticator");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(logger);
app.use(authenticator);
app.use(helmet());
app.use(morgan("tiny"));
app.use("/api/admin/modules", modulesAdmin);
app.use("/api/admin/studyprogramme", studyprogramme);
app.use("/", home);

app.listen(process.env.PORT || "3000", () =>
  console.log(`Listening on port: ${process.env.PORT || "3000"}..`)
);
