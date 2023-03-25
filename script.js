const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
const CANVAS_WIDTH = (canvas.width = window.innerWidth);
const CANVAS_HEIGHT = (canvas.height = window.innerHeight - 7);
let gameSpeed = 1;

const backgroundLayer1 = new Image();
backgroundLayer1.src = "./assets/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "./assets/layer-2.png";

const playerImage = new Image();
playerImage.src = "./assets/character.png";

let playerState = "walk";

const spriteWidth = 32;
const spriteHeight = 32;
let gamerFrame = 0;
const staggerFrames = 12;

const spriteAnimations = [];
const animationState = [
  {
    name: "walk",
    frames: 6,
  },
];

animationState.forEach((state, index) => {
  let frames = {
    loc: [],
  };
  for (let j = 0; j < state.frames; j++) {
    let positionX = j * spriteWidth;
    let positionY = index * spriteHeight;
    frames.loc.push({ x: positionX, y: positionY });
  }
  spriteAnimations[state.name] = frames;
});

function animateCharacter() {
  //ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  //To slow animation
  let position =
    Math.floor(gamerFrame / staggerFrames) %
    spriteAnimations[playerState].loc.length;
  let frameX = spriteWidth * position;
  let frameY = spriteAnimations[playerState].loc[position].y;
  ctx.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    CANVAS_WIDTH / 2 - spriteHeight,
    CANVAS_HEIGHT - spriteHeight,
    spriteWidth,
    spriteHeight
  );
  gamerFrame++;
  requestAnimationFrame(animateCharacter);
}

//some images are large so we start when we get all of our images
window.addEventListener("load", function () {
  class Layer {
    constructor(image, speedModifier) {
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = CANVAS_HEIGHT;
      this.image = image;
      this.speedModifier = speedModifier;
      this.speed = gameSpeed * this.speedModifier;
    }

    update() {
      this.speed = gameSpeed * this.speedModifier;
      if (this.x <= -this.width) {
        this.x = 0;
      }
      this.x = this.x - this.speed;
      //this.x = (gameFrame * this.speed) % this.width;
    }

    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      );
    }
  }

  const layer1 = new Layer(backgroundLayer1, 0.2);
  const layer2 = new Layer(backgroundLayer2, 0.4);

  const gameObjects = [layer1, layer2];

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach((object) => {
      object.update();
      object.draw();
    });
    //gameFrame--;
    requestAnimationFrame(animate);
  }
  animate();
  animateCharacter();
});
