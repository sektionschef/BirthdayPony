class DrawDots {
    constructor() {
        // z value is missing - with light
        this.margin = 0.05;
        this.dotCount = 7;
        this.dots = []

        this.randomPoolXstart = Math.round(DOMINANTSIDE * this.margin);
        this.randomPoolXstop = Math.round(width - DOMINANTSIDE * this.margin);
        this.randomPoolYstart = Math.round(DOMINANTSIDE * this.margin);
        this.randomPoolYstop = Math.round(height - DOMINANTSIDE * this.margin);

        var dotX;
        var dotY;
        var dotZ;

        for (var i = 0; i < this.dotCount; i++) {

            dotX = Math.round(getRandomFromInterval(this.randomPoolXstart, this.randomPoolXstop));
            dotY = Math.round(getRandomFromInterval(this.randomPoolYstart, this.randomPoolYstop));
            dotZ = 0;

            this.dots.push(createVector(dotX, dotY, dotZ));
        }

        this.dots.sort(function (a, b) { return a.y - b.y });
        // console.log(this.dots);

        this.addBrushsystem(brushSystem);
    }

    addBrushsystem(system) {
        var currentPointX;
        var currentPointY;
        var currentPointZ;

        var nextPointX;
        var nextPointY;
        var nextPointZ;

        for (var i = 0; i < (this.dots.length - 1); i++) {

            currentPointX = Math.round(this.dots[i].x / width * DOMINANTSIDE);
            currentPointY = Math.round(this.dots[i].y / height * DOMINANTSIDE);
            currentPointZ = Math.round(this.dots[i].z);

            nextPointX = Math.round(this.dots[i + 1].x / width * DOMINANTSIDE);
            nextPointY = Math.round(this.dots[i + 1].y / height * DOMINANTSIDE);
            nextPointZ = Math.round(this.dots[i + 1].z);

            system.add(new Brush(createVector(currentPointX, currentPointY, currentPointZ), createVector(nextPointX, nextPointY, nextPointZ), color("black")))
        }

    }


    show() {

        if (MODE > 1) {
            push();
            translate(-width / 2, -height / 2);
            // translate(this.randomPoolXstart, this.randomPoolYstart);
            noFill();
            strokeWeight(1);
            rectMode(CORNERS);
            rect(this.randomPoolXstart, this.randomPoolYstart, this.randomPoolXstop, this.randomPoolYstop);
            pop();
        }

        if (MODE > 0) {
            var currentPointX;
            var currentPointY;
            var currentPointZ;

            var nextPointX;
            var nextPointY;
            var nextPointZ;

            for (var i = 0; i < (this.dots.length - 1); i++) {

                currentPointX = Math.round(this.dots[i].x / width * DOMINANTSIDE);
                currentPointY = Math.round(this.dots[i].y / height * DOMINANTSIDE);
                currentPointZ = Math.round(this.dots[i].z);

                nextPointX = Math.round(this.dots[i + 1].x / width * DOMINANTSIDE);
                nextPointY = Math.round(this.dots[i + 1].y / height * DOMINANTSIDE);
                nextPointZ = Math.round(this.dots[i + 1].z);

                if (MODE > 1) {
                    push();
                    translate(-width / 2, -height / 2);


                    line(currentPointX, currentPointY, currentPointZ, nextPointX, nextPointY, nextPointZ)
                    ellipse(currentPointX, currentPointY, 10)
                    pop();
                }
            }
        }

    }

}