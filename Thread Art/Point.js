"use strict"
//var p;
class Point {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.size = 5;
    this.color = color(255);
    this.selected = false;
    this.scale = 1.0;
  }
  separate(others) {
    //var
    var vector = createVector();
    var count = 0;

    //sum
    for (var i = 0; i < others.length; i++) {
      var other = others[i];
      var distance = this.pos.dist(other.pos);

      if (distance > 0 && distance < this.separateDistance) {
        var diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(distance);
        vector.add(diff); //sum
        count++;
      }
    }

    //avg
    if (count > 0) {
      vector.div(count); //avg
    }
    if (vector.mag() > 0) {
      vector.setMag(this.maxSpeed);
      vector.sub(this.vel); //desired velocity
      vector.limit(this.maxSteerForce);

      return vector;
    }
    return vector;
  }

  applyForce(force) {
    var mass = this.size;
    force.div(mass);
    this.acc.add(force);
  }
  checkEdges() {
    if (pos.x < 0 && pos.x > width) {
      vel.x.mult(-1);
    }
    if (pos.y < 0 && pos.y > height) {
      vel.y.mult(-1);
    }
  }
  adjustment() {
    var freq = frameCount * 0.005;
    var amp = 1.0;
    var sinValue = abs(sin(freq) * amp) + 0.001;
    
    this.acc.mult(sinValue);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.limit(7.9);
  }
  select(x, y) {
    if (this.selected) {
      if (this.scale > -2) {
        this.scale -= 0.01;
      }
    }

    var distance = dist(this.pos.x, this.pos.y, x, y);
    if (distance < this.size + 10) {
      this.size = 10;
      this.color = color(params.red, params.green, params.blue, 200);
      if (mouseIsPressed && this.selected == false) {
        this.selected = true;
        return this.pos;
      }
    } else {
      this.size = 5;
      this.color = color(255);
    }
    return 0;
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(this.color);
    fill(100, 100);
    strokeWeight(1);
    ellipse(0, 0, this.size * this.scale, this.size * this.scale);
    pop();
  }

}