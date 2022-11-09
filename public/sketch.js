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
// let theShader;

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

let GRAINAMOUNT = 0.03;
let TIMINGSTATE = "Start";

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
  // "Borscht": {
  //   "background": "#d3d3d3",
  //   "base": {
  //     fillFirst: "#5b5c5e15",
  //     fillSecond: "#66666915",
  //     strokeFirst: "#9997971c",
  //     strokeSecond: "#3f3f3f1c",
  //   },
  //   "cLevel": {
  //     fillFirst: "#5b5e5d15",
  //     fillSecond: "#4e555215",
  //     strokeFirst: "#172c7015",
  //     strokeSecond: "#27345f15",
  //   },
  //   "bLevel": {
  //     fillFirst: "#7f818015",
  //     fillSecond: "#71797515",
  //     strokeFirst: "#46254b13",
  //     strokeSecond: "#282b2713",
  //   },
  //   "aLevel": {
  //     fillFirst: "#e9e4eb15",
  //     fillSecond: "#e9e4eb15",
  //     strokeFirst: "#57295e15",
  //     strokeSecond: "#27252715",
  //   }
  // },
  "Halt die Fresse": {
    "background": "#4d4b4b",
    "base": {
      fillFirst: "#775e7515",
      fillSecond: "#805e7d15",
      strokeFirst: "#97829618",
      strokeSecond: "#61425f15",
    },
    "cLevel": {
      fillFirst: "#4d1e4915",
      fillSecond: "#3a1b3715",
      strokeFirst: "#74477015",
      strokeSecond: "#2c0e2828",
    },
    "bLevel": {
      fillFirst: "#c3b4c515",
      fillSecond: "#bca9be15",
      strokeFirst: "#e0d0e21f",
      strokeSecond: "#7b6c7c27",
    },
    "aLevel": {
      fillFirst: "#E9EBF815",
      fillSecond: "#d0d3e615",
      strokeFirst: "#887c881c",
      strokeSecond: "#b69bb41a",
    }
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

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);

  // setAttributes('alpha', true);
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

  // camM = createCamera();
  cam1 = createCamera();
  // cam1.perspective();
  // cam1.ortho();

  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  // cam1.lookAt(-100, 0, 0);
  // cam1.setPosition(1200, 200, 500);

  // setCamera(cam1);


  paintBroBuffer = createGraphics(width, height, "WEBGL");

  // shader
  grainBuffer = createGraphics(width, height, WEBGL);
  grainShader = grainBuffer.createShader(vert, frag);
  shouldAnimate = true;
  // shouldAnimate = false;

  brushSystem = new BrushSystem();

  dotSystem = new drawDotsSystem();

  if (MODE > 1) {
    console.log("Display density: " + displayDensity());
    // console.log("Pixel density: " + pixelDensity())
  }


  // BRUSH example
  // A1 = createVector(0.2 * DOMINANTSIDE, width / 2, 0);
  // A2 = createVector(0.6 * DOMINANTSIDE, width / 2, 0);
  // B1 = createVector(0.2 * DOMINANTSIDE, height / 2 - 100, 0);
  // B2 = createVector(0.6 * DOMINANTSIDE, width / 2 + 100, 0);

  // mastaBrush = new Brush(A1, A2, color("#f55442"));
  // brushSystem.add(mastaBrush);
  // mastaBrush2 = new Brush(B1, B2, color("#f55442"));
  // brushSystem.add(mastaBrush2);

  // GRID WITH LINES
  // for (var i = 0; i < 150; i += 5) {
  //   // console.log(i);
  //   line(0, Math.round(i / 3), 130, i)
  //   brushSystem.add(new Brush(createVector(100, 500 + Math.round(i / 3), 0), createVector(230, 500 + i, 0), color("#f55442")));
  // }

  // EXAMPLES for DEV
  // brushX = new Brush(createVector(150, 200), createVector(350, 200), color("black"));
  // brushXY = new Brush(createVector(400, 450), createVector(560, 600), color("black"));
  // brushY = new Brush(createVector(300, 400), createVector(300, 800), color("black"));
  // brushYX = new Brush(createVector(400, 600), createVector(560, 450), color("black"));

  // brushBug = new Brush(createVector(807, 50), createVector(807, 898));

  // hatchesHigh = new Hatches("yx", createVector(100, 300), createVector(250, 600), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(300, 300), createVector(650, 400), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesHigh = new Hatches("yx", createVector(100, 100), createVector(450, 900), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(100, 100), createVector(750, 300), color(30), 0, 0, DISTANCE_BETWEEN_LINES);

  // hatchesBug = new Hatches("y", createVector(717, 50), createVector(898, 898), color(30), 0, 0, DISTANCE_BETWEEN_LINES);

  // sunPolygon = [
  //   [-0.01 * DOMINANTSIDE, 0.01 * DOMINANTSIDE],
  //   [0.01 * DOMINANTSIDE, -0.01 * DOMINANTSIDE],
  //   [width + 0.01 * DOMINANTSIDE, height - 0.01 * DOMINANTSIDE],
  //   [width - 0.01 * DOMINANTSIDE, height + 0.01 * DOMINANTSIDE],
  // ]

  // sunPolygon = [
  //   createVector(-0.05 * DOMINANTSIDE, 0.05 * DOMINANTSIDE),
  //   createVector(0.05 * DOMINANTSIDE, -0.05 * DOMINANTSIDE),
  //   createVector(width + 0.05 * DOMINANTSIDE, height - 0.05 * DOMINANTSIDE),
  //   createVector(width - 0.05 * DOMINANTSIDE, height + 0.05 * DOMINANTSIDE),
  // ]

  sunPolygon = [
    createVector(0.19 * DOMINANTSIDE, 0.05 * DOMINANTSIDE),
    createVector(0.03 * DOMINANTSIDE, 0.05 * DOMINANTSIDE),
    createVector(width - 0.19 * DOMINANTSIDE, height - 0.05 * DOMINANTSIDE),
    createVector(width - 0.05 * DOMINANTSIDE, height - 0.05 * DOMINANTSIDE),
  ]

  // console.log(sunPolygon);

  // test structure - 
  // gan = new Gan({
  //   buffer: paintBroBuffer,
  //   posX: 0,
  //   posY: 0,
  //   elementSizeMin: 0.004 * DOMINANTSIDE,
  //   elementSizeMax: 0.004 * DOMINANTSIDE,
  //   fillColor: color(PALETTE.base.fillFirst),
  //   // fillColor: color(100),
  //   // secondaryFillColor: color(180, 60),
  //   secondaryFillColor: color(PALETTE.base.fillSecond),
  //   fillColorNoise: 10,
  //   fillColorOpacity: 255,
  //   numberQuantisizer: 1,
  //   // backgroundColor: color(PALETTE.base[0]),
  // })
  // gan.show();

  paintbro = new paintBro({
    buffer: paintBroBuffer,
    elementSizeMin: 0.01 * DOMINANTSIDE, //width * 0.01,
    elementSizeMax: 0.09 * DOMINANTSIDE, //width * 0.05,
    strokeWeight: 5 * DOMINANTSIDE,// width * 0.001,
    numberQuantisizer: 10,
  })

  // texMex = new TexMex({
  //   buffer: paintBroBuffer,
  //   posX: 0,
  //   posY: 0,
  //   elementSizeMin: 0.001 * DOMINANTSIDE,
  //   elementSizeMax: 0.001 * DOMINANTSIDE,
  //   // fillColor: color(PALETTE.base[1]),
  //   fillColor: color(100),
  //   secondaryFillColor: color(180, 60),
  //   fillColorNoise: 5,
  //   fillColorOpacity: 255,
  //   noStroke: true,
  //   strokeColor: color(0),
  //   strokeWeight: 0.00008 * DOMINANTSIDE,
  //   strokeColorNoise: 0,
  //   strokeOpacity: 0,
  //   numberQuantisizer: 30,
  //   // backgroundColor: color(PALETTE.base[0]),
  //   backgroundColor: color(PALETTE.background),
  // })
  // texMex.show();


  // trying to blur
  // push();
  // buffer = createGraphics(width, height, "WEBGL");
  // // buffer.translate(-width / 2, -height / 2);
  // buffer.drawingContext.filter = 'blur(5px)';
  // buffer.image(paintBroBuffer, 0, 0, paintBroBuffer.width, paintBroBuffer.height);
  // drawingContext.filter = 'none';
  // pop();

}


