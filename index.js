const express = require("express");
const modules = require("./routes/modulesAdmin");
const home = require("./routes/home");
const logger = require("./middleware/logger");
const authenticator = require("./middleware/authenticator");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(logger);
app.use(authenticator);
app.use(helmet());
app.use(morgan("tiny"));
app.use("/api/modules", modules);
app.use("/", home);

app.listen(3000, () => console.log("Listening on port 3000.."));
