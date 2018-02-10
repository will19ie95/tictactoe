$(document).ready(function() {

  function get_curr_grid () {
        var curr_grid = [];

        $(".tile").each(function() {
          var self = $(this);
          curr_grid.push(self.text());
        });
        return curr_grid;
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

      $.ajax({
        url: "/play",
        type: "post",
        dataType: "json",
        data: {
          grid: grid
        },
        success: function(data) {
          // place computer move front-end
          computer_move = data.computer_move;
          grid = data.grid;

          $("#" + computer_move).html("O");
          $("#" + computer_move).removeClass("tile-");
          $("#" + computer_move).addClass("tile-O");
          $("#" + computer_move).unbind("click");

          winner = data.winner;

          if (winner) {
            // winner found
            $("#alert-winner").html(winner + " Won!");
            $("#alert-winner").css("display", "block");
            // disconnect ui
            $(".tile").unbind("click");
          }
        }
      });


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

    })

    toggle_tile();

    $("#alert-winner").css("display", "none");

    $.ajax({
      url: "/",
      type: "get",
      dataType: "html"
    });
  });

  toggle_tile();
  

})