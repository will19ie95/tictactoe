const count_array = function(arr, obj) {
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === obj) {
      count++;
    }
  }
  return count;
};

// return winner or Null
const check_winner = function(grid) {
  var winner = " ";
  if (grid[0] === "X" || grid[0] === "O") {
    // winning with 0
    if (
      (grid[0] === grid[1] && grid[1] === grid[2]) ||
      (grid[0] === grid[3] && grid[3] === grid[6])
    ) {
      winner = grid[0];
      return winner;
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
      return winner;
    }
  }
  if (grid[8] === "X" || grid[8] === "O") {
    // winning with 8
    if (
      (grid[2] === grid[5] && grid[5] === grid[8]) ||
      (grid[6] === grid[7] && grid[7] === grid[8])
    ) {
      winner = grid[8];
      return winner;
    }
  }

  for (var i = 0; i < grid.length; i++) {
    if (grid[i] === " ") {
      // returning null for no winner
      return null;
    }
  }

  // return winner or " " if tie
  return " ";
};

const smart_move = function(grid) {
  let temp_grid = grid;

  var move;
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
  array_3.push(grid[6], grid[7], grid[8]);

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

  // arr to block X from winning
  var block_arr_num;
  var block_index;

  for (var i = 0; i < all_arrays.length; i++) {
    arr = all_arrays[i];
    if (count_array(arr, "X") > 1 && arr.indexOf(" ") != -1) {
      block_arr_num = i;
      block_index = arr.indexOf(" ");
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
  } else {
    // random
    placing_move = true;
    while (placing_move) {
      // RANDOM
      let rand = Math.floor(Math.random() * 9);
      if (temp_grid[rand] !== "X" && temp_grid[rand] !== "O") {
        move = rand;
        placing_move = false;
      }
    }
  }
  return move;
};

const can_win = function(grid) {
  var win_move = -1;
  for (var i = 0; i < grid.length; i++) {
    if (grid[i] !== "X" && grid[i] !== "O") {
      grid[i] = "O";
      if (check_winner(grid) !== " ") {
        win_move = i;
        return win_move;
      } else {
        grid[i] = " ";
      }
    }
  }
  return win_move;
};

module.exports = {
  count_array: count_array,
  check_winner: check_winner,
  smart_move: smart_move,
  can_win: can_win
};
