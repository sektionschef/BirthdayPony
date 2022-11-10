class paintBro {

    constructor(data) {

        this.buffer = data.buffer;
        this.elementSizeMin = Math.round(data.elementSizeMin);
        this.elementSizeMax = Math.round(data.elementSizeMax);
        this.noStroke = data.noStroke;
        this.strokeColor = data.strokeColor;
        this.strokeWeight = data.strokeWeight;
        this.numberQuantisizer = data.numberQuantisizer;

        var currentPolygon;
        var posX;
        var posY;
        var elementFillColor;
        var elementStrokeColor;
        var insidePolygonSwitchA;
        var insidePolygonSwitchB;
        var insidePolygonSwitchC;
        var sunPolygonSwitch;
        var colorNumber;  // which color to choose first or second
        var elementLayer;

        this.elements = [];

        this.area = Math.round(Math.round(this.buffer.width / DOMINANTSIDE * 100) * Math.round(this.buffer.height / DOMINANTSIDE * 100)) / 100;
        // console.log("area: " + this.area);
        this.shapeNumber = Math.round(this.area * this.numberQuantisizer);  // relative to size
        // console.log("this.shapeNumber:" + this.shapeNumber); // 250 / 500 - quantisizer ist 20

        for (var i = 0; i < this.shapeNumber; i++) {

            insidePolygonSwitchA = false;
            insidePolygonSwitchB = false;
            insidePolygonSwitchC = false;
            sunPolygonSwitch = false;

            posX = getRandomFromInterval(0, 1) * this.buffer.width;
            posY = getRandomFromInterval(0, 1) * this.buffer.height;

            // which colors to choose
            colorNumber = getRandomFromList(["first", "second"]);

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

                if (pointInPolygon([posX, posY], currentPolygon)) {
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
                // console.warn(fxrand());
                if (pointInPolygon([posX, posY], currentPolygon) && insidePolygonSwitchB == false) {
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
                if (pointInPolygon([posX, posY], currentPolygon) && insidePolygonSwitchA == false) {
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

            // // S Level
            // currentPolygon = [
            //     [sunPolygon[0].x, sunPolygon[0].y,],
            //     [sunPolygon[1].x, sunPolygon[1].y,],
            //     [sunPolygon[2].x, sunPolygon[2].y,],
            //     [sunPolygon[3].x, sunPolygon[3].y,],
            // ]

            // // console.log(currentPolygon);
            // if (pointInPolygon([posX, posY], currentPolygon)) {
            //     sunPolygonSwitch = true;
            // }

            // if (sunPolygonSwitch) {
            //     // elementFillColor = highlightColor(fillColor);
            // }

            this.elements.push({
                elementLayer: elementLayer,
                elementFillColor: elementFillColor,
                // widthShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                // heightShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                widthShape: Math.round(map(i, 0, this.shapeNumber, this.elementSizeMax, this.elementSizeMin)),  // STATIC
                heightShape: Math.round(map(i, 0, this.shapeNumber, this.elementSizeMax, this.elementSizeMin)),  // STATIC
                strokeSize: this.strokeWeight,
                elementStrokeColor: elementStrokeColor, // distortColorNew(this.strokeColor, this.strokeColorNoise),
                posX: posX,
                posY: posY,
            })
        }
    }

    show(layer) {

        let angle;
        let distort;
        let step = Math.round(0.002 * DOMINANTSIDE * 100) / 100;  // movement of element

        if (layer == "base") {
            paintBroBuffer.background(color(PALETTE.background));
        }

        for (var e = 0; e < this.elements.length; e++) {

            // console.error((e) + ": " + this.elements[e].elementLayer);  // 326

            if (fxrand() < 0.25) {
                this.orientation = "vertical";
            } else {
                this.orientation = "horizontal";
            }

            // draw only specific layer
            if ((this.elements[e].elementLayer == layer)) {

                this.buffer.fill(this.elements[e].elementFillColor);
                this.buffer.rectMode(CENTER);
                this.buffer.ellipseMode(CENTER);
                // this.buffer.translate((this.posX), (this.posY));
                // this.buffer.rotate(this.elements[e].angle)

                this.buffer.strokeWeight(strokeWeight);
                this.buffer.stroke(this.elements[e].elementStrokeColor);

                // angle = getRandomFromInterval(0, PI / 4);

                // console.error((e) + ": " + Math.round(fxrand() * 1000) / 1000);  // 326

                for (var i = 0; i < 60; i++) {
                    // for (var i = 0; i < 60; i += 5) {

                    this.buffer.push();

                    angle = getP5RandomFromInterval(0, 2 * PI);
                    distort = Math.round(getP5RandomFromInterval(-0.01, 0.01) * DOMINANTSIDE);

                    if (this.orientation == "horizontal") {  // X movement
                        this.buffer.translate(this.elements[e].posX + i * step + distort, this.elements[e].posY + distort)
                    } else {  // Y movement
                        this.buffer.translate(this.elements[e].posX + distort, this.elements[e].posY + i * step + distort)
                    }
                    this.buffer.rotate(angle);
                    this.buffer.rect(0, 0, this.elements[e].widthShape, this.elements[e].heightShape);

                    // this.buffer.image(gan.buffer, 0, 0, this.elements[e].widthShape, this.elements[e].heightShape);

                    this.buffer.pop();
                }
            }
        }
    }
}
