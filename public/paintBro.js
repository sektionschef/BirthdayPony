class paintBro {

    constructor(data) {

        this.buffer = data.buffer;
        this.posX = data.posX;
        this.posY = data.posY;
        this.elementSizeMin = data.elementSizeMin;
        this.elementSizeMax = data.elementSizeMax;
        this.fillColor = data.fillColor;
        this.secondaryFillColor = data.secondaryFillColor;
        this.fillColorNoise = data.fillColorNoise;
        this.fillColorOpacity = data.fillColorOpacity;
        this.noStroke = data.noStroke;
        this.strokeColor = data.strokeColor;
        this.strokeWeight = data.strokeWeight;
        this.strokeColorNoise = data.strokeColorNoise;
        this.strokeOpacity = data.strokeOpacity;
        this.numberQuantisizer = data.numberQuantisizer;

        this.area = Math.round(Math.round(this.buffer.width / DOMINANTSIDE * 100) * Math.round(this.buffer.height / DOMINANTSIDE * 100)) / 100;
        // console.log("area: " + this.area);
        this.shapeNumber = Math.round(this.area * this.numberQuantisizer);  // relative to size
        // console.log("this.shapeNumber:" + this.shapeNumber); // 250 / 500 - quantisizer ist 20

        this.elements = [];
        this.fillColor = color(red(this.fillColor), green(this.fillColor), blue(this.fillColor), this.fillColorOpacity);
        this.secondaryFillColor = color(red(this.secondaryFillColor), green(this.secondaryFillColor), blue(this.secondaryFillColor), this.fillColorOpacity);
        this.strokeColor = color(red(this.strokeColor), green(this.strokeColor), blue(this.strokeColor), this.strokeOpacity);

        for (var i = 0; i < this.shapeNumber; i++) {

            this.elements.push({
                strokeColor: this.strokeColor,
                fillColor: distortColorNew(this.fillColor, this.fillColorNoise),
                // widthShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                // heightShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                widthShape: map(i, 0, this.shapeNumber, this.elementSizeMax, this.elementSizeMin),
                heightShape: map(i, 0, this.shapeNumber, this.elementSizeMax, this.elementSizeMin),
                strokeSize: this.strokeWeight,
                strokeColor: distortColorNew(this.strokeColor, this.strokeColorNoise),
                posXRe: getRandomFromInterval(0, this.buffer.width),
                posYRe: getRandomFromInterval(0, this.buffer.height),
            })
        }
    }

    show() {

        let angle;
        let distort;
        var currentPolygon;

        // this.buffer.translate(-width / 2, -height / 2);
        // this.buffer.push();

        for (var e = 0; e < this.elements.length; e++) {
            // if ((fxrand() < 0.9) && (e > this.shapeNumber / 2)) {
            // console.log(insidePolygon(point, PolyProto));

            // static one
            // if (this.elements[e].posXRe > 230 && this.elements[e].posXRe < 330 && this.elements[e].posYRe > 550 && this.elements[e].posYRe < 750) {

            for (var p = 0; p < dotSystem.polygons.length; p++) {

                currentPolygon = [
                    [dotSystem.polygons[p][0].x, dotSystem.polygons[p][0].y,],
                    [dotSystem.polygons[p][1].x, dotSystem.polygons[p][1].y,],
                    [dotSystem.polygons[p][2].x, dotSystem.polygons[p][2].y,],
                    [dotSystem.polygons[p][3].x, dotSystem.polygons[p][3].y,],
                ]

                if (insidePolygon([this.elements[e].posXRe, this.elements[e].posYRe], currentPolygon)) {
                    if ((fxrand() < 0.5)) {
                        this.buffer.fill(color("#f5544215"));
                    } else {
                        this.buffer.fill(color("#db443318"));
                    }
                } else {
                    if ((fxrand() < 0.5)) {
                        this.buffer.fill(this.elements[e].fillColor);
                    } else {
                        this.buffer.fill(this.secondaryFillColor);
                    }
                }
            }
            this.buffer.rectMode(CENTER);
            this.buffer.ellipseMode(CENTER);
            // this.buffer.translate((this.posX), (this.posY));
            // this.buffer.rotate(this.elements[e].angle)
            if (this.noStroke == true) {
                this.buffer.noStroke();
            } else {
                this.buffer.strokeWeight(strokeWeight);
                this.buffer.stroke(this.elements[e].strokeColor);
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
                distort = getRandomFromInterval(-10, 10);

                if (this.orientation == "horizontal") {  // X movement
                    this.buffer.translate(this.elements[e].posXRe + i + distort, this.elements[e].posYRe + distort)
                } else {  // Y movement
                    this.buffer.translate(this.elements[e].posXRe + distort, this.elements[e].posYRe + i + distort)
                }
                this.buffer.rotate(angle);
                this.buffer.rect(0, 0, this.elements[e].widthShape, this.elements[e].heightShape);
                this.buffer.pop();
                //     }
                //     for (var i = 0; i < 60; i++) {
                //         this.buffer.push();
                //         this.buffer.translate(element.posXRe, element.posYRe + i);
                //         this.buffer.rotate(angle);
                //         this.buffer.rect(0, 0, element.widthShape, element.heightShape);
                //         // this.buffer.ellipse(0, 0, element.widthShape / 2, element.heightShape / 2);
                //         this.buffer.pop();
                //     }
            }

        }
        // this.buffer.pop();


        return this.buffer;
    }
}