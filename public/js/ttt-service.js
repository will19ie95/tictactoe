const http = require('http');

// function get_grid() {
//   http.get
// }

function set_curr_grid(grid) {
  // console.log("display grid", grid);

  for (var i = 0; i < 9; i++) {
    var li = $("#" + i);

    li.html(grid[i]);

    if (grid[i] === "O") {
      li.unbind("click");
      li.removeClass("tile-");
      li.addClass("tile-O");
    } else if (grid[i] === "X") {
      li.unbind("click");
      li.removeClass("tile-");
      li.addClass("tile-X");
    }
  }
}

function show_winner(winner) {
  // winner found
  $("#alert-winner").html(winner + " Won!");
  $("#alert-winner").css("display", "block");
}

function disable_tile() {
  $(".tile").unbind("click");
}

function play(grid) {
  $.ajax({
    url: "/play",
    type: "post",
    dataType: "json",
    data: {
      grid: grid
    },
    success: function(data) {
      // place computer move front-end
      var grid = data.grid;
      var winner = data.winner;

      console.log("winner: ", winner);
      // console.log("is undef: ", winner === undefined)

      set_curr_grid(grid);

      var tie = winner === " ";

      //check for winner
      if (winner === "X" || winner === "O") {
        show_winner(winner);
        // disable ui
        disable_tile();
      } else if (tie) {
        show_winner("NO ONE");
        disable_tile();
      }
    }
  });
}

function toggle_tile() {
  $(".tile-").click(function() {
    let tile_id = $(this).attr("id");

    // place move front-end
    let grid = get_curr_grid();
    grid[tile_id] = "X";
    $("#" + tile_id).html("X");
    $("#" + tile_id)
      .removeClass("tile-")
      .addClass("tile-X");
    $("#" + tile_id).unbind("click");

    play(grid);
  });
}

function restart() {
  var emptyGrid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  $(".tile-X")
    .html("")
    .addClass("tile-");
  $(".tile-O")
    .html("")
    .addClass("tile-");

  $(".tile").each(function() {
    $(this).removeClass("tile-O");
    $(this).removeClass("tile-X");
    $(this).unbind("click");
  });

  toggle_tile();

  $("#alert-winner").css("display", "none");

  $.ajax({ url: "/", type: "get", dataType: "html" });
}

$(document).ready(function() {
  toggle_tile();
});
