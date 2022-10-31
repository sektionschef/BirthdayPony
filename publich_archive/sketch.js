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

let RESCALINGCONSTANT = 948;  // the width the painting was designed in
let FRAMEDWIDTH = 800;
let FRAMED = false;

let TITLE = "Landstreicherin";
let ARTIST = "Stefan Schwaha, @sektionschef";
let DESCRIPTION = "Javascript on pixel";
let URL = "https://digitalitility.com";
let YEAR = "2022";
let PRICE = "ꜩ 3";
let EDITIONS = "100 editions";

let NUMBER_OF_GRIDS = getRandomFromList([2, 3]);
let BRUSHSIZEMIN = getRandomFromList([0.3, 0.4, 0.5, 0.6, 0.7]);  // 0.5
let BRUSHSIZEMAX = getRandomFromList([1, 1.25, 1.5, 1.75, 2, 2.25, 2.5]);  // 1.5
let BRUSHSIZELABEL = BRUSHSIZEMIN + "-" + BRUSHSIZEMAX;
let BRUSHFULLSPEEDMIN = 2;
let BRUSHFULLSPEEDMAX = 6;
let BRUSHFULLSPEED = Math.round(getRandomFromInterval(BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX) * 100) / 100;
let BRUSHFULLSPEEDLABEL = label_feature(BRUSHFULLSPEED, BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX);
let BRUSHFIBRESIZE = Math.round(getRandomFromInterval(0.2, 0.4) * 100) / 100;
let BRUSHFIBRECOLORNOISE = Math.round(getRandomFromInterval(3, 10) * 100) / 100;
let BRUSHCOLORDISTORT = Math.round(getRandomFromInterval(5, 10) * 100) / 100;
let DISTANCE_BETWEEN_LINES = Math.round(getRandomFromInterval(6, 16));
let DISTANCE_BETWEEN_LINES_LABEL = label_feature(DISTANCE_BETWEEN_LINES, 6, 16);
let ROTHKOSTROKEOPACITY = Math.round(getRandomFromInterval(5, 30) * 100) / 100;
let ROTHKOSTROKEOPACITYLABEL = label_feature(ROTHKOSTROKEOPACITY, 5, 30);
let BRUSHSHAPE = getRandomFromList(["Line", "Ellipse", "Triangle"]);
let HATCHOFFSET = 2;
let CURRENTPIXELDENS = 1;

