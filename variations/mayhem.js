import BaseGame from '../index';
import Background from '../lib/background';
import Ball from '../lib/objects/ball';
import {
  MAX_BALL_SIZE,
  BALL_COUNT,
  MAX_BALL_SPEED,
  CLICK_EFFECT_RADIUS,
  MATRIX_SPECIFICITY,
} from '../constants';

export default class Mayhem extends BaseGame {
  constructor(canvas, fps) {
    super(canvas, fps);
    this.background = new Background(this.ctx, this.canvas.width, this.canvas.height, MATRIX_SPECIFICITY);
    this.initializeGame();
  }

  generateRandomStartPos() {
    return super.generateRandomStartPos(MAX_BALL_SIZE);
  }

  generateRandomSpeed() {
    return super.generateRandomSpeed(MAX_BALL_SPEED);
  }

  generateRandomSize() {
    return super.generateRandomSize(MAX_BALL_SIZE);
  }

  receiveClick(e) {
    const { clientX, clientY } = e;
    const distanceFromClick = object => {
      const xDist = Math.abs(object.xPos - clientX);
      const yDist = Math.abs(object.yPos - clientY);
      return { xDist, yDist };
    };
    this.objects.forEach(object => {
      const { xDist, yDist } = distanceFromClick(object);
      if (xDist < CLICK_EFFECT_RADIUS && yDist < CLICK_EFFECT_RADIUS) {
        const distFromBall = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
        const speed = MAX_BALL_SPEED * (Math.max(CLICK_EFFECT_RADIUS - distFromBall, 0) / distFromBall);
        const xSpeed = (xDist / CLICK_EFFECT_RADIUS) * speed;
        const ySpeed = (yDist / CLICK_EFFECT_RADIUS) * speed;
        const xDir = object.xPos > clientX ? 1 : -1;
        const yDir = object.yPos > clientY ? 1 : -1;
        object.adjustPositionAndSpeed({
          xSpeed, ySpeed, xDir, yDir,
        });
      }
    });
  }

  step() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.background.step();
    this.collisionMatrix.clear();
    this.objects.forEach((object,idx) => {
      object.step();
      this.collisionMatrix.setSpace(
        idx, object.xPos - object.xDistFromBasis, object.yPos - object.yDistFromBasis, object.xDistFromBasis * 2, object.yDistFromBasis * 2);
    });
    this.handleCollisions();
  }

  initializeGame() {
    for (let i = 0; i < BALL_COUNT; i++) {
      const { xPos, yPos } = this.generateRandomStartPos(i);
      const { xDir, yDir } = this.generateRandomDirections(i);
      const { xSpeed, ySpeed } = this.generateRandomSpeed(i);
      const { angle, rotationSpeed } = this.generateRandomRotation(i);
      this.objects.push(new Ball(this.ctx, this.fps, {
        xPos, yPos, xDir, yDir, xSpeed, ySpeed, angle, rotationSpeed,
      }, {
        xMin: 0, xMax: this.canvas.width, yMin: 0, yMax: this.canvas.height,
      }, {
        size: this.generateRandomSize(i),
      }));
    }
    this.start();
  }
}