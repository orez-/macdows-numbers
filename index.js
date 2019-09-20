import init, { Board, Player, MoveState } from "./pkg/macdows_numbers.js";

async function run() {
  let { memory } = await init();

  const board = Board.new();

  const leftPicker = document.getElementById("left");
  const rightPicker = document.getElementById("right");
  let leftValue = board.left_num();
  let rightValue = board.right_num();
  leftPicker.value = leftValue;
  rightPicker.value = rightValue;
  console.log(leftValue, rightValue);

  function getPlayerClass(player) {
    if (player == Player.Red) {
      return "red"
    }
    return "blue"
  }

  function playAnimation(element, animation) {
    element.classList.remove(animation);
    void element.offsetWidth;  // trigger reflow
    element.classList.add(animation);
  }

  leftPicker.addEventListener("change", event => {
    let cellClass = getPlayerClass(board.player_turn());
    let result = board.set_left(event.target.value);
    if (result.state == MoveState.Success) {
      document.getElementById("cell" + result.index).classList.add(cellClass);
      leftValue = event.target.value;
    }
    else if (result.state == MoveState.Invalid) {
      playAnimation(document.getElementById("cell" + result.index), 'reject');
      event.target.value = leftValue;
    }
    else if (result.state == MoveState.RowWin) {
      document.getElementById("cell" + result.index).classList.add(cellClass);
      leftValue = event.target.value;
      playAnimation(document.getElementById("cell" + result.win0), 'win');
      playAnimation(document.getElementById("cell" + result.win1), 'win');
      playAnimation(document.getElementById("cell" + result.win2), 'win');
      playAnimation(document.getElementById("cell" + result.win3), 'win');
    }
    else if (result.state == MoveState.GameOver) {
      event.target.value = leftValue;
    }
  });

  rightPicker.addEventListener("change", event => {
    let cellClass = getPlayerClass(board.player_turn());
    let result = board.set_right(event.target.value);
    if (result.state == MoveState.Success) {
      document.getElementById("cell" + result.index).classList.add(cellClass);
      rightValue = event.target.value;
    }
    else if (result.state == MoveState.Invalid) {
      playAnimation(document.getElementById("cell" + result.index), 'reject');
      event.target.value = rightValue;
    }
    else if (result.state == MoveState.RowWin) {
      document.getElementById("cell" + result.index).classList.add(cellClass);
      rightValue = event.target.value;
      playAnimation(document.getElementById("cell" + result.win0), 'win');
      playAnimation(document.getElementById("cell" + result.win1), 'win');
      playAnimation(document.getElementById("cell" + result.win2), 'win');
      playAnimation(document.getElementById("cell" + result.win3), 'win');
    }
    else if (result.state == MoveState.GameOver) {
      event.target.value = rightValue;
    }
  });
}

run();