function draw() {

  smooth();

  orbitControl();
  // cam1.move(mastaBrush.vel.x, mastaBrush.vel.y, 0);
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

  if (frameCount == 0) {
    pixelDensity(CURRENTPIXELDENS);
    // cam1.setPosition(0, 0, 200);
    // cam1.lookAt(-100, 0, 0);
    // paintBroBuffer.background(color(PALETTE.background));
  }
  // background(color(PALETTE.background));

  // hatchesHigh.show();
  // hatchesLong.show();
  // hatchesBug.show();

  if (frameCount == 30) {
    paintbro.show("base");
    console.log("base finished");
    TIMINGSTATE = "base finished";
    dotSystem.fireBrush("cLevel");
  }

  if (brushSystem.check_all_complete("cLevel") && TIMINGSTATE == "base finished") {
    paintbro.show("cLevel");
    console.log("cLevel finished");
    TIMINGSTATE = "cLevel finished"
    dotSystem.fireBrush("bLevel");
  };

  if (brushSystem.check_all_complete("bLevel") && TIMINGSTATE == "cLevel finished") {
    paintbro.show("bLevel");
    console.log("bLevel finished");
    TIMINGSTATE = "bLevel finished"
    dotSystem.fireBrush("aLevel");
  };

  if (brushSystem.check_all_complete("aLevel") && TIMINGSTATE == "bLevel finished") {
    paintbro.show("aLevel");
    console.log("aLevel finished");
    TIMINGSTATE = "aLevel finished"
    ALLDONE = true;
  };

  // if (TIMINGSTATE == "base finished") {
  //   dotSystem.fireBrush("bLevel");
  //   if (brushSystem.all_lines_complete == true) {
  //     // console.log("Lines finished.");
  //     TIMINGSTATE = "cLevel finished"
  //   }
  // }

  // if (TIMINGSTATE == "cLevel finished") {
  //   paintbro.show("bLevel");
  //   dotSystem.fireBrush("aLevel");
  //   if (brushSystem.all_lines_complete == true) {
  //     // console.log("Lines finished.");
  //     TIMINGSTATE = "bLevel finished"
  //   }
  // }

  // if (TIMINGSTATE == "bLevel finished") {
  //   paintbro.show("aLevel");
  // }



  // PAINT
  push();
  translate(-width / 2, -height / 2);
  image(paintBroBuffer, 0, 0, paintBroBuffer.width, paintBroBuffer.height);
  pop();


  // TEST GAN
  // push();
  // translate(-width / 2, -height / 2);
  // image(gan.buffer, 0, 0, gan.buffer.width, gan.buffer.height);
  // pop();

  // BRUSHES
  brushSystem.show();

  // TEX
  // push();
  // translate(-width / 2, -height / 2);
  // image(texMex.buffer, texMex.posX, texMex.posY, texMex.buffer.width, texMex.buffer.height);
  // pop();

  // show center
  // push();
  // translate(0, 0, 0);
  // let stan = color(122, 33, 198);
  // let stan_new = highlightColor(stan);
  // fill(stan_new);
  // noStroke();
  // ellipse(0, 0, 55);
  // pop();


  // brush examples
  // brushX.update();
  // brushX.show();
  // brushXY.update();
  // brushXY.show();
  // brushY.update();
  // brushY.show();
  // brushYX.update();
  // brushYX.show();

  // brushBug.update();
  // brushBug.show();


  // SHOW SUNPOLYGON
  // push();
  // translate(-width / 2, -height / 2);
  // noFill();
  // beginShape();
  // vertex(sunPolygon[0].x, sunPolygon[0].y);
  // vertex(sunPolygon[1].x, sunPolygon[1].y);
  // vertex(sunPolygon[2].x, sunPolygon[2].y);
  // vertex(sunPolygon[3].x, sunPolygon[3].y);
  // endShape(CLOSE);
  // pop();


  if (MODE > 1) {
    dotSystem.show();
  }

  if (ALLDONE == true) {
    console.log("All done");
    noLoop();
    fxpreview();
    console.warn(Math.round(fxrand() * 1000) / 1000);
  }

  // shader
  // applyGrain();

  // console.warn(Math.round(fxrand() * 100) / 100);
  // noLoop();
}

