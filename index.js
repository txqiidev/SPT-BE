const express = require("express");
const modulesAdmin = require("./routes/modulesAdmin");
const studyprogramme = require("./routes/studyprogramme");
const locations = require("./routes/locations");
const student = require("./routes/student");
const user = require("./routes/user");
const auth = require("./routes/auth");
const home = require("./routes/home");
const logger = require("./middleware/logger");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(logger);
app.use(helmet());
app.use(morgan("tiny"));
app.use("/api/admin/modules", modulesAdmin);
app.use("/api/student", student);
app.use("/api/studyprogramme", studyprogramme);
app.use("/api/locations", locations);
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/", home);

app.listen(process.env.PORT || "3000", () =>
  console.log(`Listening on port: ${process.env.PORT || "3000"}..`)
);
