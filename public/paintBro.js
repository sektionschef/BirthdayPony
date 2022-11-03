class paintBro {

    constructor(data) {

        this.buffer = data.buffer;
        this.posX = data.posX;
        this.posY = data.posY;
        this.elementSizeMin = data.elementSizeMin;
        this.elementSizeMax = data.elementSizeMax;
        this.fillColor = data.fillColor;
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
        this.shapeNumber = Math.round(this.area * 10 * this.numberQuantisizer);  // relative to size
        // console.log("this.shapeNumber:" + this.shapeNumber); // 250 / 500 - quantisizer ist 20

        this.elements = [];
        this.fillColor = color(red(this.fillColor), green(this.fillColor), blue(this.fillColor), this.fillColorOpacity);
        this.strokeColor = color(red(this.strokeColor), green(this.strokeColor), blue(this.strokeColor), this.strokeOpacity);

        for (var i = 0; i < this.shapeNumber; i++) {

            this.elements.push({
                strokeColor: this.strokeColor,
                fillColor: distortColorNew(this.fillColor, this.fillColorNoise),
                widthShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                heightShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
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

        for (var element of this.elements) {
            this.buffer.fill(element.fillColor);
            this.buffer.rectMode(CENTER);
            this.buffer.ellipseMode(CENTER);
            // this.buffer.translate((this.posX), (this.posY));
            // this.buffer.rotate(element.angle)
            if (this.noStroke == true) {
                this.buffer.noStroke();
            } else {
                this.buffer.strokeWeight(strokeWeight);
                this.buffer.stroke(element.strokeColor);
            }

            angle = getRandomFromInterval(0, 2 * PI);
            // angle = getRandomFromInterval(0, PI / 4);


            if (fxrand() < 0.5) {  // X movement
                for (var i = 0; i < 30; i++) {
                    this.buffer.rotate(angle);
                    this.buffer.rect(element.posXRe + i, element.posYRe, element.widthShape, element.heightShape);
                    this.buffer.ellipse(element.posXRe, element.posYRe + i, element.widthShape / 2, element.heightShape / 2);
                }
            } else {  // Y movement
                for (var i = 0; i < 30; i++) {
                    this.buffer.rotate(angle);
                    this.buffer.rect(element.posXRe, element.posYRe + i, element.widthShape, element.heightShape);
                    this.buffer.ellipse(element.posXRe, element.posYRe + i, element.widthShape / 2, element.heightShape / 2);
                }
            }

        }
        this.buffer.pop();


        return this.buffer;
    }
}