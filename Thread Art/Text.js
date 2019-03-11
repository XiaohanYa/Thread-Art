"use strict";

class Text {
  constructor(x, y) {
    this.pos = createVector(x, y);

    this.size = 100;
    this.color = color(255);
    this.life = 1.0;
  }
  display(words) {
    if (this.life != 0) {
      if (this.life > 0) {
        this.life -= 0.01;
      } else {
        this.life = 0;
      }

      this.color = color(255 * this.life);
      textSize(this.size);
      textAlign(CENTER);
      noStroke();
      fill(this.color);
      text(words, this.pos.x, this.pos.y)
    }
  }

}