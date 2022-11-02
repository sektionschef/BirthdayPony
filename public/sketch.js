const MODE = 1  // "FINE ART";
// const MODE = 2  // DEBUG MESSAGES
// const MODE = 5 // all debug messages

const NOISESEED = hashFnv32a(fxhash);
if (MODE > 1) {
  console.log("Noise seed: " + NOISESEED);
}

let canvas;
let rescaling_width;
let rescaling_height;

let PALETTE;
let PALETTE_LABEL;
let ALLDONE = false;
let DOMINANTSIDE;  // side which is the limiting factor

let RESCALINGCONSTANT = 800;  // the width the painting was designed in
let FRAMEDWIDTH = 800;
let FRAMED = false;

let TITLE = "fox";
let ARTIST = "Stefan Schwaha, @sektionschef";
let DESCRIPTION = "Javascript on pixel";
let URL = "https://digitalitility.com";
let YEAR = "2022";
let PRICE = "ꜩ 3";
let EDITIONS = "100 editions";

// let NUMBER_OF_GRIDS = getRandomFromList([2, 3]);
// let BRUSHSIZEMIN = getRandomFromList([0.3, 0.4, 0.5, 0.6, 0.7]);  // 0.5
// let BRUSHSIZEMAX = getRandomFromList([1, 1.25, 1.5, 1.75, 2, 2.25, 2.5]);  // 1.5
// let BRUSHSIZELABEL = BRUSHSIZEMIN + "-" + BRUSHSIZEMAX;
let BRUSHFULLSPEEDMIN = 2;
let BRUSHFULLSPEEDMAX = 6;
// let BRUSHFULLSPEED = Math.round(getRandomFromInterval(BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX) * 100) / 100;
// let BRUSHFULLSPEEDLABEL = label_feature(BRUSHFULLSPEED, BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX);
// let BRUSHFIBRESIZE = Math.round(getRandomFromInterval(0.2, 0.4) * 100) / 100;
// let BRUSHFIBRECOLORNOISE = Math.round(getRandomFromInterval(3, 10) * 100) / 100;
// let BRUSHCOLORDISTORT = Math.round(getRandomFromInterval(5, 10) * 100) / 100;
// let DISTANCE_BETWEEN_LINES = Math.round(getRandomFromInterval(6, 16));
// let DISTANCE_BETWEEN_LINES_LABEL = label_feature(DISTANCE_BETWEEN_LINES, 6, 16);
// let ROTHKOSTROKEOPACITY = Math.round(getRandomFromInterval(5, 30) * 100) / 100;
// let ROTHKOSTROKEOPACITYLABEL = label_feature(ROTHKOSTROKEOPACITY, 5, 30);
// let BRUSHSHAPE = getRandomFromList(["Line", "Ellipse", "Triangle"]);
// let HATCHOFFSET = 2;
let CURRENTPIXELDENS = 1;

const PALETTESYSTEM = {
  "Natalie": {
    "background": "#ececec",
    "primaries": [
      "#9EC5AB",
      "#104F55",
    ],
    "hatches": [
      "#166168",
      "#9EC5AB",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#504f4f",
    "dirtCircles": "#32746D",
  },
}

choosePalette();

function preload() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has('highres')) {
    CURRENTPIXELDENS = parseInt(urlParams.get('highres'));
  }
  if (MODE > 1) {
    console.log("CURRENTPIXELDENS: " + CURRENTPIXELDENS);
  }

  // if (urlParams.has('infinity')) {
  //   INFINITYSTRING = urlParams.get('infinity');
  //   INFINITY = (INFINITYSTRING === 'true');
  // }
  // console.log("INFINITY: " + INFINITY);

  if (urlParams.has('framed')) {
    if (urlParams.get("framed") === "true") {
      FRAMED = true;
    }
  }

  if (FRAMED) {
    setFrameHTML();
    setLabelHTML();
  } else {
    setPlainHTML();
  }
  setTagsHTML();
}

