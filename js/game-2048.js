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
  this.boardHasChanged = false; //Boolean to check if the boardHasChanged (due to a merge and/or shift)

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
//Only need one loop to render the array in the console because each row is an array so log(array) lists it in console
Game2048.prototype._renderBoard = function () {

  this.board.forEach(function(row) {
    console.log(row);
   });

   //Log to see the current runnning score.
   console.log('Current score: ' + this.score);
};

// Function for move left
// Easiest way is to recreate the array.
// if tiles have the same value, FIRST: the tiles will merge (add), SECOND: then move as far left as possible... nulls will be pushed in the empty spaces that are created
//Behind the scenes the previous board is discarded and a new one is created based on move.
Game2048.prototype.moveLeft = function (){

  var updatedBoard = [];

  //Done because as soon as you call 'this' from an anonymous function, the context of this changes and when you are checking the boardHasChanged, it refers to wrong version of board.
  var theGame = this;

  this.board.forEach(function(row){
    //At end, new row will only be numbers that are in that row
    var newRow=[];
    // 1. Remove empties from row
    // --> For each row, scan coloumns
    //at the end you will get 4 new rows that are based on state of row before move.
    row.forEach(function(cell){

      //This will give the new row with everything shifted left.
      if (cell !== null){
        newRow.push(cell);
      }
    });
    // 2. Merge tiles in row that are together and the same numbers
    // --> Loop through new row (now reflecting everythind shifted left) ( meaning that rows of 4 can now be 3,)
    // --> If the current col (i) is the same as the one next to it (i+1), add (really multiply times 2) the numbers and set (i+1) to null
    //--> note: This step an result in a empty space in the middle of two numbers
    for (var i = 0; i < newRow.length; i++){
      if (newRow[i] === newRow[i + 1]){
        newRow[i] *=2;
        newRow[i + 1] = null;

        //Score is updated each time a merge happems
        theGame._upDateScore(newRow[i]);
      }
    }

    //3. Remove new empties that could have been created by merege
    //Check for nulls again. Repeat step 1.
    // e.g. when [8, 8, 4] results in [16, null, 4]
    // we want to end up with [16,4].
    // note: A new array is created (moved) just like in step 1
    var moved = [];
    newRow.forEach(function(cell){
      if (cell !== null){
      moved.push(cell);
      }
    });


    //This checks for a merge and/shift.
    //Note: it is 'theGame' not 'this' because of stated above. *See theGame declaration.
    if (moved.length !== row.lentgth){
      theGame.boardHasChanged = true;
    }

    // 4. push() nulls until row has length of 4 again.
    while (moved.length < 4){
      moved.push(null);
    }


    //Pushing new row to udapted board
    //At end of loop, updatedBoard will have rows with new rows after move
    updatedBoard.push(moved);

  });

  //Assign new updated board to board of game.
  this.board = updatedBoard;
};

// Function for move Right
// Easiest way is to recreate the array.
// if tiles have the same value, FIRST: the tiles will merge (add), SECOND: then move as far right as possible... nulls will be pushed in the empty spaces that are created
//Behind the scenes the previous board is discarded and a new one is created based on move.
Game2048.prototype.moveRight = function (){

  var updatedBoard = [];

  //Done because as soon as you call 'this' from an anonymous function, the context of this changes and when you are checking the boardHasChanged.
  //note: 'this' inside of the anonymous function does not have a variable boardHasChanged, board wouldbe referring to board which is a property itself, not the object the game.
  var theGame = this;

  this.board.forEach(function(row){
    //At end, new row will only be numbers that are in that row
    var newRow=[];
    // 1. Remove empties from row
    // --> For each row, scan coloumns
    //at the end you will get 4 new rows that are based on state of row before move.
    row.forEach(function(cell){

      //This will give the new row with everything shifted right.
      if (cell !== null){
        newRow.push(cell);
      }
    });
    // 2. Merge tiles in row that are together and the same numbers
    // --> Reverse Loop through new row (now reflecting everythind shifted right) ( meaning that rows of 4 can now be 3,)
    // --> If the current col (i) is the same as the one next to it (i-1), add (really multiply times 2) the numbers and set (i+1) to null
    //--> note: This step an result in a empty space in the middle of two numbers
    //--> note: since we are moving right and testing numbers next to it, direction is revered (instead of i+1, it is i-1)
    for (var i = newRow.length - 1; i >= 0; i--){
      if (newRow[i] === newRow[i - 1]){
        newRow[i] *=2;
        newRow[i - 1] = null;

        //Score is updated each time a merge happens
        theGame._upDateScore(newRow[i]);
      }
    }

    //3. Remove new empties that could have been created by merege
    //Check for nulls again. Repeat step 1.
    // e.g. when [8, 8, 4] results in [16, null, 4]
    // we want to end up with [16,4].
    // note: A new array is created (moved) just like in step 1
    var moved = [];
    newRow.forEach(function(cell){
      if (cell !== null){
      moved.push(cell);
      }
    });

    //This checks for a merge and/shift.
    //Note: it is 'theGame' not 'this' because of stated above. *See theGame declaration.
    if (moved.length !== row.lentgth){
      theGame.boardHasChanged = true;
    }


    // 4. unshift() (insert at beginning) nulls until row has length of 4 again.
    //note: it changes from a push() (inserting nulls at end when moving left) to unshift() (inserting nulls at begining when moving right)
    while (moved.length < 4){
      moved.unshift(null);
    }


    //Pushing new row to udapted board
    //At end of loop, updatedBoard will have rows with new rows after move
    updatedBoard.push(moved);

  });

  //Assign new updated board to board of game.
  this.board = updatedBoard;
};



