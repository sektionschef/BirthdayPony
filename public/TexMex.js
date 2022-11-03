class TexMex {

    constructor(data) {

        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
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
        this.backgroundColor = data.backgroundColor;

        this.buffer = createGraphics(this.custom_width, this.custom_height, "WEGBL");

        this.area = Math.round(Math.round(this.custom_width / DOMINANTSIDE * 100) * Math.round(this.custom_height / DOMINANTSIDE * 100)) / 100;
        // console.log("area: " + this.area);
        this.shapeNumber = Math.round(this.area * 10 * this.numberQuantisizer);  // relative to size
        // console.log("this.shapeNumber:" + this.shapeNumber); // 250 / 500 - quantisizer ist 20

        this.elements = [];
        this.fillColor = color(red(this.fillColor), green(this.fillColor), blue(this.fillColor), this.fillColorOpacity);
        this.strokeColor = color(red(this.strokeColor), green(this.strokeColor), blue(this.strokeColor), this.strokeOpacity);

        for (var i = 0; i < this.shapeNumber; i++) {

            this.elements.push({
                // fillColor: distortColorNew(this.fillColor, this.fillColorNoise),
                fillColor: distortColorNew(this.fillColor, randomGaussian(0, this.fillColorNoise)),
                widthShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                heightShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                strokeWeight: this.strokeWeight,
                strokeColor: distortColorNew(this.strokeColor, this.strokeColorNoise),
                // posXEl: getRandomFromInterval(this.margin * this.custom_width, this.custom_width - (this.margin * this.custom_width)),
                // posYEl: getRandomFromInterval(this.margin * this.custom_height, this.custom_height - (this.margin * this.custom_height)),
                // posXRe: getRandomFromInterval(this.margin * this.custom_width, this.custom_width - (this.margin * this.custom_width)),
                // posYRe: getRandomFromInterval(this.margin * this.custom_height, this.custom_height - (this.margin * this.custom_height)),
                posXEl: randomGaussian(this.custom_width / 8, this.custom_width / 2),
                posYEl: randomGaussian(this.custom_height / 8, this.custom_height / 2),
                posXRe: randomGaussian(this.custom_width / 2, this.custom_width),
                posYRe: randomGaussian(this.custom_height / 2, this.custom_height),
                posXT1: randomGaussian(this.custom_width / 5, this.custom_width / 2),
                posYT1: randomGaussian(this.custom_height / 5, this.custom_height / 2),
            })
        }
    }

    show() {

        // this.buffer.background(this.backgroundColor);

        for (var element of this.elements) {
            this.buffer.push();
            // this.buffer.translate(-width / 2, -height / 2);
            // this.buffer.translate((this.posX), (this.posY));
            this.buffer.fill(element.fillColor);
            // this.buffer.noFill();
            this.buffer.rectMode(CENTER);
            this.buffer.ellipseMode(CENTER);
            if (this.noStroke == true) {
                this.buffer.noStroke();
            } else {
                this.buffer.strokeWeight(element.strokeWeight);
                this.buffer.stroke(element.strokeColor);
            }

            this.buffer.ellipse(element.posXEl, element.posYEl, element.widthShape, element.heightShape);
            this.buffer.rect(element.posXRe, element.posYRe, element.widthShape, element.heightShape);
            this.buffer.triangle(element.posXT1, element.posYT1, element.posXT1 + element.widthShape, element.posYT1, element.posXT1, (element.posYT1 + element.heightShape));
            this.buffer.pop();
        }
    }

}

class TexMexSystem {
    constructor() {
        this.texes = [];
    }

    add(tex) {
        tex.show();
        this.texes.push(tex);
    }

    show() {
        for (var tex of this.texes) {
            push();
            translate(-width / 2, -height / 2);
            image(tex.buffer, tex.posX, tex.posY, tex.buffer.width, tex.buffer.height);
            pop();
        }

    }
}