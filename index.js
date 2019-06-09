import CollisionMatrix from './lib/collision-matrix';

export default class BaseGame {
  constructor(canvas, framesPerSecond = 60, matrixSpecificity) {
    window.game = this;
    this.receiveClick = this.receiveClick.bind(this);
    this.receiveKeyStroke = this.receiveKeyStroke.bind(this);
    this.receivePointerMove = this.receivePointerMove.bind(this);
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.collisionMatrix = new CollisionMatrix(this.canvas.width, this.canvas.height, matrixSpecificity);
    this.objects = [];
    this.fps = framesPerSecond;
  }

  generateRandomStartPos(maxSize) {
    const xPos = Math.max(maxSize, Math.min(Math.floor(Math.random() * this.canvas.width), this.canvas.width - maxSize));
    const yPos = Math.max(maxSize, Math.min(Math.floor(Math.random() * this.canvas.height), this.canvas.height - maxSize));
    return { xPos, yPos };
  }

  generateRandomDirections() {
    const xSeed = Math.random();
    const ySeed = Math.random();
    const xDir = xSeed < 0.5 ? -1 : 1;
    const yDir = ySeed < 0.5 ? -1 : 1;
    return { xDir, yDir };
  }

  generateRandomSpeed(maxSpeed) {
    const xSeed = Math.random();
    const ySeed = Math.random();

    const xSpeed = Math.floor(xSeed * maxSpeed) + 1;
    const ySpeed = Math.floor(ySeed * maxSpeed) + 1;
    return { xSpeed, ySpeed };
  }

  generateRandomRotation() {
    return { angle: 0, rotationSpeed: 0 };
  }

  generateRandomSize(maxSize) {
    return Math.floor(Math.random() * maxSize);
  }

  initializeGame() {
    throw new Error('This method must be overwritten');
  }

  receiveKeyStroke(e) {
    console.log(e);
  }

  receivePointerMove(e) {
    console.log(e);
  }

  receiveClick(e) {
    console.log(e);
  }

  step() {
    throw new Error('This method must be overwritten');
  }

  handleCollisions() {
    const collisions = this.collisionMatrix.getCollisions();
    let object, collisionsByObject, otherObject, xDir, yDir;
    Object.keys(collisions).forEach(objectIndex => {
      collisionsByObject = collisions[objectIndex];
      object = this.objects[objectIndex];
      let xPush = 0;
      let yPush = 0;
      collisionsByObject.forEach(otherObjectIndex => {
        otherObject = this.objects[otherObjectIndex];
        if (object.xPos > otherObject.xPos) {
          xPush++;
        } else if (object.xPos < otherObject.xPos) {
          xPush--;
        }
        if (object.yPos > otherObject.yPos) {
          yPush++;
        } else if (object.yPos < otherObject.yPos) {
          yPush--;
        }
        const xSizeRatio = Math.min(1, object.xDistFromBasis / otherObject.xDistFromBasis);
        const ySizeRatio = Math.min(1, object.yDistFromBasis / otherObject.yDistFromBasis);
        otherObject.xSpeed = Math.max(object.xSpeed * xSizeRatio, otherObject.xSpeed);
        otherObject.ySpeed = Math.max(object.ySpeed * ySizeRatio, otherObject.ySpeed);
      });
      xDir = xPush > 0 ? 1 : xPush < 0 ? -1 : 0;
      yDir = yPush > 0 ? 1 : yPush < 0 ? -1 : 0;
      object.xDir = xDir;
      object.yDir = yDir;
    });
  }
  
  start() {
    this.stop = setInterval(this.step.bind(this), 1000 / this.fps);
  }
}