// Function to transpose a matrix
///1.Flip on Y axis
//2. Turn 90 degrees counter clockwise.
Game2048.prototype._transposeMatrix = function () {
  for (var row = 0; row < this.board.length; row++) {
    for (var column = row+1; column < this.board.length; column++) {
      var temp = this.board[row][column];
      this.board[row][column] = this.board[column][row];
      this.board[column][row] = temp;
    }
  }
};


//Function to move up on the 2D array
//Achieved by doing transposal.
Game2048.prototype.moveUp = function () {
  this._transposeMatrix();
  this.moveLeft();
  this._transposeMatrix(); // Important to transpose again to restore to original orientation
};

//Function to move down on the 2D array
//Achieved by doing transposal.
Game2048.prototype.moveDown = function () {
  this._transposeMatrix();
  this.moveRight();
  this._transposeMatrix(); // Important to transpose again to restore to original orientation
};


Game2048.prototype.move = function (direction) {

  //Early return to break the function.
  //Checks if the game has been won or lost.
  //hasWon has to be true or hasLost has to be true.
  if (this.hasWon || this.hasLost) {
    return;
  }
    switch (direction) {
      case "up":
        this.moveUp();
        break;
      case "down":
        this.moveDown();
        break;
      case "left":
        this.moveLeft();
        break;
      case "right":
       this.moveRight();
       break;
    }

    //So when you make a movement, it adds a tile given there is a merge or shift in the array.
    //note: boardHasChanged will be when ever there us a move in either direction.
    ////// really just moving right and left because of transposal :)
    if (this.boardHasChanged){
      this._generateTile();
      //check to see if game is lost.
      this._isGameLost();
      this.boardHasChanged = false;
    }

};

//Keep track of merges.]
//Fired off each time there is a merge of tiles ]
// *hint: Look in the for loop in moveLeft and moveRight.
Game2048.prototype._upDateScore = function (points) {
  this.score += points;

  //Conditions
  if (points === 2048 ){
    this.hasWon = true;
  }
};

//Scan possibilities (by scanning whole board by brute force) and see if there are any nulls or merge possibilities
Game2048.prototype._isGameLost = function () {

  //Meaning, if there is a position available to insert a tile
  //early return.
  if (this._getAvailablePosition() !== null){
    return;
  }

  //See explanation for theGame variable in moveLeft and moveRight functions.
  var theGame = this;

  //We've already done this in _getAvailablePosition
  ////Moves row by row
  //Note: Goes through the cells and checks the cells around them to see if there is a merge move.
  /////// We have already screen for nulls with if statement above
  this.board.forEach(function(row, rowIndex){
    //Moves col by col for each row
    row.forEach(function(cell, colIndex){

      var current = theGame.board[rowIndex][cellIndex];
      var top, bottom, left, right;

      if (theGame.board[rowIndex][cellIndex - 1]) {
        left  = theGame.board[rowIndex][cellIndex - 1];
      }
      if (theGame.board[rowIndex][cellIndex + 1]) {
        right = theGame.board[rowIndex][cellIndex + 1];
      }
      if (theGame.board[rowIndex - 1]) {
        top    = theGame.board[rowIndex - 1][cellIndex];
      }
      if (theGame.board[rowIndex + 1]) {
        bottom = theGame.board[rowIndex + 1][cellIndex];
      }

      if (current === top || current === bottom || current === left || current === right)
      theGame.hasLost = false;

    });
  });
};



// Easter win to win. ^ ([][][][][]) ^
// Game2048.prototype.______shhhhhh = function(){
//   this.hasWon = true;
// };


//New instance of game created upon start of game
danielsGame = new Game2048();

// danielsGame._renderBoard();
//
// danielsGame.moveLeft();
//
// danielsGame.moveRight();
//
// danielsGame._renderBoard();
