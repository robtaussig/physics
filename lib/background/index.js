export default class Background {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  step() {
    this.ctx.fillStyle = 'dodgerblue';
    this.ctx.fillRect(0,0,this.width,this.height);
  }
}