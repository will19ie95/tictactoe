const express = require("express");
const router = express.Router();
const db = require("../db.js")
const ttt = require("./play_func.js");
const User = require("../models/user");

exports.ttt = function (req, res) {
  res.render("ttt", {
    name: req.user.username,
    date: Date.now()
  })
}

exports.home = function(req, res) {
  // check if user logged in
  if (req.user) {
    res.locals.name = req.user.username;
    res.locals.date = Date.now()
    res.locals.data = {
      grid: req.user.ttt.grid
    }
    res.locals.winner = req.user.winner
    res.render("ttt", {
      name: req.user.username,
      date: new Date()
    });
  } else {
    res.redirect("/login")
  }
}

exports.listGames = function (req, res) {
  // get current grid from mongo
  // console.log("USER:", req.user)
  User.findOne({"_id": req.user._id}, function(err, user) {
    if (err) { res.json({ "Status": "Error" }) }
    res.json({
      status: "OK",
      games: user.history
    })
  })
}

exports.getGame = function (req, res) {
  id = req.body.id
  User.findOne({ "_id": req.user._id }, function (err, user) {
    if (err) { res.json({ "Status": "Error" }) }
    if (user.history[id-1]) {
      // game found
      game = user.history[id-1]
      res.json({
        status: "OK",
        grid: game.grid,
        winner: game.winner
      })
    } else {
      // game not found
      res.json({
        status: "ERROR"
      })
    }
    
  })
}

exports.getScore = function(req, res) {
  User.findOne({ "_id": req.user._id }, function (err, user) {
    if (err) { res.json({ "Status": "Error" }) }
    res.json({
      status: "OK",
      human: user.score.human,
      wopr: user.score.wopr,
      tie: user.score.tie
    })
  })
}

exports.play = function (req, res) {
  user_move = req.body.move

  // return current grid if null.
  if (user_move === null) {
    
    User.findOne({ "_id": req.user._id }, function(err, user) {
      if (err) { res.json({ "Status": "Error" }) }
      res.json({
        "grid": user.getGrid()
      })
    })

  } else {

    // make move to db
    newGrid = req.user.getGrid();
    if(newGrid[user_move] !== " ") {
      return res.json({ "Status": "Error" })
    }
    newGrid[user_move] = "X"

    // checkWinner
    let winner = ttt.check_winner(newGrid);
    console.log("Winner: ", winner)
    if (winner) {
      // winner is found, track and reset
      history_game = req.user.ttt
      history_game.grid = newGrid
      history_game.winner = winner

      winGrid = newGrid;
      emptyGrid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
      emptyWinner = "";

      query = {'_id' : req.user._id}
      update = {
        $push: {
          history: history_game
        }
      }

      // reset db
      User.findOneAndUpdate(query, update, function (err, user) {
        if (err) { res.json({ "Status": "Error" }) }

        // update score
        user.updateScore(winner);
        user.resetGrid();
        user.save(function (err, user) {
          if (err) { res.json({ "Status": "Error" }) }
          // console.log("User Updated.", user)
          res.json({
            "grid": winGrid,
            "winner": winner
          })
        })
      })
    } else {
      // no winner yet, so make a move
      // try to win
      var win_move = ttt.can_win(newGrid);
      if (win_move !== -1) {
        newGrid[win_move] = "O";
      } else {
        // computer makes a random move
        var best_move = ttt.smart_move(newGrid);
        newGrid[best_move] = "O";
      }

      let winner = ttt.check_winner(newGrid);
      if (winner) {
        // winner is found, track and reset
        winGrid = newGrid;
        emptyGrid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        emptyWinner = "";

        history_game = req.user.ttt
        history_game.grid = newGrid
        history_game.winner = winner

        query = { '_id': req.user._id }
        update = {
          $push: {
            history: history_game
          }
        }

        // reset db
        User.findOneAndUpdate(query, update, function (err, user) {
          if (err) { res.json({ "Status": "Error" }) }
          user.ttt.grid = emptyGrid;
          user.ttt.winner = emptyWinner;
          user.updateScore(winner);

          user.save(function (err, user) {
            if (err) { res.json({ "Status": "Error" }) }
            // console.log("User Updated.", user)
            res.json({
              "grid": winGrid,
              "winner": winner
            })
          })
        })
      } else {
        User.findById(req.user._id, function (err, user) {
          if (err) { res.json({ "Status": "Error" }) }
          user.ttt.grid = newGrid;
          user.save(function (err, user) {
            if (err) { res.json({ "Status": "Error" }) }
            // console.log("User Updated.", user)
            res.json({
              "grid": newGrid
            })
          })
        })
      }
    }

  }
}

