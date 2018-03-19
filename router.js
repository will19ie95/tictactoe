const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require('multer')
const upload = multer();

// const home = require("./controllers/home.js");
const game = require("./controllers/ttt.js");
const play = require("./controllers/play.js");
const userController = require("./controllers/user.js");
const rabbitmq = require("./controllers/rabbitmq.js")
const cassandra = require("./controllers/cassandra.js")

const init_locals = function(req, res, next) {
  res.locals.user = req.user;
  res.locals.date = new Date();
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
};

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) { 
    next()
  } else {
    res.json({
      status: "ERROR"
    })
  }
}

router.use(init_locals);

// POST API Calls
router.post("/ttt/play", ensureAuthenticated, game.play);
router.post("/adduser", userController.addUser);
router.post("/verify", userController.verify);
router.post("/login", userController.login_post);
router.post("/logout", userController.logout);
router.post("/listgames", game.listGames);
router.post("/getgame", game.getGame);
router.post("/getscore", game.getScore);
// hw3 
router.post("/listen", rabbitmq.listen);
router.post('/speak', rabbitmq.speak);

// GET API Calls
router.get("/login", userController.login_get);
router.get("/signup", userController.signup_get);
router.get("/logout", userController.logout);
router.get("/", game.home);

// hw4
router.post("/deposit", upload.single('contents'), cassandra.deposit)
router.get("/retrieve", cassandra.retrieve)

// catch all other routes
router.use("*", function (req, res) {
  res.redirect("/");
})

// catch error
router.use(function (err, req, res, next) {
  console.log(err);
  return res.status(404).json({
    "status": "ERROR"
  });
})

module.exports = router;
