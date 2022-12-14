const welcomeScreen = document.getElementById(`welcome-screen`);
const gameScreen = document.getElementById(`game-screen`);
const playGameButton = document.getElementById(`play-game-button`);

// Games Config
var config = {
  parent: `game`,
  width: 800,
  height: 600,
  scene: {
    create: create,
    update: update
  },
  physics: {
    default: `arcade`,
    arcade: {
      gravity: {y:0},
      debug: false
    }
  }
};


// Instantiate the Game object
let game;

// Hide Game Screen
gameScreen.classList.add(`d-none`);

// play-button Event Listener
playGameButton.addEventListener(`click`, function() {
  gameScreen.classList.remove(`d-none`);
  var game = new Phaser.Game(config);
  welcomeScreen.style.visibility = `hidden`;
});

var ball;
var paddle;
var lives = 3;
var score = 0;
var livesText;
var scoreText;
var brickInfo = {
  width: 50,
  height: 20,
  count: {
    row: 4,
    col: 12
  },
  offset: {
    top: 90,
    left: 60
  },
  padding: 10
}

var scene;

function create() {
  scene = this;

  paddle = scene.add.rectangle(400, 570, 140, 10, 0xFFFFFF);
  scene.physics.add.existing(paddle);
  paddle.body.immovable = true;

  ball = scene.add.circle(400, 300, 10, 0xFFFFFF);
  scene.physics.add.existing(ball);
  ball.body.velocity.x = 250;
  ball.body.velocity.y = 250;
  ball.body.collideWorldBounds = true;
  ball.body.bounce.y = 1;
  ball.body.bounce.x = 1;

  lava = scene.add.rectangle(0, 600, 200000, 10, 0x000000);
  scene.physics.add.existing(lava);
  lava.body.immovable = true;

  scoreText = scene.add.text(16, 16, "Score: " + score, {fontSize: `32px`, fill: `#FFF`})
  livesText = scene.add.text(630, 16, "Lives: " + lives, {fontSize: `32px`, fill: `#FFF`})

  scene.physics.add.collider(paddle, ball, bounceOffPaddle);
  createBricks();

  scene.physics.add.collider(ball, lava, hitLava)
  scene.input.on("pointermove", function(pointer){
    paddle.setPosition(pointer.x, paddle.y);
  })
}

function update() {
  if (lives === 0) {
    location.reload();
  }
  if (score === brickInfo.count.row * brickInfo.count.col) {
    location.reload();
  }
}

function bounceOffPaddle() {
  ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x)
}

function createBricks() {
  for ( c = 0; c < brickInfo.count.col; c++) {
    for (r = 0; r < brickInfo.count.row; r++) {
      var brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
      var brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
      manage(scene.physics.add.existing(scene.add.rectangle(brickX, brickY, 50, 20, 0xFFFFFF)));
    }
  }
}

function manage(brick) {
  brick.body.immovable = true;
  scene.physics.add.collider(ball, brick, function(){
    ballHitBrick(brick)
  });
}

function ballHitBrick(brick) {
  brick.destroy();
  score++;
  scoreText.setText("Score: " + score)
}

function hitLava() {
  lives--;
  livesText.setText("Lives: " + lives)
}