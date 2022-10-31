// these are the variables you can use as inputs to your algorithms
// console.log("fxhash: " + fxhash)   // the 64 chars hex number fed to your algorithm
// console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//

// FEATURES

window.$fxhashFeatures = {
    "Palette": PALETTE_LABEL,
    // "Number of grids": NUMBER_OF_GRIDS,
    // "Brushsize": BRUSHSIZELABEL,
    // "Brushspeed": BRUSHFULLSPEEDLABEL,
    // "Distance between lines": DISTANCE_BETWEEN_LINES_LABEL,
    // "Background noise": ROTHKOSTROKEOPACITYLABEL,
    // "Brush shape": BRUSHSHAPE,
}

console.info(`fxhash: %c${fxhash}`, 'font-weight: bold');

console.log('');
console.group(`Palette: %c${PALETTE_LABEL} `, 'font-weight: bold');
// console.log(`background: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['background']}; `);
// console.log(`primaries: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['primaries'][0]}; `);
// console.log(`primaries: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['primaries'][1]}; `);
// console.log(`hatches: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['hatches'][0]}; `);
// console.log(`hatches: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['hatches'][1]}; `);
// console.log(`rothkoStroke: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['rothkoStroke']}; `);
// console.log(`dirtline: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['dirtline']}; `);
// console.log(`dirtCircles: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['dirtCircles']}; `);
console.groupEnd();
// console.log(`Number of grids: %c${NUMBER_OF_GRIDS}`, 'font-weight: bold');
// console.log(`Brush size: %c${BRUSHSIZELABEL}`, 'font-weight: bold');
// console.log(`Brush full speed label: %c${BRUSHFULLSPEEDLABEL}`, 'font-weight: bold');
// console.log(`Distance between lines: %c${DISTANCE_BETWEEN_LINES_LABEL}`, 'font-weight: bold');
// console.log(`Background noise: %c${ROTHKOSTROKEOPACITYLABEL}`, 'font-weight: bold');
// console.log(`Brush shape: %c${BRUSHSHAPE}`, 'font-weight: bold');
// console.log('');

// // console.log(`Brush size: %c${BRUSHSIZEMIN}-${BRUSHSIZEMAX}`, 'font-weight: bold');
// console.log(`Brush full speed: %c${BRUSHFULLSPEED}`, 'font-weight: bold');
// console.log(`Brush fibre size: %c${BRUSHFIBRESIZE}`, 'font-weight: bold');
// console.log(`Brush fibre color noise: %c${BRUSHFIBRECOLORNOISE}`, 'font-weight: bold');
// console.log(`Brush color distort: %c${BRUSHCOLORDISTORT}`, 'font-weight: bold');
// console.log(`Distance between lines: %c${DISTANCE_BETWEEN_LINES}`, 'font-weight: bold');
// console.log(`Rothko stroke opacity: %c${ROTHKOSTROKEOPACITY}`, 'font-weight: bold');
// console.log(`Brush shape: %c${BRUSHSHAPE}`, 'font-weight: bold');
// console.log(`Hatch offset: %c${HATCHOFFSET}`, 'font-weight: bold');
// console.log(`Current pixel density: %c${CURRENTPIXELDENS}`, 'font-weight: bold');
// console.log('');

// this code writes the values to the DOM as an example
// const containero = document.createElement("div")
// containero.innerText = `
//   random hash: ${fxhash} \n
//   some pseudo random values: [${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ... ]\n
// `
// document.body.prepend(containero)

