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

app
  .get("/", (req, res) => res.render("pages/index"))
  .post("/", function(req, res) {
    app.grid = [" ", " ", " ", " ", "", " ", " ", " ", " "];
    app.winner = " ";
    console.log("restarting...");

    res.render("pages/hello", {
      name: req.body.name,
      date: new Date(),
      data: {
        grid: app.grid,
        winner: ""
      }
    });
  });

app.post("/play", function(req, res) {

  var check_winner = function (grid) {
    winner = "";

    // winning with 0
    if (grid[0] === "X" || grid[0] === "O") {
      if ((grid[0] === grid[1] && grid[1] === grid[2]) || (grid[0] === grid[3] && grid[3] === grid[6])) {
        winner = grid[0];
      }
    }

    // winning with 4
    if (grid[4] === "X" || grid[4] === "O") {
      if ((grid[0] === grid[4] && grid[4] === grid[8]) || (grid[1] === grid[4] && grid[4] === grid[7]) || (grid[2] === grid[4] && grid[4] === grid[6]) || (grid[3] === grid[4] && grid[4] === grid[5])) {
        winner = grid[4];
      }
    }

    // winning with 8
    if (grid[8] === "X" || grid[8] === "O") {
      if ((grid[2] === grid[5] && grid[5] === grid[8]) || (grid[6] === grid[7] && grid[7] === grid[8])) {
        winner = grid[8];
      }
    }

    if (winner === "X" || winner === "O") {
      console.log(winner + " Won");
      app.grid = [" ", " ", " ", " ", "", " ", " ", " ", " "];
    }

    return winner;
  }

  // accept user move
  app.grid = req.body.grid;
  console.log("body grid", app.grid)
  app.winner = req.body.winner || "";
  console.log(app.grid);

  if(app.winner) {
    console.log(app.winner + " Won!")
    app.grid = [" ", " ", " ", " ", "", " ", " ", " ", " "];
  }

  move = -1;
  canMove = false;

  for (var i=0; i < app.grid.length; i++) {
    if (app.grid[i] !== "X" && app.grid[i] !== "O") {
      canMove = true;
    }
  }

  
  if (app.winner !== "X" && app.winner !== "O" && canMove) {
    // computer makes a random move
    placing_move = true;
    while (placing_move) {
      let rand = Math.floor(Math.random() * 9);
      if (app.grid[rand] !== "X" && app.grid[rand] !== "O") {
        app.grid[rand] = "O";
        console.log("Placing move at tile: ", rand);
        move = rand;
        placing_move = false;
      }
    }
  }

  var winner = check_winner(app.grid);

  data = {
    grid: app.grid,
    computer_move: move,
    winner: winner
  }

  // users turn again 
  res.send(data);

})


app.get("/ttt", (req, res) => res.render("pages/index"))
  .post("/ttt", function(req, res) {
    console.log(req.body);
    
    res.render("pages/hello", {
      name: req.body.name,
      date: new Date(),
      symbol: "O",
      data: {
        grid: ["", "", "", "", "", "", "", "", ""],
        winner: ""
      }
    });
  });
  

// app
//   .get("/ttt", (req, res) =>
//     res.sendFile(path.join(__dirname + "/front-page.html"))
//   )
//   .post("/ttt", function(req, res) {
//     name = req.body.name;
//     date = new Date();
//     console.log(name);
//     console.log(date);
//     res.sendFile(path.join(__dirname + "/hello.html"));
//   });
// .post("/ttt", (req, res) =>
//   res.sendFile(path.join(__dirname + "/hello.html"))
// );

app.listen(3000, () => console.log("Example app listening on port 3000!"));
