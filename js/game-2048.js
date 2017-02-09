// console.log('Good to go!'  test connection

//constructor

//name parameter for unique games
function Game2048(name){
  this.score = 0; //Because all games start at 0, so it will be hard coded, not passed as a parameter

  //Board is created dynamically. Starts empty.. 4x4 array
  this.board = [
    [null, null, null, null], //row 0 = > col 0, col 1, col 2, col 3
    [null, null, null, null], //row 1 = > col 0, col 1, col 2, col 3
    [null, null, null, null], //row 2 = > col 0, col 1, col 2, col 3
    [null, null, null, null]  //row 3 = > col 0, col 1, col 2, col 3
  ];

  this.hasWon = false;    //Boolean to check if game has been won. //
  this.hasLost = false;   //Boolean to check if game has been lost. //is checked on each move

  this._generateTile();
  this._generateTile();
}
//randomly generate two numbers (2 or 4) and assign 2 0r 4 to that position
//private because we dont want player to interact with it.
Game2048.prototype._generateTile = function(){

  //to hold the value (2 or 4) that will be randomly generated
  var tileValue;


  //80/20 chance
  //If the random is below the 80% chance, value equals 2
  // else 20 % of the time, value equals 4
  //will be done twice
  if(Math.random() < 0.8){
      tileValue = 2;
  }
  else{
      tileValue = 4;
  }

  //Gets available tiles through getAvailableTiles method.
  // Think: In My game (this), get Available Tile Position'
  var emptyTile = this._getAvailablePosition();

  //If the emptyTile did not return null (meaning is the there are still available tiles to work with)
  if (emptyTile !== null){
    //Row is qual to the x coordinate of the emptyTile in the array
    //Col is equal to the y coordinte of the emptyTile in the array.
    var row = emptyTile.x;
    var col = emptyTile.y;

    //Random value is now assigned to that position in the board (found using the emptyTile properties of x and y)
    this.board[row][col] = tileValue;
  }

};

//Method to figure out empty positions
//Go through array and create new array with empty positions
// At end of loop,
Game2048.prototype._getAvailablePosition = function(){

  //Array to hold the empty tiles.
  var emptyTiles = [];

  //At end of loop, emptyTiles will have all the empty tiles.

  //Moves row by row
  this.board.forEach(function(row, rowIndex){
    //Moves col by col for each row
    row.forEach(function(cell, colIndex){
      //for each empty position, store position in empty ties array
      if (cell === null){
        //Push into empty array
        //x (row index) and y (col index) coordinates
        emptyTiles.push({x: rowIndex, y: colIndex});
      }


    });
  });

  // Will retun a random empty position (calculated above), or return null (because there are no more empty poistions)
  if (emptyTiles.length === 0){
    return null;
  }

  //Generates a random index to be used to select a tile from the empty tiles array.
  var ramdomIndex = Math.floor(Math.random()*emptyTiles.length);  //Not + 1 because the length is one more than valid indexes of the array.

  //return a random tile from the empty tiles array.
  return emptyTiles[ramdomIndex];

};

//Renders the board in the console
Game2048.prototype._renderBoard = function () {
  this.board.forEach(function(row){ console.log(row);
   });
};


danielsGame = new Game2048();
