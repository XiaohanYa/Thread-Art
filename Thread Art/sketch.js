//JSON
var params = {
  mode: 0,
  mouseMode: false, //it's ","
  angleAdj: 63,
  maxSpeed: 1, //it's ","
  maxSteerForce: 0.01,
  sizeAdj: 0.3,
  red: 255,
  green: 100,
  blue: 0
};
/** MODES
 * 0: READY
 * 1: casualMode
 * 2: patternMode
 * 3: casual+pattern
 * 4: pinMode
 */

// enum

var gui = new dat.gui.GUI();

gui.add(params, "mode").min(0).max(4).step(1);
gui.add(params, "mouseMode");
gui.add(params, "angleAdj").min(13).max(79).step(2);
gui.add(params, "maxSpeed").min(0.5).max(5.0).step(0.1);
gui.add(params, "maxSteerForce").min(0.01).max(0.1).step(0.01);
gui.add(params, "sizeAdj").min(0.1).max(1).step(0.01);
gui.add(params, "red").min(0).max(255).step(1);
gui.add(params, "green").min(0).max(255).step(1);
gui.add(params, "blue").min(0).max(255).step(1);

//canvas
var c;

//text
var instruction;

//Mode
//mode1
var threads = [];
var recMode;

//mode2
var flowers = [];

//mode3=mode1+mode2

//mode4
var points = [];
var RESOLUTION = 100;
var rows, cols;
var linePoints = [];
var positionChange;
var threadMode = false;
var cut = false;




function setup() {
  c = createCanvas(1000, 600);
  background(0);
  recMode = false;

  positionChange = false;

  instruction = new Text(width / 2, height / 2);

}



function draw() {
  //background(0, 10);
  // MODE CHANGE
  switch (params.mode) {
    case 0:
      // do nothing!
      break;
    case 1:
      background(0);
      init_casualMode();
      flowers = [];
      points = [];
      linePoints = [];
      params.mode = 0;
      break;
    case 2:
      background(0);
      init_patternMode();
      threads = [];
      points = [];
      linePoints = [];
      params.mode = 0;
      break;
    case 3:
      background(0);
      init_casualMode();
      init_patternMode();
      points = [];
      linePoints = [];
      params.mode = 0;
      break;
    case 4:
      background(0);
      init_pinMode();
      threads = [];
      flowers = [];
      params.mode = 0;
      break;
    default:
      //
      break;
  }


  // DISPLAY



  //Mode One
  for (var i = 0; i < threads.length; i++) {
    var b = threads[i];
    if (flowers.length > 0) {
      b.target = flowers[(i % flowers.length)].pos;
    }
    if (params.mouseMode) {
      b.target = createVector(mouseX, mouseY);
    } else if (recMode) {
      b.changeRect();
    }
    b.flock(threads);
    b.update();
    b.checkEdges();
    b.fillColor = color(params.red + 30 * i, params.green + 30 * i, params.blue + 30 * i);

    b.display();
  }



  //Mode Two

  for (var i = 0; i < flowers.length; i++) {
    for (var a = 0; a < 360; a += params.angleAdj) {
      flowers[i].updateAngle();
      flowers[i].updatePosition();
      flowers[i].color = color(params.red + 30 * i, params.green + 20 * i, params.blue + 20 * i);
      flowers[i].display(a);
    }
  }
  //print(flowers.length);

  //Mode Three

  //draw line
  if (points.length > 0) {
    background(0);
    noFill();
    stroke(params.red, params.green, params.blue);

    beginShape();
    for (var i = 0; i < linePoints.length; i++) {
      if (!cut) {
        curveVertex(linePoints[i].pos.x, linePoints[i].pos.y);
      }
    }
    endShape(CLOSE);



    ////drawpin

    for (var i = 0; i < points.length; i++) {
      if (mouseIsPressed) {
        var target = createVector(mouseX, mouseY);
      } else {
        var target = createVector(width / 2, height / 2);
      }
      var attraction = p5.Vector.sub(target, points[i].pos);

      attraction.normalize();
      points[i].applyForce(attraction);
      if (positionChange) {
        for (var j = 0; j < points.length; j++) {
          if (i != j) {
            points[i].separate(points[j]);
          }
        }
        points[i].adjustment()
        points[i].update();

      }
      points[i].size = 5 + i * 0.1;

      var v = points[i].select(mouseX, mouseY);
      if (v != 0) {
        linePoints.push(new LinePoint(v));
      }

      if (!threadMode) {
        points[i].display();
      }

    }
  }
}

//print(points.length);




function keyPressed() {

  if (keyCode == ENTER) {
    //issue
    if (threads.length > 0) {
      init_casualMode();
    }
    if (flowers.length > 0) {
      init_patternMode();
    }
    if (threads.length > 0 && flowers.length > 0) {
      init_casualMode();
      init_patternMode();
    }
    if (points.length > 0) {
      positionChange = !positionChange;
    }
  }
  //rectMode
  if (key == "0") {
    recMode = !recMode;
  }

  //threadMode
  if (key == "1") {
    threadMode = !threadMode;
  }

  //mouseMode
  if (key == "2") {
    params.mouseMode = !params.mouseMode;
  }

  if (key == "3") {
    cut = !cut;
  }
  //clear
  if (keyCode == SHIFT) {
    background(0);
    threads = [];
    flowers = [];
    points = [];
    linePoints = [];

  }
  ////save canvas
  if (key == " ") {
    saveCanvas(c, 'myThread', 'jpg');
    print("saved");
  }
}




function init_casualMode() {
  threads = [];
  for (var i = 0; i < 5; i++) {
    var h = [0, height];
    var w = [0, width];
    var chance = floor(random(2));
    var v;
    switch (chance) {
      case 0:
        v = createVector(random(width), random(h));
        break;
      case 1:
        v = createVector(random(w), random(height));
        break;
    }

    threads.push(new Thread(v.x, v.y, params.maxSpeed, params.maxSteerForce, params.sizeAdj));
  }
}

function init_patternMode() {
  flowers = [];
  var num = random(1, 4);
  for (var i = 0; i < num; i++) {
    flowers.push(new Flower((width / (num + 2)) * (i + 1), height / 2 + random(-height / 4, height / 4), params.sizeAdj * (i + 1)));
  }
}

function init_pinMode() {
  background(0);
  points = [];

  rows = floor(width / RESOLUTION);
  cols = floor(height / RESOLUTION);

  for (var c = 0; c <= cols; c++) {
    for (var r = 0; r <= rows; r++) {
      var x = r * RESOLUTION;
      var y = c * RESOLUTION;
      points.push(new Point(x, y));
    }
  }
}






//