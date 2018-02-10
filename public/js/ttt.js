$(document).ready(function() {

  function get_curr_grid () {
        var curr_grid = [];

        $(".tile").each(function() {
          var self = $(this);
          // console.log(self.text());
          curr_grid.push(self.text());
        });
        return curr_grid;
  }

  function check_winner(grid) {
    // console.log("checking winning for: ", grid)

    winner = "";

    // winning with 0 
    if (grid[0] === "X" || grid[0] === "O") {
      if ((grid[0] === grid[1] && grid[1] === grid[2]) ||
          (grid[0] === grid[3] && grid[3] === grid[6])) {
          winner = grid[0]
      }
    }

    // winning with 4 
    if (grid[4] === "X" || grid[4] === "O") {
      if ((grid[0] === grid[4] && grid[4] === grid[8]) ||
          (grid[1] === grid[4] && grid[4] === grid[7]) ||
          (grid[2] === grid[4] && grid[4] === grid[6]) ||
          (grid[3] === grid[4] && grid[4] === grid[5])) {
          winner = grid[4]
      }
    }

    // winning with 8 
    if (grid[8] === "X" || grid[8] === "O") {
      if ((grid[2] === grid[5] && grid[5] === grid[8]) ||
          (grid[6] === grid[7] && grid[7] === grid[8])) {
          winner = grid[8]
      }
    }

    if (winner === "X" || winner === "O") {
        // console.log(winner + " Won");
        $("#alert-winner").html(winner + " Won!");
        $("#alert-winner").css("display", "block");
        // disconnect ui
        $(".tile").unbind("click");
        return winner;
    }

    return winner;
  }

  function toggle_tile() {
    $(".tile-").click(function() {
      let tile_id = $(this).attr("id");
      console.log("Clicked tile: ", tile_id);

      // place move front-end
      let grid = get_curr_grid();

      grid[tile_id] = "X";
      // fill in X for user move
      $("#" + tile_id).html("X");
      // remove free tile css class, relace with taken X
      $("#" + tile_id)
        .removeClass("tile-")
        .addClass("tile-X");
      // unbind click event
      $("#" + tile_id).unbind("click");

      console.log("Current Grid: ", grid);

      // check for winner !!!
      winner = check_winner(grid);

      if (winner) {
        // Won
        $.ajax({
          url: "/play",
          type: "post",
          dataType: "json",
          data: {
            grid: grid,
            winner: winner
          }
        });
      } else {
        // ask computer move back-end
        $.ajax({
          url: "/play",
          type: "post",
          dataType: "json",
          data: {
            grid: grid,
            winner: winner
          },
          success: function(data) {
            // place computer move front-end
            computer_move = data.computer_move;
            grid = data.grid;

            $("#" + computer_move).html("O");
            $("#" + computer_move)
              .removeClass("tile-")
              .addClass("tile-O");
            $("#" + computer_move).unbind("click");

            winner = data.winner;

            if (winner) {
              // winner found
              // console.log(winner + " Won!");
              $("#alert-winner").html(winner + " Won!");
              $("#alert-winner").css("display", "block");
              // disconnect ui
              $(".tile").unbind("click");
            }
          }
        });
      }
    });
  }

  $("#restart-btn").click(function() {
    var emptyGrid = ["", "", "", "", "", "", "", "", ""];
    $(".tile-X").html("").addClass("tile-");
    $(".tile-O").html("").addClass("tile-");

    $(".tile").each(function() {
      $(this).removeClass("tile-O");
      $(this).removeClass("tile-X");
      $(this).unbind("click");

      // console.log($(this).hasClass(".tile-X"))
    })

    toggle_tile();

    $("#alert-winner").css("display", "none");
    // console.log("toggled tiles")

    $.ajax({
      url: "/",
      type: "post",
      dataType: "json",
      data: {
        grid: emptyGrid,
        winner: ""
      },
      success: function(data) {
        
        grid = data.grid;
        winner = data.winner;

      }
    });
  });

  toggle_tile();
  

})