function mousePressed() {
  // console.log("frameCount; " + frameCount);
}

// shader
function applyGrain() {
  grainBuffer.clear();
  grainBuffer.reset();
  grainBuffer.push();
  grainBuffer.shader(grainShader);
  grainShader.setUniform('source', canvas);
  if (shouldAnimate) {
    //grainShader.setUniform('noiseSeed', random());
    grainShader.setUniform('noiseSeed', frameCount / 100);
  }
  grainShader.setUniform('noiseAmount', GRAINAMOUNT);  // value here!!
  grainBuffer.rectMode(CENTER);
  grainBuffer.noStroke();
  grainBuffer.rect(0, 0, width, height);
  grainBuffer.pop();

  clear();
  push();
  translate(-width / 2, -height / 2)  // ADDED THIS LINE
  image(grainBuffer, 0, 0);
  pop();
}

// shader
const vert = `
// Determines how much precision the GPU uses when calculating floats
precision highp float;

// Get the position attribute of the geometry
attribute vec3 aPosition;

// Get the texture coordinate attribute from the geometry
attribute vec2 aTexCoord;

// The view matrix defines attributes about the camera, such as focal length and camera position
// Multiplying uModelViewMatrix * vec4(aPosition, 1.0) would move the object into its world position in front of the camera
uniform mat4 uModelViewMatrix;

// uProjectionMatrix is used to convert the 3d world coordinates into screen coordinates
uniform mat4 uProjectionMatrix;

varying vec2 vVertTexCoord;

void main(void) {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  vVertTexCoord = aTexCoord;
}
`

