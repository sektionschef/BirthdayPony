class paintBro {

    constructor(data) {

        this.buffer = data.buffer;
        this.elementSizeMin = data.elementSizeMin;
        this.elementSizeMax = data.elementSizeMax;
        this.noStroke = data.noStroke;
        this.strokeColor = data.strokeColor;
        this.strokeWeight = data.strokeWeight;
        this.numberQuantisizer = data.numberQuantisizer;
        this.brushLength = data.brushLength;
        this.distortionFactor = data.distortionFactor;
        this.stepSize = data.stepSize;

        var currentPolygon;
        let posX;
        let posY;
        var elementFillColor;
        var elementStrokeColor;
        var insidePolygonSwitchA;
        var insidePolygonSwitchB;
        var insidePolygonSwitchC;
        var sunPolygonSwitch;
        var colorNumber;  // which color to choose first or second
        var elementLayer;
        var orientation;
        var distort;
        var step;
        let posBX;
        let posBY;

        this.elements = [];

        this.area = Math.round(Math.round(this.buffer.width / DOMINANTSIDE * 100) * Math.round(this.buffer.height / DOMINANTSIDE * 100)) / 100;
        // console.log("area: " + this.area);
        this.shapeNumber = Math.round(this.area * this.numberQuantisizer);  // relative to size
        // console.log("this.shapeNumber:" + this.shapeNumber); // 250 / 500 - quantisizer ist 20
        step = getRandomFromList([-this.stepSize, this.stepSize]);  // movement of element

        this.buffer.background(color(PALETTE.background));

        for (var i = 0; i < this.shapeNumber; i++) {
            posX = getRandomFromInterval(0, this.buffer.width);
            posY = getRandomFromInterval(0, this.buffer.height);

            // which colors to choose
            colorNumber = getRandomFromList(["first", "second"]);

            // direction of brush stroke
            if (fxrand() < 0.25) {
                orientation = "vertical";
            } else {
                orientation = "horizontal";
            }

            for (var b = 0; b < this.brushLength; b++) {

                insidePolygonSwitchA = false;
                insidePolygonSwitchB = false;
                insidePolygonSwitchC = false;
                sunPolygonSwitch = false;

                distort = getRandomFromInterval(-this.distortionFactor, this.distortionFactor);

                // horizontal or vertical movement
                if (orientation == "horizontal") {
                    posBX = posX + b * step + distort * b;
                    posBY = posY + distort;
                } else {
                    posBX = posX + distort;
                    posBY = posY + b * step + distort * b;
                }
                // console.log(posBX);

                // default case - base Level
                elementLayer = "base";
                if (colorNumber == "first") {
                    elementFillColor = color(PALETTE.base.fillFirst); // distortColorNew(this.fillColor, this.fillColorNoise);
                    elementStrokeColor = color(PALETTE.base.strokeFirst);
                } else {
                    elementFillColor = color(PALETTE.base.fillSecond); // distortColorNew(this.secondaryFillColor, this.fillColorNoise);
                    elementStrokeColor = color(PALETTE.base.strokeSecond);
                }

                // C Level
                for (var p = 0; p < dotSystem.polygonsC.length; p++) {

                    currentPolygon = [
                        [dotSystem.polygonsC[p][0].x, dotSystem.polygonsC[p][0].y,],
                        [dotSystem.polygonsC[p][1].x, dotSystem.polygonsC[p][1].y,],
                        [dotSystem.polygonsC[p][2].x, dotSystem.polygonsC[p][2].y,],
                        [dotSystem.polygonsC[p][3].x, dotSystem.polygonsC[p][3].y,],
                    ]

                    if (pointInPolygon(currentPolygon, [posBX, posBY])) {
                        insidePolygonSwitchC = true;
                        elementLayer = "cLevel";
                    }
                }

                if (insidePolygonSwitchC) {
                    if (colorNumber == "first") {
                        elementFillColor = color(PALETTE.cLevel.fillFirst);
                        elementStrokeColor = color(PALETTE.cLevel.strokeFirst);

                    } else {
                        elementFillColor = color(PALETTE.cLevel.fillSecond);
                        elementStrokeColor = color(PALETTE.cLevel.strokeSecond);
                    }
                }

                // B Level
                for (var p = 0; p < dotSystem.polygonsB.length; p++) {

                    currentPolygon = [
                        [dotSystem.polygonsB[p][0].x, dotSystem.polygonsB[p][0].y,],
                        [dotSystem.polygonsB[p][1].x, dotSystem.polygonsB[p][1].y,],
                        [dotSystem.polygonsB[p][2].x, dotSystem.polygonsB[p][2].y,],
                        [dotSystem.polygonsB[p][3].x, dotSystem.polygonsB[p][3].y,],
                    ]
                    if (pointInPolygon(currentPolygon, [posBX, posBY])) {
                        insidePolygonSwitchB = true;
                        elementLayer = "bLevel";
                    }
                }
                if (insidePolygonSwitchB) {
                    if (colorNumber == "first") {
                        elementFillColor = color(PALETTE.bLevel.fillFirst);
                        elementStrokeColor = color(PALETTE.bLevel.strokeFirst);

                    } else {
                        elementFillColor = color(PALETTE.bLevel.fillSecond);
                        elementStrokeColor = color(PALETTE.bLevel.strokeSecond);
                    }
                }

                // A Level
                for (var p = 0; p < dotSystem.polygonsA.length; p++) {

                    currentPolygon = [
                        [dotSystem.polygonsA[p][0].x, dotSystem.polygonsA[p][0].y,],
                        [dotSystem.polygonsA[p][1].x, dotSystem.polygonsA[p][1].y,],
                        [dotSystem.polygonsA[p][2].x, dotSystem.polygonsA[p][2].y,],
                        [dotSystem.polygonsA[p][3].x, dotSystem.polygonsA[p][3].y,],
                    ]
                    // console.warn(fxrand());
                    if (pointInPolygon(currentPolygon, [posBX, posBY])) {
                        insidePolygonSwitchA = true;
                        elementLayer = "aLevel";
                    }
                }
                if (insidePolygonSwitchA) {
                    if (colorNumber == "first") {
                        elementFillColor = color(PALETTE.aLevel.fillFirst);
                        elementStrokeColor = color(PALETTE.aLevel.strokeFirst);

                    } else {
                        elementFillColor = color(PALETTE.aLevel.fillSecond);
                        elementStrokeColor = color(PALETTE.aLevel.strokeSecond);
                    }
                }

                // S Level
                currentPolygon = [
                    [sunPolygon[0].x, sunPolygon[0].y,],
                    [sunPolygon[1].x, sunPolygon[1].y,],
                    [sunPolygon[2].x, sunPolygon[2].y,],
                    [sunPolygon[3].x, sunPolygon[3].y,],
                ]

                // console.log(currentPolygon);
                if (pointInPolygon(currentPolygon, [posBX, posBY])) {
                    sunPolygonSwitch = true;
                }

                if (sunPolygonSwitch) {
                    // elementFillColor = highlightColor(fillColor);
                }

                this.elements.push({
                    elementLayer: elementLayer,
                    elementFillColor: elementFillColor,
                    widthShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                    heightShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                    // widthShape: Math.round(map(i , 0, this.shapeNumber, this.elementSizeMax, this.elementSizeMin)),  // STATIC
                    // heightShape: Math.round(map(i, 0, this.shapeNumber, this.elementSizeMax, this.elementSizeMin)),  // STATIC
                    strokeSize: this.strokeWeight,
                    elementStrokeColor: elementStrokeColor, // distortColorNew(this.strokeColor, this.strokeColorNoise),
                    posBX: posBX,
                    posBY: posBY,
                    angle: getRandomFromInterval(0, 2 * PI),
                })
            }

        }
        // console.log(this.elements);
    }

    show(layer) {

        // translate(-width / 2, -height / 2);

        for (var e = 0; e < this.elements.length; e++) {

            // console.error((e) + ": " + this.elements[e].elementLayer);  // 326

            // draw only specific layer
            if ((this.elements[e].elementLayer == layer)) {

                this.buffer.push();
                this.buffer.fill(this.elements[e].elementFillColor);
                this.buffer.rectMode(CENTER);

                this.buffer.strokeWeight(this.strokeWeight);
                this.buffer.stroke(this.elements[e].elementStrokeColor);
                // console.error((e) + ": " + Math.round(fxrand() * 1000) / 1000);  // 326
                this.buffer.translate(this.elements[e].posBX, this.elements[e].posBY)
                this.buffer.rotate(this.elements[e].angle);
                this.buffer.rect(0, 0, this.elements[e].widthShape, this.elements[e].heightShape);

                // this.buffer.image(gan.buffer, 0, 0, this.elements[e].widthShape, this.elements[e].heightShape);

                this.buffer.pop();
            }
        }
    }
}
