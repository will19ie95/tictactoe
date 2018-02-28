const ttt = require("./play_func.js");
const express = require("express");
const router = express.Router();

router.post("/", function(req, res) {
  // accept user move'
  grid = req.body.grid;

  let winner = ttt.check_winner(grid);
  let tie = false;

  if (winner !== "O" && winner !== "X") {
    canMove = false;

    for (var i = 0; i < grid.length; i++) {
      if (grid[i] !== "X" && grid[i] !== "O") {
        canMove = true;
      }
    }
    // place a move
    if (canMove) {
      // try to win
      var win_move = ttt.can_win(grid);
      if (win_move !== -1) {
        grid[win_move] = "O";
      } else {
        // computer makes a random move
        var best_move = ttt.smart_move(grid);
        grid[best_move] = "O";
      }
    } else {
      tie = true;
    }
  }

  winner = ttt.check_winner(grid);

  send_grid = grid.slice();

  if (tie === true) {
    winner = " ";
    // grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  } else if (winner === "X" || winner === "O") {
    // grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  } else {
    winner = undefined;
  }

  data = {
    grid: send_grid,
    winner: winner
  };

  // users turn again
  res.json(data);
});

module.exports = router;