// shader
const frag = `
precision highp float;
varying vec2 vVertTexCoord;

uniform sampler2D source;
uniform float noiseSeed;
uniform float noiseAmount;

// Noise functions
// https://github.com/patriciogonzalezvivo/lygia/blob/main/generative/random.glsl
float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
    // GorillaSun's grain algorithm
    vec4 inColor = texture2D(source, vVertTexCoord);
    gl_FragColor = clamp(inColor + vec4(
        mix(-noiseAmount, noiseAmount, fract(noiseSeed + rand(vVertTexCoord * 1234.5678))),
        mix(-noiseAmount, noiseAmount, fract(noiseSeed + rand(vVertTexCoord * 876.54321))),
        mix(-noiseAmount, noiseAmount, fract(noiseSeed + rand(vVertTexCoord * 3214.5678))),
        0.
    ), 0., 1.);
}
`

function highlightColor(colorCode) {
  var gain = 20;

  var hsbHighlight;
  var rgbHighlight;

  var newBrightness = constrain(brightness(colorCode) + gain * 2, 0, 100);
  var newSaturation = constrain(saturation(colorCode) - gain, 0, 100);

  colorMode(HSB, 360, 100, 100, 1);
  hsbHighlight = color(hue(colorCode), newSaturation, newBrightness);

  colorMode(RGB, 255, 255, 255, 255);
  rgbHighlight = color(red(hsbHighlight), green(hsbHighlight), blue(hsbHighlight), alpha(colorCode));

  // return colorCode;
  return rgbHighlight;
}

function fillGradient(pos, widthE, heightE, color1, color2) {

  for (let i = pos.y; i <= pos.y + heightE; i++) {
    let inter = map(i, pos.y, pos.y + heightE, 0, 1);
    let c = lerpColor(color1, color2, inter);
    stroke(c);
    line(pos.x, i, pos.x + widthE, i);
  }
}