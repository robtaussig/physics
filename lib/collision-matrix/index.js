export default class CollisionMatrix {
  constructor(width, height, specificity = 1) {
    this.width = width;
    this.height = height;
    this.specificity = specificity;
    this.lastCell = width * height;
    this.occupiedSpaces = {};
    this.collisions = new Set();
  }
  
  clear() {
    this.occupiedSpaces = {};
    this.collisions = new Set();
    this.cachedCollisions = null;
  }

  setSpace(key, xPos, yPos, width, height) {
    let row, col;
    for (let i = 0; i < width; i += (width - (width * this.specificity) + 1)) {
      for (let j = 0; j < height; j += (height - (height * this.specificity) + 1)) {
        col = Math.floor(xPos + i);
        row = Math.floor(yPos + j);
        const index = (row * this.width) + col;
        if (this.occupiedSpaces[index]) {
          this.addCollision(index, key, xPos, yPos);
        } else {
          this.occupiedSpaces[index] = [{
            key, xPos, yPos
          }];
        }
      }
    }
  }

  addCollision(index, key, xPos, yPos) {
    this.occupiedSpaces[index].push({
      key, xPos, yPos,
    });
    this.collisions.add(index);
  }

  getCollisions() {
    if (this.cachedCollisions) return this.cachedCollisions;

    let collisionsAtIndex;
    this.cachedCollisions = Array.from(this.collisions)
      .reduce((acc, collisionIndex) => {
        collisionsAtIndex = this.occupiedSpaces[collisionIndex].map(el => el.key);
        collisionsAtIndex.forEach(key => {
          if (acc[key]) {
            acc[key].add(key);
          } else {
            acc[key] = new Set(collisionsAtIndex);
          }
        });
        return acc;
      }, {});
    return this.cachedCollisions;
  }
}