const express = require("express");
const router = express.Router();
const passport = require("passport");
const amqp = require('amqplib/callback_api');
const self = this

// const home = require("./controllers/home.js");
const game = require("./controllers/ttt.js");
const play = require("./controllers/play.js");
const userController = require("./controllers/user.js");

  amqp.connect('amqp://localhost', function (err, conn) {
    self.conn = conn
  });

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
    // req.flash("info", "You must be logged in.")
    // res.redirect("/")
    res.json({
      status: "ERROR"
    })
  }
}

router.use(init_locals);

// POST API Calls
// router.post("/signup", signup);
router.post("/ttt/play", ensureAuthenticated, game.play);
router.post("/adduser", userController.addUser);
router.post("/verify", userController.verify);
router.post("/login", userController.login_post);
router.post("/logout", userController.logout);
router.post("/listgames", game.listGames);
router.post("/getgame", game.getGame);
router.post("/getscore", game.getScore);
// getscore

router.get("/login", userController.login_get);
router.get("/signup", userController.signup_get);
router.get("/logout", userController.logout);

// hw3 

// listen, receiver
router.post("/listen", function(req, res) {

  self.conn.createChannel(function (err, ch) {
    keys = req.body.keys
    var ex = 'hw3';

    ch.assertExchange(ex, 'direct', { durable: false });
    ch.assertQueue('', { exclusive: true }, function (err, q) {
      console.log(' [*] Waiting for logs. To exit press CTRL+C', q.queue);

      keys.forEach(function (key) {
        ch.bindQueue(q.queue, ex, key);
      });

      ch.consume(q.queue, function (msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
        // return the message
        if (msg) {
          ch.close();
          return res.json({
            status: "OK",
            msg: msg.content.toString()
          })
        } 
      }, { noAck: true });
      
      
    });
  });
})

// speak, emiter
router.post('/speak', function(req, res) {

  self.conn.createChannel(function (err, ch) {
    var ex = 'hw3';
    key = req.body.key;
    msg = req.body.msg;

    ch.assertExchange(ex, 'direct', { durable: false });
    ch.publish(ex, key, new Buffer(msg));
    console.log(" [x] Sent %s: '%s'", key, msg);
    ch.close()
    return res.json({
      status: "OK"
    })
  });
})


router.get("/", game.home);


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
