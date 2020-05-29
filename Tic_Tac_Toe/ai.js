// Here are the tools to use to build your AI:

// The aiSelect() function is called by the game when it is the AI's turn to make a move.
// This function should return which square to play to, 0-8.

function aiCheckWin(direction, target) {
  let pathResult;
  let headerCell;
  let comparisonCell;
  if (direction == "diagonal") {
    for (let i = -1; i <= 1; i = i + 2) {
      let yCoord = (gridSize - 1) / 2 * (1 + i);
      headerCell = target[yCoord][0];
      if (headerCell != "") {
        pathResult = true;
        for (let j = 1; j < gridSize; j++) {
          let compY = yCoord + j * -i;
          comparisonCell = target[compY][j];
          if (comparisonCell != headerCell) {
            pathResult = false;
          }
        }
        if (pathResult == true) {
          return headerCell;
        }
      }
    }
  } else {
    for (let i = 0; i < gridSize; i++) {
      if (direction == "vertical") {
        headerCell = target[0][i];
      } else if (direction == "horizontal") {
        headerCell = target[i][0];
      }
      if (headerCell != "") {
        pathResult = true;
        for (let j = 1; j < gridSize; j++) {
          if (direction == "vertical") {
            comparisonCell = target[j][i];
          } else if (direction == "horizontal") {
            comparisonCell = target[i][j];
          }
          if (comparisonCell != headerCell) {
            pathResult = false;
          }
        }
        if (pathResult == true) {
          return headerCell;
        }
      }
    }
  }
  return "";
}

function aiCheckWins(target) {
  let winResults = [aiCheckWin("horizontal", target), aiCheckWin("vertical",target), aiCheckWin("diagonal",target)];

  let reducer = function (total, num) {
    if( num === '' && total === '') {
        return '';
    } else if (total === '') {
        return num;
    } else {
        return total;
    }
  }

  return winResults.reduce(reducer);
}


function randomAI(){
  return random(getAvailableCells());
}

function aiSelect(player){
  if (player == "X"){
    var opponent = "O";
  } else {
    var opponent = "X";
  }
  var currentBoard = getBoard();
  var currentAvailableCells = getAvailableCells();
  var potentialMoves = [];

  for(let i = 0; i < currentAvailableCells.length; i++){
    let aiMoveCell = currentAvailableCells[i];
    let tempBoard = JSON.parse(JSON.stringify(currentBoard));
    tempBoard[aiMoveCell[1]][aiMoveCell[0]] = "X";
    let aiMoveResult = aiCheckWins(tempBoard);
    if (aiMoveResult == ""){
      let opponetMoveCells = currentAvailableCells.filter(function(cell){
        return (JSON.stringify(cell) !== JSON.stringify(aiMoveCell));
      });
      for(let j = 0; j < opponetMoveCells.length; j++){
        let opponentMoveCell = opponetMoveCells[j];
        let forecastBoard = JSON.parse(JSON.stringify(tempBoard));
        forecastBoard[opponentMoveCell[1]][opponentMoveCell[0]] = opponent;
        let opponentMoveResult = aiCheckWins(forecastBoard);
        if (opponentMoveResult == ""){
          let endIndex = getGridSize() - 1;
          for (let k = -1; k <= 1; k = k + 2) {
            let xCoord = (endIndex) / 2 * (1 + k);
            for (let l = -1; l <= 1; l = l + 2) {
              let yCoord = (endIndex) / 2 * (1 + l);
              if (tempBoard[yCoord][xCoord] == player){
                if (aiMoveCell == [(endIndex) / 2 * (1 - k), (endIndex) / 2 * (1 - l)]){
                potentialMoves.push([1, aiMoveCell]);
                }
              }
            }
          }
          if ((aiMoveCell[0] == 0 || aiMoveCell[0] == endIndex) && (aiMoveCell[1] == 0 || aiMoveCell[1] == endIndex)){
            potentialMoves.push([2, aiMoveCell]);
          }else{
            potentialMoves.push([3, aiMoveCell]);
          }
          
        } else {
          potentialMoves.push([0, opponentMoveCell]);
          
        }
      }
    } else {
      potentialMoves.push([-1, aiMoveCell]);
    }
  }

  var decisionArray = potentialMoves.sort(function(a, b){
    if (a[0] < b[0]){
      return -1;
    } else if (a[0] > b[0]){
      return 1;
    } else{
      return 0;
    }
  });
  if (decisionArray[0]== null){
    decisionArray.push([6, getAvailableCells()[0]]);
  }
  return decisionArray[0][1];
}
