const express = require("express");
const router = express.Router();

router.post("/", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
});

module.exports = router;
