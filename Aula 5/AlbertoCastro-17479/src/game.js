// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');


gameScene.init = function (){
  this.playerSpeed = 1.5;
  this.enemyMaxY = 280;
  this.enemyMinY=80;
}

gameScene.gameOver = function (){
  this.isPlayerAlive = false;

  this.cameras.main.shake(500);

  this.time.delayedCall(250, function(){
    this.cameras.main.fade(250);
  },[],this);

  this.time.delayedCall(500,function(){
    this.scene.restart();
  },[], this);
};

// load asset files for our game
gameScene.preload = function() {
  // load images
  this.load.image('background', 'assets/background.png');
  this.load.image('player','assets/player.png');
  this.load.image('dragon','assets/dragon.png');
  this.load.image('treasure','assets/treasure.png');
};

// executed once, after assets were loaded
gameScene.create = function() {
  // background
  let bg = this.add.sprite(0, 0, 'background');
  bg.setOrigin(0,0)
  this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
  this.player.setScale(0.5);
  this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  this.treasure.setScale(0.6);

  //enemies
  this.enemies = this.add.group({
    key: 'dragon',
    repeat: 5,
    setXY: {
      x:110,
      y:100,
      stepX: 80,
      stepY: 20,
    }
  });
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);
  Phaser.Actions.Call(this.enemies.getChildren(),function(enemy){
    enemy.speed = Math.random() * 2+1;
  },this);

  this.isPlayerAlive = true;

  this.cameras.main.resetFX();

};
//60 times per second (every frame)
gameScene.update = function() {
  if(!this.isPlayerAlive){
    return;
  }

  if(this.input.activePointer.isDown){
    //player walks
    this.player.x += this.playerSpeed;
  }
  if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(),this.treasure.getBounds())){
    this.gameOver();
  }

  //enemy movement
  let enemies =this.enemies.getChildren();
  let numEnemies = enemies.length;

  for (let i = 0; i < numEnemies; i++){
    enemies[i].y += enemies[i].speed;
    if(enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0){
      enemies[i].speed *= -1;
    }else if(enemies[i].y <= this.enemyMinY && enemies[i].speed < 0){
      enemies[i].speed *= -1;
    }
    //enemy Collision
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(),enemies[i].getBounds())){
      this.gameOver();
      break;
    }
  }

};


// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