function setup() {

  setAttributes('alpha', true);

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);

  // setAttributes('antialias', true);

  scaleDynamically();

  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  // canvas = createCanvas(rescaling_width, rescaling_height);

  canvas.id('badAssCanvas');
  if (FRAMED) {
    canvas.parent("canvasHolderFrame");
  } else {
    canvas.parent("canvasHolderPlain");
  }

  brushSystem = new BrushSystem();

  dots1 = new DrawDots();
  // dots2 = new DrawDots();
  // dots3 = new DrawDots();

  if (MODE > 1) {
    console.log("Display density: " + displayDensity());
    // console.log("Pixel density: " + pixelDensity())
  }

  // Resolution independent features
  // BRUSHSIZEMIN = Math.round(BRUSHSIZEMIN / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;
  // BRUSHSIZEMAX = Math.round(BRUSHSIZEMAX / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;
  // BRUSHFIBRESIZE = Math.round(BRUSHFIBRESIZE / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;
  // HATCHOFFSET = Math.round(HATCHOFFSET / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;
  // DISTANCE_BETWEEN_LINES = Math.round(DISTANCE_BETWEEN_LINES / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;
  // HATCHOFFSET = Math.round(HATCHOFFSET / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;


  mastaBrush = new Brush(createVector(-100 + height / 2, width / 2, 0), createVector(100 + height / 2, width / 2, 0), color("black"));
  brushSystem.add(mastaBrush);

  // EXAMPLES for DEV
  // brushX = new Brush(createVector(150, 200), createVector(350, 200), color("black"));
  // brushXY = new Brush(createVector(400, 450), createVector(560, 600));
  // brushY = new Brush(createVector(300, 400), createVector(300, 800));
  // brushYX = new Brush(createVector(400, 600), createVector(560, 450));

  // brushBug = new Brush(createVector(807, 50), createVector(807, 898));

  // hatchesHigh = new Hatches("yx", createVector(100, 300), createVector(250, 600), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(300, 300), createVector(650, 400), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesHigh = new Hatches("yx", createVector(100, 100), createVector(450, 900), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(100, 100), createVector(750, 300), color(30), 0, 0, DISTANCE_BETWEEN_LINES);

  // hatchesBug = new Hatches("y", createVector(717, 50), createVector(898, 898), color(30), 0, 0, DISTANCE_BETWEEN_LINES);

  // camM = createCamera();
  cam1 = createCamera();
  // cam1.perspective();
  // cam1.ortho();

  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  // cam1.lookAt(-100, 0, 0);
  // cam1.setPosition(1200, 200, 500);

  // setCamera(cam1);

  texMex = new TexMex({
    custom_width: width,
    custom_height: height,
    posX: 0,
    posY: 0,
    elementSizeMin: 0.003 * DOMINANTSIDE,
    elementSizeMax: 0.006 * DOMINANTSIDE,
    margin: 0.05,
    // fillColor: color(PALETTE.primaries[0]),
    fillColor: color(PALETTE.background),
    fillColorNoise: 10,
    fillColorOpacity: 55,
    noStroke: false,
    strokeColor: color(100),
    strokeWeight: 0.00008 * DOMINANTSIDE,
    strokeColorNoise: 60,
    strokeOpacity: 80,
    numberQuantisizer: 380,
    // backgroundColor: color(PALETTE.primaries[0]),
    backgroundColor: color(PALETTE.background),
  })
  texMex.show();

}


function draw() {

  // pixelDensity(CURRENTPIXELDENS);

  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  // if (MODE == 5) {
  //   camera(0, 800, 0, 0, 0, 0, 0, 0, 1); // debug - on top view
  //   // camera(-1500, 0, 0, 0, 0, 0, 0, -1, 0); // debug -- side view
  // } else {
  //   camera(0, 700, 0, 0, 0, 0, 0, 0, 1);
  // }

  // ambientLight(255, 255, 255);
  // directionalLight(200, 200, 200, 1, -1, 0);
  // pointLight(155, 155, 155, 20 * conv, 0 * conv, -30 * conv)
  // ambientMaterial(255);
  // specularMaterial(255);

  if (MODE == 5) {
    background(200);
  }

  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);
    // cam1.setPosition(0, 0, 200);
    // cam1.lookAt(-100, 0, 0);

    // background(color("purple"));
  }
  // background(color(PALETTE.background));
  background(color(PALETTE.primaries[0]));

  push();
  translate(-width / 2, -height / 2);
  image(texMex.buffer, texMex.posX, texMex.posY, texMex.buffer.width, texMex.buffer.height);
  pop();


  // hatchesHigh.show();
  // hatchesLong.show();

  // hatchesBug.show();

  // mastaBrush.update();
  // mastaBrush.show();
  brushSystem.show();

  // cam1.move(mastaBrush.vel.x, mastaBrush.vel.y, 0);

  // show center
  // push();
  // translate(0, 0, 0);
  // ellipse(0, 0, 5);
  // pop();

  // brush examples
  // brushX.update();
  // brushX.display();
  // brushXY.update();
  // brushXY.display();
  // brushY.update();
  // brushY.display();
  // brushYX.update();
  // brushYX.display();

  // brushBug.update();
  // brushBug.display();

  dots1.show();
  // dots2.show();
  // dots3.show();

  if (frameCount > 100) {
    ALLDONE = true;
  }

  if (ALLDONE == true) {
    console.log("All done");
    noLoop();
    fxpreview();
    // console.warn(Math.round(fxrand() * 1000) / 1000);
  }

}

function mousePressed() {
  // console.log("frameCount; " + frameCount);
}
