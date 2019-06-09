import {
  DRAG_FACTOR,
} from '../../../../constants';

const valueOrDefault = (value, defaultValue) => {
  if (defaultValue === undefined) throw new Error('valueOrDefault requires a defined default');
  return value === undefined ? defaultValue : value;
};

export default class MoveableObject {
  constructor(ctx, framesPerSecond, position, boundaries) {
    this.validateProps(ctx, framesPerSecond, position, boundaries);
    const { xPos, yPos, xDir, yDir, angle, xSpeed, ySpeed, rotationSpeed } = position;
    const { xMin, yMin, xMax, yMax } = boundaries;
    this.ctx = ctx;
    this.fps = framesPerSecond;
    this.xMin = valueOrDefault(xMin, -Infinity);
    this.yMin = valueOrDefault(yMin, -Infinity);
    this.xMax = valueOrDefault(xMax, Infinity);
    this.yMax = valueOrDefault(yMax, Infinity);
    this.xDir = valueOrDefault(xDir, 0);
    this.yDir = valueOrDefault(yDir, 0);
    this.angle = valueOrDefault(angle, 0);
    this.xSpeed = valueOrDefault(xSpeed, 0);
    this.ySpeed = valueOrDefault(ySpeed, 0);
    this.rotationSpeed = valueOrDefault(rotationSpeed, 0);
    this.xPos = xPos;
    this.yPos = yPos;
  }

  adjustPositionAndSpeed(adjustments) {
    for (let property in adjustments) {
      if (adjustments.hasOwnProperty(property)) {
        this[property] = adjustments[property];
      }
    }
  }

  draw() {
    throw new Error('Inherited class must overwrite this');
  }

  calculateYChange() {
    const nextY = (this.yDir * this.ySpeed);
    if ((this.yPos + this.yDistFromBasis + nextY) > this.yMax) {
      this.yDir *= -1;
    } else if ((this.yPos - this.yDistFromBasis + nextY) < this.yMin) {
      this.yDir *= -1;
    }
    this.ySpeed *= DRAG_FACTOR;
  }

  updateYPosition() {
    this.yPos = this.yPos + (this.yDir * this.ySpeed);
  }

  calculateXChange() {
    const nextX = (this.xDir * this.xSpeed);
    if ((this.xPos + this.xDistFromBasis + nextX) > this.xMax) {
      this.xDir *= -1;
    } else if ((this.xPos - this.xDistFromBasis + nextX) < this.xMin) {
      this.xDir *= -1;
    }
    this.xSpeed *= DRAG_FACTOR;
  }

  updateXPosition() {
    this.xPos = this.xPos + (this.xDir * this.xSpeed);
  }

  updateRotation() {
    this.angle = Math.max(0, Math.min(359, this.angle + this.rotationSpeed));
  }

  step() {
    this.calculateYChange();
    this.updateYPosition();
    this.calculateXChange();
    this.updateXPosition();
    this.updateRotation();
    this.draw();
  }

  validateProps(ctx, framesPerSecond, position, boundaries) {
    if (!ctx) throw new Error('MoveableObject requires a canvas context');
    if (!position || !boundaries) throw new Error('MoveableObject missing position or boundaries');
    const { xPos, yPos, angle, xSpeed, ySpeed } = position;
    const { xMin, xMax, yMin, yMax } = boundaries;
    if (framesPerSecond === undefined) throw new Error('MoveableObject missing framesPerSecond');
    if (xPos === undefined) throw new Error('MoveableObject missing starting xPosition');
    if (yPos === undefined) throw new Error('MoveableObject missing starting yPosition');
  }
}