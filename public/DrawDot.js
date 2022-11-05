class DrawDots {
    constructor(startLeft = true) {
        this.margin = 0.05;
        this.dotCount = 5;

        this.dots = []
        this.startLeft = startLeft


        this.randomPoolXstartLeft = Math.round(-DOMINANTSIDE * this.margin * 5);
        this.randomPoolXstopLeft = Math.round(-DOMINANTSIDE * this.margin);
        this.randomPoolXstartRight = Math.round(width + DOMINANTSIDE * this.margin);
        this.randomPoolXstopRight = Math.round(width + DOMINANTSIDE * this.margin * 5);
        this.randomPoolYstart = Math.round((-DOMINANTSIDE * this.margin));
        this.randomPoolYstop = Math.round(height + DOMINANTSIDE * this.margin);
        this.Ystep = (this.randomPoolYstop - this.randomPoolYstart) / this.dotCount;
        // console.log("Ystep: " + this.Ystep);

        var dotX;
        var dotY;
        var dotZ;

        for (var i = 0; i < this.dotCount; i++) {
            if (i % 2 == 0 || i == 0) {
                if (this.startLeft) {
                    dotX = Math.round(getRandomFromInterval(this.randomPoolXstartLeft, this.randomPoolXstopLeft));
                } else {
                    dotX = Math.round(getRandomFromInterval(this.randomPoolXstartRight, this.randomPoolXstopRight));
                }
            } else {
                if (this.startLeft) {
                    dotX = Math.round(getRandomFromInterval(this.randomPoolXstartRight, this.randomPoolXstopRight));
                } else {
                    dotX = Math.round(getRandomFromInterval(this.randomPoolXstartLeft, this.randomPoolXstopLeft));
                }
            }
            dotY = Math.round(getRandomFromInterval(this.randomPoolYstart + this.Ystep * i, this.randomPoolYstart + this.Ystep * (i + 1)));
            dotZ = 0;

            this.dots.push(createVector(dotX, dotY, dotZ));
        }

        // sort by Y position
        // dotY.sort(function (a, b) { return a.y - b.y });

        // console.log(this.dots[2].y);

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

            // system.add(new Brush(createVector(currentPointX, currentPointY, currentPointZ), createVector(nextPointX, nextPointY, nextPointZ), color("#f55442")))
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

                if (MODE > 0) {
                    push();
                    translate(-width / 2, -height / 2);

                    if (this.startLeft) {
                        stroke("blue");
                    } else {
                        stroke("red");
                    }

                    line(currentPointX, currentPointY, currentPointZ, nextPointX, nextPointY, nextPointZ)
                    if (this.startLeft) {
                        fill("blue");
                    } else {
                        fill("red");
                    }
                    noStroke();
                    ellipse(currentPointX, currentPointY, 10)
                    pop();
                }
            }
        }

    }

}