class paintBro {

    constructor(data) {

        this.buffer = data.buffer;
        this.elementSizeMin = Math.round(data.elementSizeMin);
        this.elementSizeMax = Math.round(data.elementSizeMax);
        this.noStroke = data.noStroke;
        this.strokeColor = data.strokeColor;
        this.strokeWeight = data.strokeWeight;
        this.strokeColorNoise = data.strokeColorNoise;
        this.strokeOpacity = data.strokeOpacity;
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
        var colorNumber;

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
            // console.log(colorNumber);

            // default case - no Level
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

                if (insidePolygon([posX, posY], currentPolygon)) {
                    insidePolygonSwitchC = true;
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
                if (insidePolygon([posX, posY], currentPolygon) && insidePolygonSwitchB == false) {
                    insidePolygonSwitchB = true;
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
                if (insidePolygon([posX, posY], currentPolygon) && insidePolygonSwitchA == false) {
                    insidePolygonSwitchA = true;
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
            // if (insidePolygon([posX, posY], currentPolygon)) {
            //     sunPolygonSwitch = true;
            // }

            // if (sunPolygonSwitch) {
            //     // elementFillColor = highlightColor(fillColor);
            // }

            this.elements.push({
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

    show() {

        let angle;
        let distort;
        let step = Math.round(0.002 * DOMINANTSIDE * 100) / 100;  // movement of element

        for (var e = 0; e < this.elements.length; e++) {
            // if ((fxrand() < 0.9) && (e > this.shapeNumber / 2)) {
            // console.log(insidePolygon(point, PolyProto));

            // static one
            // if (this.elements[e].posX > 230 && this.elements[e].posX < 330 && this.elements[e].posY > 550 && this.elements[e].posY < 750) {

            this.buffer.fill(this.elements[e].elementFillColor);
            this.buffer.rectMode(CENTER);
            this.buffer.ellipseMode(CENTER);
            // this.buffer.translate((this.posX), (this.posY));
            // this.buffer.rotate(this.elements[e].angle)
            if (this.noStroke == true) {
                this.buffer.noStroke();
            } else {
                this.buffer.strokeWeight(strokeWeight);
                this.buffer.stroke(this.elements[e].elementStrokeColor);
            }

            // angle = getRandomFromInterval(0, PI / 4);

            if (fxrand() < 0.25) {
                this.orientation = getRandomFromList(["vertical"])
            } else {
                this.orientation = getRandomFromList(["horizontal"])
            }

            for (var i = 0; i < 60; i++) {
                // for (var i = 0; i < 60; i += 5) {
                this.buffer.push();

                // angle = getRandomFromInterval(PI, 2 * PI);
                angle = getRandomFromInterval(0, 2 * PI);
                // angle = getRandomFromList([PI / 2, PI / 3, PI / 4, PI / 5])
                distort = Math.round(getRandomFromInterval(-0.01, 0.01) * DOMINANTSIDE);

                if (this.orientation == "horizontal") {  // X movement
                    this.buffer.translate(this.elements[e].posX + i * step + distort, this.elements[e].posY + distort)
                } else {  // Y movement
                    this.buffer.translate(this.elements[e].posX + distort, this.elements[e].posY + i * step + distort)
                }
                this.buffer.rotate(angle);
                this.buffer.rect(0, 0, this.elements[e].widthShape, this.elements[e].heightShape);
                this.buffer.pop();
                //     }
                //     for (var i = 0; i < 60; i++) {
                //         this.buffer.push();
                //         this.buffer.translate(element.posX, element.posY + i);
                //         this.buffer.rotate(angle);
                //         this.buffer.rect(0, 0, element.widthShape, element.heightShape);
                //         // this.buffer.ellipse(0, 0, element.widthShape / 2, element.heightShape / 2);
                //         this.buffer.pop();
                //     }
            }
        }
    }
}
