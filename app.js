const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const logger = require("morgan");
const passport = require("passport");

const setup_passport = require("./setup_passport")

// routes
const router = require("./router.js");

const app = express();
const port = 8080;

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "/views/layouts"),
    partialsDir: path.join(__dirname, "/views/partials")
  })
);
app.set("view engine", "handlebars");
app.set("port", port);

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://130.245.168.108:27017/demo");
setup_passport();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cookieParser());

app.use(
  session({
    secret: "water is life",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// logger
app.use(logger("dev"));

app.use(router);

app.use(function(err, req, res, next) {
  console.err(err);
  res.status(404).send("Sever Error")
})

app.listen(port, () => console.log("Example app listening on port " + port));
