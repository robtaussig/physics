import MoveableObject from '../base/moveable-object';

export default class Ball extends MoveableObject {
  constructor(ctx, framesPerSecond, position, boundaries, options = {}) {
    super(ctx, framesPerSecond, position, boundaries);
    const { size } = options;
    this.xDistFromBasis = size / 2;
    this.yDistFromBasis = size / 2;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.xPos, this.yPos, this.xDistFromBasis, 0, 2*Math.PI);
    this.ctx.fillStyle = '#2f2f2f';
    this.ctx.strokeStyle = 'black';
    this.ctx.fill();
    this.ctx.stroke();
  }
}