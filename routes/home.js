const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  res.render("login");
});

router.post("/", function(req, res) {
  grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

  res.render("ttt", {
    name: req.body.name,
    date: new Date(),
    data: {
      grid: grid
    }
  });
});

module.exports = router;
