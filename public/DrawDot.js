class DrawDots {
    constructor() {
        // z value is missing - with light
        this.margin = 0.1;
        this.dotCount = 7;
        this.dots = []

        this.randomPoolXstart = Math.round(DOMINANTSIDE * this.margin);
        this.randomPoolXstop = Math.round(width - DOMINANTSIDE * this.margin);
        this.randomPoolYstart = Math.round(DOMINANTSIDE * this.margin);
        this.randomPoolYstop = Math.round(height - DOMINANTSIDE * this.margin);

        var dotX;
        var dotY;
        var dotZ;

        for (var i = 0; i <= this.dotCount; i++) {

            dotX = Math.round(getRandomFromInterval(this.randomPoolXstart, this.randomPoolXstop));
            dotY = Math.round(getRandomFromInterval(this.randomPoolYstart, this.randomPoolYstop));
            dotZ = 0;

            this.dots.push(createVector(dotX, dotY, dotZ));
        }
        // console.log(this.dots);

        this.show();
    }


    show() {
        for (var point of this.dots) {
            console.log(point.y);
        }

    }

}