"use strict";

class Thread {
  constructor(x, y, maxSpeed, maxSteerForce, sizeAdj) {
    this.pos = createVector(x, y);
    //this.vel = createVector(random(-1, 1), random(-1, 1));
    //this.vel = createVector(1, 0);
    this.vel = createVector();
    this.acc = createVector();

    this.maxSpeed = 2; // max speed;
    this.maxSteerForce = 0.05; // max steering force

    this.size = random(0.5, 1.5) + sizeAdj;

    this.separateDistance = random(100);
    this.neighborDistance = random(100);

    this.fillColor = color(255);

    this.sinAdj = random(0.1, 1.1);

    this.target = createVector(width / 2, height / 2);

    this.rectVector = createVector();
  }
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed); //***
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle = this.vel.heading();
  }
  applyForce(force) {
    this.acc.add(force);
  }
  flock(others) {

    var seekForce = this.seek();
    var sepaForce = this.separate(others);
    var coheForce = this.cohesion(others);
    var alignForce = this.align(others);

    //adjustment 

    sepaForce.div(0.5);

    this.applyForce(seekForce);
    this.applyForce(sepaForce);
    this.applyForce(coheForce);
    this.applyForce(alignForce);

  }
  changeRect() {
    var chance = floor(random(2));
    switch (chance) {
      case 0:
        this.target = createVector(width, this.pos.y);
        break;
      case 1:
        this.target = createVector(this.pos.x, height);
        break;
    }
  }
  seek() {

    var desired = p5.Vector.sub(this.target, this.pos);
    desired.setMag(this.maxSpeed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxSteerForce);

    return steer;
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
        diff.mult(2);
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

  cohesion(others) {
    var position = createVector();
    var count = 0;
    for (var i = 0; i < others.length; i++) {
      var other = others[i];
      var distance = this.pos.dist(other.pos);
      if (distance > 0 && distance < this.neighborDistance) {
        position.add(other.pos);
        count++;
      }
    }
    if (count > 0) {
      position.div(count); //avg
      return this.seek(position);
    }
    return position;
  }

  align(others) {
    var velocity = createVector();
    var count = 0;
    for (var i = 0; i < others.length; i++) {
      var other = others[i];
      var distance = this.pos.dist(other.pos);
      if (distance > 0 && distance < this.neighborDistance) {
        velocity.add(other.vel); //sum
        count++;
      }
    }
    if (count > 0) {
      velocity.div(count); //avg
      velocity.setMag(this.maxSpeed);
      var steer = p5.Vector.sub(velocity, this.vel);
      steer.limit(this.maxSteerForce);
      return steer;
    }
    return velocity;
  }

  checkEdges() {
    // x
    if (this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    // y
    if (this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }



  display() {
    push();

    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    noStroke();

    fill(this.fillColor);


    var freq = frameCount * 0.1 * this.sinAdj;
    var amp = 1 * this.sinAdj;
    var Adj = noise(freq) * amp;

    ellipse(6, 2, this.size + Adj, this.size + Adj);

    pop();
  }
}