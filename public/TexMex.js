class TexMex {

    constructor(data) {

        this.buffer = data.buffer;
        this.posX = data.posX;
        this.posY = data.posY;
        this.elementSizeMin = data.elementSizeMin;
        this.elementSizeMax = data.elementSizeMax;
        this.fillColor = data.fillColor;
        this.secondaryFillColor = data.secondaryFillColor;
        this.numberQuantisizer = data.numberQuantisizer;
        this.backgroundColor = data.backgroundColor;

        this.buffer = data.buffer;

        this.area = Math.round(Math.round(this.buffer.width / DOMINANTSIDE * 100) * Math.round(this.buffer.height / DOMINANTSIDE * 100)) / 100;
        // console.log("area: " + this.area);
        this.shapeNumber = Math.round(this.area * 10 * this.numberQuantisizer);  // relative to size
        // console.log("this.shapeNumber:" + this.shapeNumber); // 250 / 500 - quantisizer ist 20

        this.elements = [];

        var fillColor;

        for (var i = 0; i < this.shapeNumber; i++) {

            if (fxrand() > 0.5) {
                fillColor = this.fillColor;
            } else {
                fillColor = this.secondaryFillColor;
            }

            this.elements.push({
                // fillColor: distortColorNew(this.fillColor, this.fillColorNoise),
                fillColor: fillColor, // distortColorNew(this.fillColor, randomGaussian(0, this.fillColorNoise)),
                widthShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                heightShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                // posXEl: getRandomFromInterval(this.margin * this.custom_width, this.custom_width - (this.margin * this.custom_width)),
                // posYEl: getRandomFromInterval(this.margin * this.custom_height, this.custom_height - (this.margin * this.custom_height)),
                // posXRe: getRandomFromInterval(this.margin * this.custom_width, this.custom_width - (this.margin * this.custom_width)),
                // posYRe: getRandomFromInterval(this.margin * this.custom_height, this.custom_height - (this.margin * this.custom_height)),
                posXEl: randomGaussian(this.buffer.width / 8 * 4, this.buffer.width / 2),
                posYEl: randomGaussian(this.buffer.height / 8 * 3, this.buffer.height / 2),
                posXRe: randomGaussian(this.buffer.width / 8 * 4, this.buffer.width / 4),
                posYRe: randomGaussian(this.buffer.height / 8, this.buffer.height / 4),
                posXT1: randomGaussian(this.buffer.width / 8 * 7, this.buffer.width / 6),
                posYT1: randomGaussian(this.buffer.height / 8 * 7, this.buffer.height / 6),
            })
        }
    }

    show() {

        // this.buffer.background(this.backgroundColor);

        // this.buffer.clear();

        for (var element of this.elements) {
            this.buffer.push();
            // this.buffer.translate(-width / 2, -height / 2);
            // this.buffer.translate((this.posX), (this.posY));

            this.buffer.rectMode(CENTER);
            this.buffer.ellipseMode(CENTER);
            this.buffer.noStroke();
            this.buffer.fill(element.fillColor);

            this.buffer.ellipse(element.posXEl, element.posYEl, element.widthShape, element.heightShape);
            this.buffer.rect(element.posXRe, element.posYRe, element.widthShape, element.heightShape);
            this.buffer.triangle(element.posXT1, element.posYT1, element.posXT1 + element.widthShape, element.posYT1, element.posXT1, (element.posYT1 + element.heightShape));
            this.buffer.pop();
        }
        return this.buffer;
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



class Gan {

    constructor(data) {

        this.posX = data.posX;
        this.posY = data.posY;
        this.elementSizeMin = data.elementSizeMin;
        this.elementSizeMax = data.elementSizeMax;
        this.fillColor = data.fillColor;
        this.secondaryFillColor = data.secondaryFillColor;
        this.fillColorNoise = data.fillColorNoise;
        this.fillColorOpacity = data.fillColorOpacity;
        this.numberQuantisizer = data.numberQuantisizer;

        this.buffer = createGraphics(100, 100);

        this.area = Math.round(Math.round(this.buffer.width / DOMINANTSIDE * 100) * Math.round(this.buffer.height / DOMINANTSIDE * 100)) / 100;
        // console.log("area: " + this.area);
        this.shapeNumber = Math.round(this.area * 10 * this.numberQuantisizer);  // relative to size
        // console.log("this.shapeNumber:" + this.shapeNumber); // 250 / 500 - quantisizer ist 20

        this.elements = [];
        this.fillColor = color(red(this.fillColor), green(this.fillColor), blue(this.fillColor), this.fillColorOpacity);

        for (var i = 0; i < this.shapeNumber; i++) {

            this.elements.push({
                // fillColor: distortColorNew(this.fillColor, this.fillColorNoise),
                fillColor: distortColorNew(this.fillColor, randomGaussian(0, this.fillColorNoise)),
                secondaryFillColor: this.secondaryFillColor,
                widthShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                heightShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                // posXEl: getRandomFromInterval(this.margin * this.custom_width, this.custom_width - (this.margin * this.custom_width)),
                // posYEl: getRandomFromInterval(this.margin * this.custom_height, this.custom_height - (this.margin * this.custom_height)),
                // posXRe: getRandomFromInterval(this.margin * this.custom_width, this.custom_width - (this.margin * this.custom_width)),
                // posYRe: getRandomFromInterval(this.margin * this.custom_height, this.custom_height - (this.margin * this.custom_height)),
                posXEl: randomGaussian(this.buffer.width / 8, this.buffer.width / 2),
                posYEl: randomGaussian(this.buffer.height / 8, this.buffer.height / 2),
                posXRe: randomGaussian(this.buffer.width / 2, this.buffer.width),
                posYRe: randomGaussian(this.buffer.height / 2, this.buffer.height),
                posXT1: randomGaussian(this.buffer.width / 5, this.buffer.width / 2),
                posYT1: randomGaussian(this.buffer.height / 5, this.buffer.height / 2),
            })
        }
    }

    show() {

        // this.buffer.clear();

        for (var element of this.elements) {
            this.buffer.push();
            // this.buffer.translate(-width / 2, -height / 2);
            // this.buffer.translate((this.posX), (this.posY));
            if (fxrand() > 0.3) {
                this.buffer.fill(element.fillColor);
            } else {
                this.buffer.fill(element.secondaryFillColor);
            }
            // this.buffer.noFill();
            this.buffer.rectMode(CENTER);
            this.buffer.ellipseMode(CENTER);
            this.buffer.noStroke();

            this.buffer.ellipse(element.posXEl, element.posYEl, element.widthShape, element.heightShape);
            this.buffer.rect(element.posXRe, element.posYRe, element.widthShape, element.heightShape);
            this.buffer.triangle(element.posXT1, element.posYT1, element.posXT1 + element.widthShape, element.posYT1, element.posXT1, (element.posYT1 + element.heightShape));
            this.buffer.pop();
        }
        return this.buffer;
    }
}