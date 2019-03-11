"use strict";
//var p;

class Flower {
  constructor(x, y, sizeAdj) {
    this.pos = createVector(x, y);
    this.color = color(255);
    this.freq;

    this.amp = 0;
    this.ampMax = (width / 7) * sizeAdj;
    this.rad = 3 * sizeAdj;

    this.angle;
    this.value;
    this.penPos = 0;


  }
  updateAngle() {
    this.amp = lerp(this.amp, this.ampMax, 0.002);
    this.freq = frameCount * 0.01;
    this.angle = radians(frameCount);
    this.value = noise(this.freq) * this.amp;
  }
  updatePosition() {
    if (params.mouseMode && mouseIsPressed) {
      this.pos.x = mouseX;
      this.pos.y = mouseY;
    }
    this.penPos = p5.Vector.fromAngle(this.angle);
    this.penPos.mult(this.value);
  }


  display(a) {
    push();
    translate(this.pos.x, this.pos.y);

    var rSin = sin(frameCount * 0.1) * 50;
    var gSin = sin(frameCount * 0.03) * 50;
    var bSin = sin(frameCount * 0.02) * 50;

    var r = red(this.color) + rSin;
    var g = green(this.color) + gSin;
    var b = blue(this.color) + bSin;

    rotate(radians(a));
    fill(r, g, b);
    noStroke();
    ellipse(this.penPos.x, this.penPos.y, this.rad, this.rad);
    stroke(r, g, b, 10);
    strokeWeight(1);
    line(0, 0, this.penPos.x, this.penPos.y);
    pop();
  }
}



//