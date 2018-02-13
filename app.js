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

function count_array(arr, obj) {
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === obj) {
      count++;
    }
  }

  return count;
}

function smart_move(grid) {
    // Computer is O.
    var move;
    
    //  8 winning array 
    // slice is up to but not including

    var array_1 = [];
    var array_2 = [];
    var array_3 = [];
    var array_4 = [];
    var array_5 = [];
    var array_6 = [];
    var array_7 = [];
    var array_8 = [];
    // rows
    array_1.push(grid[0], grid[1], grid[2]);
    array_2.push(grid[3], grid[4], grid[5]);
    array_3.push(grid[6], grid[7], grid[8])

    // cols
    array_4.push(grid[0], grid[3], grid[6]);
    array_5.push(grid[1], grid[4], grid[7]);
    array_6.push(grid[2], grid[5], grid[8]);

    // diagon
    array_7.push(grid[0], grid[4], grid[8]);
    array_8.push(grid[2], grid[4], grid[6]);

    all_arrays = [];
    all_arrays.push(array_1);
    all_arrays.push(array_2);
    all_arrays.push(array_3);
    all_arrays.push(array_4);
    all_arrays.push(array_5);
    all_arrays.push(array_6);
    all_arrays.push(array_7);
    all_arrays.push(array_8);

    console.log("ALL: \n", all_arrays)

    // arr to block X from winning 
    var block_arr_num;
    var block_index;

    for (var i = 0; i < all_arrays.length; i++) {
      arr = all_arrays[i];
      if (count_array(arr, "X") > 1 && arr.indexOf(" ") != -1) {
        block_arr_num = i;
        block_index = arr.indexOf(" ");
        console.log("block_arr_num: ", block_arr_num);
        console.log("block_index: ", block_index);
        break;
      }
    }
    
    if (block_arr_num) {

      if (block_arr_num === 0) {
        move = block_index;
      } else if (block_arr_num === 1) {
        move = block_index + 3;
      } else if (block_arr_num === 2) {
        move = block_index + 6;
      } else if (block_arr_num === 3) {
        move = block_index * 3;
      } else if (block_arr_num === 4) {
        move = block_index * 3 + 1;
      } else if (block_arr_num === 5) {
        move = block_index * 3 + 2;
      } else if (block_arr_num === 6) {
        move = block_index * 4;
      } else if (block_arr_num === 7) {
        move = (block_index + 1) * 2;
      }

      console.log("Move: ", move)

    } else {
      // random
      console.log("RANDOM MOVE!")
      placing_move = true;
      while (placing_move) {
        // RANDOM
        let rand = Math.floor(Math.random() * 9);
        if (app.grid[rand] !== "X" && app.grid[rand] !== "O") {
          // app.grid[rand] = "O";
          move = rand;
          placing_move = false;
        }
      }
    }

    console.log("returning move:", move)

    return move;

}

app.post("/play", function(req, res) {
  
  // accept user move
  app.grid = req.body.grid;

  // make sure empty space
  for (var i = 0; i < app.grid.length; i++) {
    if(app.grid[i] !== "O" && app.grid[i] !== "X") {
      app.grid[i] = " ";
    }
  }

  console.log("\n\t ****** REQUEST ****** \n\n\t", app.grid);

  let winner = check_winner(app.grid);
  let tie = false;

  if (winner !== "O" && winner !== "X") {
    canMove = false;

    for (var i = 0; i < app.grid.length; i++) {
      if (app.grid[i] !== "X" && app.grid[i] !== "O") {
        canMove = true;
      }
    }
    // place a move
    if (canMove) {
      // computer makes a random move
      var best_move = smart_move(app.grid);
      app.grid[best_move] = "O";

    } else {
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
    // app.grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  } else if (winner === "X" || winner === "O") {
    // app.grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
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
