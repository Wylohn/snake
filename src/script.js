let canvas;
let ctx;
let game;
let score = 0;

// Taille case 
const gridSize = 20;

// Velocity
let VeloX = 0;
let VeloY = 0;

// Snake
const snake = [];
let tail = 1;

// Position du Snake
let snakeX = 10;
let snakeY = 10;

//Buttons
const replayButton = document.querySelector('.replay')
const diff = document.querySelector('.buttons')
const easy = document.querySelector('.level1')
const medium = document.querySelector('.level2')
const hard = document.querySelector('.level3')
const scoreRegister = document.querySelector('.scores')

let f = 8;


canvas = document.getElementById('boardsnake');
ctx = canvas.getContext('2d');
affScore = document.getElementById('score');
arrowsContainer = document.querySelector('.touch-arrows');
arrows = document.querySelectorAll('.touch-arrow');
easy.addEventListener('click', easyLevel);
medium.addEventListener('click', mediumLevel);
hard.addEventListener('click', hardLevel);
document.addEventListener('keydown', onKeyDown);
game = setInterval(draw, 1000 / f);


arrows.forEach(arrow => {
  arrow.addEventListener('touchstart', ()=>{
      if (typeof arrow.dataset.direction === "string") {
        applyDirection(arrow.dataset.direction)
      }
  })
});


function easyLevel() {
  f = 8
  reset()
}

function mediumLevel() {
  f = 12
  reset()
}

function hardLevel() {
  f = 15
  reset()
}



// Direction

function applyDirection(direction) {
  switch (direction) {
    case "up":
      if(VeloY != 1){
        VeloX = 0;
        VeloY = -1;
        break;
      };
    case "left":
      if(VeloX != 1){
        VeloX = -1;
        VeloY = 0;
        break;
      };
    case "down":
      if(VeloY != -1){
        VeloX = 0;
        VeloY = 1;
        break;
      };
    case "right":
      if(VeloX != -1){
        VeloX = 1;
        VeloY = 0;
        break;
      }
  }
}

function onKeyDown(e) {
    switch (e.keyCode) {
      case 37:                  //Gauche
        applyDirection("left")
        break
      case 38:                  //Haut
        applyDirection("up")
        break
      case 39:                  //Droite
        applyDirection("right")
        break
      case 40:                  //Bas
        applyDirection("down")
        break
    };
};



// Position apple

const apple = {
    x:Math.floor(Math.random() * gridSize),
    y:Math.floor(Math.random() * gridSize),
};

// Reset

replayButton.addEventListener('click', reset)

function reset() {
  replayButton.classList.remove('replay-show');
  diff.classList.remove('buttons-show');
  arrowsContainer.classList.remove('isHidden');
  tail = 1;
  score = 0;
  VeloX = 0;
  VeloY = 0;
  snakeX = 10;
  snakeY = 10;
  game = setInterval(draw, 1000 / f);
}


// Scoreboard

function addScore(score) {
  var createLi = document.createElement('li')
  if (score > 0) {
    scoreRegister.appendChild(createLi)
    createLi.innerHTML +=
      score
  }
}

// Lose

function lose() {
  clearInterval(game)
  addScore(score)
  replayButton.classList.add('replay-show');
  diff.classList.add('buttons-show');
  arrowsContainer.classList.add('isHidden');
}


// Lancement du jeu

function draw() {
  ctx.fillStyle = '#181825';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  snakeX += VeloX;
  snakeY += VeloY;

  if (snakeX == apple.x && snakeY == apple.y) {
    score++;
    tail++;
    apple.x = Math.floor(Math.random() * gridSize);
    apple.y = Math.floor(Math.random() * gridSize);
  };
  
  affScore.textContent = score
  ctx.fillStyle = 'red';
  ctx.globalCompositionOperation = 'lighter'
  ctx.fillRect(
    apple.x * gridSize,
    apple.y * gridSize,
    gridSize,
    gridSize,
  );
  
  // Dégradé de couleur

  let lineaire = ctx.createLinearGradient(0, 150, 300, 150);
  lineaire.addColorStop(0.000, 'rgba(247, 149, 51, 1.000)');
  lineaire.addColorStop(0.151, 'rgba(243, 112, 85, 1.000)');
  lineaire.addColorStop(0.311, 'rgba(239, 78, 123, 1.000)');
  lineaire.addColorStop(0.462, 'rgba(161, 102, 171, 1.000)');
  lineaire.addColorStop(0.621, 'rgba(80, 115, 184, 1.000)');
  lineaire.addColorStop(0.748, 'rgba(16, 152, 173, 1.000)');
  lineaire.addColorStop(0.875, 'rgba(7, 179, 155, 1.000)');
  lineaire.addColorStop(1.000, 'rgba(111, 186, 130, 1.000)');
  ctx.fillStyle = lineaire

  for (var i = 0; i < snake.length; i++) {
    ctx.fillRect(
      snake[i].x * gridSize,
      snake[i].y * gridSize,
      gridSize,
      gridSize,
    );
    
    // Mort par lui-même

    if (tail > 1) {
      if (snake[i].x == snakeX && snake[i].y == snakeY) {
        lose();
      };
    };
  };
  
  snake.push({x: snakeX, y: snakeY})
  while (snake.length > tail) {
    snake.shift()
  };  

  // Mort par bordure

  if (snakeX < 0 || snakeX * gridSize >= canvas.width  || snakeY < 0 || snakeY * gridSize >= canvas.height) {
    lose();
  };

}