const express = require("express");
const router = express.Router();

const play = require("./routes/play.js");
const home = require("./routes/home.js");
const adduser = require("./routes/addUser.js");

const init_locals = function(req, res, next) {
  res.locals.currenUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.info = req.flash("info");
  next();
};

router.use(init_locals);

// home page
router.use("/", home);
// play API
router.use("/play", play);
router.use("/adduser", adduser);

module.exports = router;