const PALETTESYSTEM = {
  "Devcon5": {
    "background": "#030708",
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
  "Feinstaub": {
    "background": "#3d0909",
    "primaries": [
      "#ff993a",
      "#F52F57",
    ],
    "hatches": [
      "#cf6426",
      "#8d0a24",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#a58b8b",
    "dirtCircles": "#747474",
  },
  "Pfaffstätten": {
    "background": "#09324b",
    "primaries": [
      "#82b1ce",
      "#F3A712",
    ],
    "hatches": [
      "#56a6d8",
      "#F3A712",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#9c9c9c",
    "dirtCircles": "#3180b1",
  },
  "Suzy": {
    "background": "#490f00ff",
    "primaries": [
      "#eb4a00ff",
      "#4793c2ff",
    ],
    "hatches": [
      "#bd460fff",
      "#30729bff",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#858080",
    "dirtCircles": "#64331cff",
  },
  "Aneignung": {
    "background": "#3b1628",
    "primaries": [
      "#ca1246",
      "#da4e78",
    ],
    "hatches": [
      "#fa608e",
      "#6e0221",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#7a1f1f",
    "dirtCircles": "#7a3656",
  },
  "MoltoVolto": {
    "background": "#cccdcd",
    "primaries": [
      "#68a1a1",
      "#815353",
    ],
    "hatches": [
      "#8ab9b9",
      "#633d3d",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#5e5252",
    "dirtCircles": "#797979",
  },
  "Molto": {
    "background": "#b9b9b9",
    "primaries": [
      "#20cccc",
      "#da4d4d",
    ],
    "hatches": [
      "#3895ac",
      "#a82f2f",
    ],
    "rothkoStroke": "#1b1818",
    "dirtline": "#919191",
    "dirtCircles": "#555454",
  },
  "Das Zeitliche": {
    "background": "#1b1818",
    "primaries": [
      "#524747",
      "#687980",
    ],
    "hatches": [
      "#423c3cff",
      "#556266ff",
    ],
    "rothkoStroke": "#272525",
    "dirtline": "#413939",
    "dirtCircles": "#424242",
  },
  "Frischkäse": {
    "background": "#c9c8ce",
    "primaries": [
      "#d6a076",
      "#6e6f85",
    ],
    "hatches": [
      "#b18563",
      "#43477e",
    ],
    "rothkoStroke": "#3b3939",
    "dirtline": "#707070",
    "dirtCircles": "#5e5e5e",
  },
  "October": {
    "background": "#c9c8ce",
    "primaries": [
      "#FF6D24",
      "#663c28",
    ],
    "hatches": [
      "#FF6D24",
      "#663c28",
    ],
    "rothkoStroke": "#666666",
    "dirtline": "#707070",
    "dirtCircles": "#777777",
  },
  "Sebastian": {
    "background": "#c9c8ce",
    "primaries": [
      "#272343",
      "#c5c5c5",
    ],
    "hatches": [
      "#272343",
      "#c5c5c5",
    ],
    "rothkoStroke": "#666666",
    "dirtline": "#707070",
    "dirtCircles": "#777777",
  },
  "Kill or die": {
    "background": "#929292",
    "primaries": [
      "#363636",
      "#dfdfdf",
    ],
    "hatches": [
      "#363636",
      "#dfdfdf",
    ],
    "rothkoStroke": "#666666",
    "dirtline": "#707070",
    "dirtCircles": "#777777",
  },
}

choosePalette();

function preload() {

  font = loadFont('OpenSans-Regular.ttf');

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

  // canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  canvas = createCanvas(rescaling_width, rescaling_height);
  canvas.id('badAssCanvas');
  if (FRAMED) {
    canvas.parent("canvasHolderFrame");
  } else {
    canvas.parent("canvasHolderPlain");
  }


  if (MODE > 1) {
    console.log("Display density: " + displayDensity());
    // console.log("Pixel density: " + pixelDensity())
  }

  // Resolution independent features
  BRUSHSIZEMIN = Math.round(BRUSHSIZEMIN / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;
  BRUSHSIZEMAX = Math.round(BRUSHSIZEMAX / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;
  BRUSHFIBRESIZE = Math.round(BRUSHFIBRESIZE / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;
  HATCHOFFSET = Math.round(HATCHOFFSET / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;
  DISTANCE_BETWEEN_LINES = Math.round(DISTANCE_BETWEEN_LINES / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;
  HATCHOFFSET = Math.round(HATCHOFFSET / RESCALINGCONSTANT * DOMINANTSIDE * 100) / 100;


  // EXAMPLES for DEV
  // brushX = new Brush(createVector(150, 200), createVector(350, 200));
  // brushXY = new Brush(createVector(400, 450), createVector(560, 600));
  // brushY = new Brush(createVector(300, 400), createVector(300, 800));
  // brushYX = new Brush(createVector(400, 600), createVector(560, 450));

  // brushBug = new Brush(createVector(807, 50), createVector(807, 898));

  // hatchesHigh = new Hatches("yx", createVector(100, 300), createVector(250, 600), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(300, 300), createVector(650, 400), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesHigh = new Hatches("yx", createVector(100, 100), createVector(450, 900), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(100, 100), createVector(750, 300), color(30), 0, 0, DISTANCE_BETWEEN_LINES);

  // hatchesBug = new Hatches("y", createVector(717, 50), createVector(898, 898), color(30), 0, 0, DISTANCE_BETWEEN_LINES);

  backgroundDirtCircles = new dirtCircles(
    {
      custom_width: width,
      custom_height: height,
      margin: 0,
      posX: 0,
      posY: 0,
      fillColor: color(PALETTE.background),
      fillColorNoise: 10,
      numberQuantisizer: 2000,
      radiusBase: 0.75,
      radiusNoise: 0.25,
    }
  );


  corroded = new Corroded(
    {
      custom_width: width,
      custom_height: height,
      posX: 0,
      posY: 0,
      fillColor: color(PALETTE.background),
    }
  );

  grid = new Grid();
  if (NUMBER_OF_GRIDS >= 2) {
    grid2 = new Grid();
  }
  if (NUMBER_OF_GRIDS >= 3) {
    grid3 = new Grid();
  }

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

    background(color(PALETTE.background));
  }

  if (frameCount == 10) {
    corroded.show();
    backgroundDirtCircles.show();
  }

  // hatchesHigh.show();
  // hatchesLong.show();

  // hatchesBug.show();

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


  if (frameCount >= 20) {
    grid.show(20);
  }

  if (NUMBER_OF_GRIDS >= 2) {
    if (grid.boxes_completely_run) {
      grid2.show(grid.frameCountFinished, false);
    }
  }

  if (NUMBER_OF_GRIDS >= 3) {
    if (grid.boxes_completely_run && grid2.boxes_completely_run) {
      grid3.show(grid2.frameCountFinished, false);
    }
  }


  if (NUMBER_OF_GRIDS == 1 && grid.boxes_completely_run) {
    ALLDONE = true;
  }
  if (NUMBER_OF_GRIDS == 2 && grid.boxes_completely_run && grid2.boxes_completely_run) {
    ALLDONE = true;
  }
  if (NUMBER_OF_GRIDS == 3 && grid.boxes_completely_run && grid2.boxes_completely_run && grid3.boxes_completely_run) {
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
