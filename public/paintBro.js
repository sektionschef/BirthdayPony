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

        // this.buffer.translate(-width / 2, -height / 2);
        this.buffer.push();

        for (var e = 0; e < this.elements.length; e++) {
            // if ((fxrand() < 0.7) && (e > this.shapeNumber / 2)) {
            if ((fxrand() < 0.5)) {
                this.buffer.fill(this.elements[e].fillColor);
            } else {
                this.buffer.fill(this.secondaryFillColor);
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


            for (var i = 0; i < 60; i++) {
                this.buffer.push();
                angle = getRandomFromInterval(PI, 2 * PI);
                // if (fxrand() < 0.5) {  // X movement
                this.buffer.translate(this.elements[e].posXRe + i, this.elements[e].posYRe)
                this.buffer.rotate(angle);
                this.buffer.rect(0, 0, this.elements[e].widthShape, this.elements[e].heightShape);
                this.buffer.pop();
                // } else {  // Y movement
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
        this.buffer.pop();


        return this.buffer;
    }
}