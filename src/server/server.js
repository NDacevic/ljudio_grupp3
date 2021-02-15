// server port
const port = 3000;

// express server
const express = require("express");
const app = express();

// add body-parser to express
const bodyParser = require("body-parser");
// register as middleware
app.use(bodyParser.json());

// add cookie-parser to express
const cookieParser = require("cookie-parser");
// register as middleware
app.use(cookieParser());

// add express-session to express
const session = require("express-session");
// register as middleware
app.use(
  session({
    secret: "keyboard cat boddyfollymeskaweq456",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // ändra till true för secure cookie (felsöka behövs här nu)
  })
);

const db = require("mssql");
async function connectToMsSql() {
  try {
    db.pool = await db.connect({
      user: "ljudio",
      password: "Ll63!9TD_243",
      server: "den1.mssql8.gear.host",
      database: "ljudio",
    });
  } catch (err) {
    console.trace(err);
  }
}

// load apis / endpoints

require("./Api-endpoints.js")(app, db);
require("./youtube-endpoints.js")(app, db);

// start the server
app.listen(port, async () => {
  await connectToMsSql();
  console.log("server running");
});
