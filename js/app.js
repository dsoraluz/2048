console.log("Good to go!");

//Purpose of app js is to make bridge between logic (game-2048.js) and screen (index.html).
////Achieved through Jquery and/or DOM manipulation.


//1. Create game object
var myGlobalGame;

$(document).ready(function(){
  myGlobalGame = new Game2048(); //This is achieved because of our script tags in html (in case you're wondering about how the constructor is accessible without a clear connection)

  //2. Take the initial tiles and put them on the screen.
  renderTiles(); //render tiles on page load (document ready)


  //3. Handle keyboard events.
  $(document).keydown(moveGame);

  //ion sounds - call load sounds
  loadSounds();

});
  //Listener (event handler) that listens for keys pressed (left,up,right,down) or (w,a,s,d)
function moveGame(ev){
    var acceptableKeys = [37,65,38,87,39,68,40,83];

    //Escape preventing default behavior for all keys pressed.
    //we really want on wasd and up left down right to prevented
    if (!acceptableKeys.includes(ev.keyCode)){
        return;
    }
    //4. Move board in object based on key presses (up, down, left, right)
    //This piece of code prevents arrow scrolling (its default behavior)
    //prevent events default bavior (in this case the arrow scrolling)
    ev.preventDefault();

    switch (ev.keyCode) {
      case 37: //key code for left key
      case 65: //wasd (gamers) key code for 'a' key
        myGlobalGame.move('left');
        break;
      case 38: //key code for up key
      case 87: //wasd (gamers) key code for 'w' key
        myGlobalGame.move('up');
        break;
      case 39: //key code for right key
      case 68: //wasd (gamers) key code for 'd' key
        myGlobalGame.move('right');
        break;
      case 40: //key code for down key
      case 83: //wasd (gamers) key code for 's' key
        myGlobalGame.move('down');
        break;

    }

    //5. Updating screen based on new board state.
    //Needed to render new state after moves
    renderTiles();
    updateScore();

    //6. Win or lose (maybe)
    checkIfDone();
  }

  //Updates the score on the screen
  function updateScore(){
    $('#score-display').html(myGlobalGame.score);
  }

//Checks if the game has been won or lost.
//win - image
//lose - image and beer sound
function checkIfDone(){
  if (myGlobalGame.hasWon){
    $('#game-board').remove();
    var winnerHtml = '<img src="https://media.giphy.com/media/xTiTnz33weTH3K8Uvu/giphy.gif" alt="Winner">';
    $('body').append(winnerHtml);
  }
  else if (myGlobalGame.hasLost) {
    ion.sound.play('beer_can_opening'); // Sound when you have lost === Crack one open.
    $('#game-board').remove();
    var loserHtml = '<img src="https://media.giphy.com/media/l3q2K12v7LgvwlATC/giphy.gif" alt="Loser">';
    $('body').append(loserHtml);
  }

}



//Function goes through game board (internal) and creates all the divs for screen board.
function renderTiles(){
  //To clear html from tiles so that new values can be reflected in HTML and CSS
  //Needs to be emptied, filled, appended, then reset again.
  $('#tile-container').empty();

    myGlobalGame.board.forEach(function (row, rowIndex) {
      row.forEach(function (cell, colIndex){
        if(cell === null){
          return;
        }
        //Create a variable (tileHTML) for the html to be appended to the html via javascript (jquery)
        // e.g. of html to be altered with variables.
        //// <div class="tile tile-position-0-0 val-2'">2</div>
        var tileHTML = '<div class="tile tile-position-' + rowIndex + '-' + colIndex + ' val-' + cell + '">' + cell + '</div>';
        $('#tile-container').append(tileHTML);
      });

      // / for debugging /put cell on the screen,
      // console.log("Tile value: " + cell);
      // console.log("Row: " + rowIndex);
      // console.log("Column: " + colIndex);

  });
}

////ION SOUND////

//Each sound is a giant object
// function loadSounds () {
//   ion.sound({
//     sounds: [{name: "snap"}, {name: "tap"}],
//
//     path: "../lib/ion.sound-3.0.7/sounds/",
//     preload: true,
//     volume: 1.0
//   });
// }

function loadSounds (){
  ion.sound({
    sounds: [{name: 'snap'}, {name:'tap'}, {name: 'beer_can_opening'}],
    path: '../lib/ion.sound-3.0.7/sounds/',
    preload: true,
    volume: 1.0
  });
}
