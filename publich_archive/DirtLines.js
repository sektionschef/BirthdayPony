class dirtLines {

    constructor(data) {

        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.margin = data.margin;
        this.pos = createVector(data.posX, data.posY);
        this.strokeColor = data.strokeColor;
        this.strokeWeight = data.strokeWeight;
        this.strokeColorNoise = data.strokeColorNoise;
        this.numberQuantisizer = data.numberQuantisizer;
        this.length = data.length;

        this.area = this.custom_width * this.custom_height;
        this.shapeNumber = Math.round(Math.round(this.custom_width / width * 100) * Math.round(this.custom_height / height * 100)) / 100 * this.numberQuantisizer;  // relative to size

        this.elements = [];

        for (var i = 0; i < this.shapeNumber; i++) {

            this.start = createVector(getP5RandomFromInterval((0 + this.margin), (this.custom_width - this.margin)), getP5RandomFromInterval((0 + this.margin), (this.custom_height - this.margin)));
            this.end = p5.Vector.add(this.start, createVector(getP5RandomFromInterval(-this.length, this.length), getP5RandomFromInterval(-this.length, this.length)));

            this.elements.push({
                strokeColor: distortColorNew(this.strokeColor, this.strokeColorNoise, false),
                strokeWeight: this.strokeWeight,
                start: this.start,
                end: this.end
            })
        }
    }

    show() {

        push();
        translate(this.pos.x, this.pos.y);

        for (var element of this.elements) {
            stroke(element.strokeColor);
            strokeWeight(element.strokeWeight);
            line(element.start.x, element.start.y, element.end.x, element.end.y);
        }
        pop();

        if (MODE >= 5) {
            push();
            noFill();
            strokeWeight(2);
            stroke("#000000");
            rectMode(CENTER);
            rect(0, 0, this.custom_width - this.margin * 2, this.custom_height - this.margin * 2);
            pop();
        }
    }

}
