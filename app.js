const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set("view engine", "ejs");

app.grid = [" ", " ", " ", " ", "", " ", " ", " ", " "];
app.winner = " ";

app.use(function(req, res, next) {
  next();
});

app
  .get("/", (req, res) => res.render("pages/login"))
  .post("/", function(req, res) {

    app.grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    app.winner = " ";

    console.log("*** Restarting ***");

    res.render("pages/hello", {
      name: req.body.name,
      date: new Date(),
      data: {
        grid: app.grid
      }
    });
  });

function check_winner(grid) {
  var winner = " ";

  if (grid[0] === "X" || grid[0] === "O") {
    // winning with 0
    if (
      (grid[0] === grid[1] && grid[1] === grid[2]) ||
      (grid[0] === grid[3] && grid[3] === grid[6])
    ) {
      winner = grid[0];
    }

  }
  
  if (grid[4] === "X" || grid[4] === "O") {
    // winning with 4
    if (
      (grid[0] === grid[4] && grid[4] === grid[8]) ||
      (grid[1] === grid[4] && grid[4] === grid[7]) ||
      (grid[2] === grid[4] && grid[4] === grid[6]) ||
      (grid[3] === grid[4] && grid[4] === grid[5])
    ) {
      winner = grid[4];
    }
    
  }
  
  if (grid[8] === "X" || grid[8] === "O") {
    // winning with 8
    if (
      (grid[2] === grid[5] && grid[5] === grid[8]) ||
      (grid[6] === grid[7] && grid[7] === grid[8])
    ) {
      winner = grid[8];
    }
  }

  return winner;
};

app.post("/play", function(req, res) {
  
  // accept user move
  app.grid = req.body.grid;

  console.log("\nRequest \n\t", app.grid);

  let winner = check_winner(app.grid);
  let tie = false;

  if (winner !== "O" && winner !== "X") {
    canMove = false;

    for (var i = 0; i < app.grid.length; i++) {
      if (app.grid[i] !== "X" && app.grid[i] !== "O") {
        canMove = true;
      }
    }

    //number of X
    //number of O


    // place a move
    if (canMove) {
      // computer makes a random move
      placing_move = true;

      while (placing_move) {
        let rand = Math.floor(Math.random() * 9);
        if (app.grid[rand] !== "X" && app.grid[rand] !== "O") {
          app.grid[rand] = "O";
          placing_move = false;
        }
      }
    } else {
      // Tie, implement?
      // console.log(" Tie! ");
      tie = true;
    }
  }

  winner = check_winner(app.grid);
  // if (winner === undefined) {
  //   winner = " ";
  // }

  send_grid = app.grid.slice();

  if (tie === true) {
    winner = " ";
    app.grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  } else if (winner === "X" || winner === "O") {
    app.grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  } else {
    winner = undefined;
  }

  
  data = {
    grid: send_grid,
    winner: winner
  }

  console.log("\nSending \n\t", data)

  // users turn again
  res.json(data);

})

app.listen(8080, () => console.log("Example app listening on port 8080!"));
