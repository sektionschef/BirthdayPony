class Brush {
    constructor(start, end, colorObject) {
        this.fullspeed = BRUSHFULLSPEED // 2-5;
        this.radiusMin = BRUSHSIZEMIN; // 1;
        this.radiusMax = BRUSHSIZEMAX; // 2;
        this.brushShape = BRUSHSHAPE;
        this.distanceBoost = 4; // 4 faster, 8 slower, but thicker - where the points are
        // this.noiseYzoom = 0.007;  // zoom on noise
        // this.amplitudeNoiseY = 3.5;  // up and down on Y axis
        this.OkLevel = 8;  // some offset is ok.
        this.fillColor = colorObject;
        this.strokeColor = colorObject;
        this.strokeSize = BRUSHFIBRESIZE;  // good one
        this.strokeColorDistort = BRUSHFIBRECOLORNOISE;

        this.start = start;
        this.end = end;

        this.alive = true;
        this.passedA = false;
        this.passedB = false;

        this.pos = this.start.copy();

        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.Distance = p5.Vector.sub(this.end, this.start);
        this.DistanceLength = this.Distance.mag();

        this.distAccSlo = this.DistanceLength / this.distanceBoost;  // distance for acceleration and slow down
        this.boost = this.fullspeed / this.distAccSlo;
        this.checkpointA = p5.Vector.add(this.start, p5.Vector.div(this.Distance, this.distanceBoost));  // distance for full speed
        this.checkpointB = p5.Vector.sub(this.end, p5.Vector.div(this.Distance, this.distanceBoost));  // distance for full speed

        // console.log("accdist: " + this.distAccSlo);
        // console.log("boost: " + this.boost);
        // console.log("step: " + this.distAccSlo / this.boost);

        this.accBoost = p5.Vector.mult(p5.Vector.normalize(this.Distance), this.boost);
        this.sloBoost = p5.Vector.mult(this.accBoost, -1);

        // this.makeSomeNoise();

        this.get_orientation();
    }

    // makeSomeNoise() {
    //     this.noisesY = {};

    //     let ioff = getRandomFromInterval(0, 200);  // start at different location for each line

    //     // Iterate over horizontal pixels
    //     for (let i = this.start; i <= this.end; i++) {
    //         // Calculate a y value according to noise, map to

    //         // console.log(i);
    //         this.noisesY[i] = map(noise(ioff), 0, 1, -this.amplitudeNoiseY, this.amplitudeNoiseY);

    //         // Increment x dimension for noise
    //         ioff += this.noiseYzoom;
    //     }
    // }

    get_orientation() {

        this.acceptanceLevel = PI / 12

        this.angle = p5.Vector.sub(this.end, this.start).heading();

        if (this.angle > -this.acceptanceLevel && this.angle < this.acceptanceLevel) {
            // this.strokeColor = "red";
            this.orientation = "left-right";
        } else if (this.angle > (PI / 4 - this.acceptanceLevel) && this.angle < (PI / 4 + this.acceptanceLevel)) {
            // this.strokeColor = "purple";
            this.orientation = "top/left-bottom/right";
        } else if (this.angle > (PI / 2 - this.acceptanceLevel) && this.angle < (PI / 2 + this.acceptanceLevel)) {
            // this.strokeColor = "green";
            this.orientation = "top-bottom";
        } else if (this.angle < -(PI / 4 - this.acceptanceLevel) && this.angle > -(PI / 4 + this.acceptanceLevel)) {
            // this.strokeColor = "blue";
            this.orientation = "left/bottom-top/right";
        } else {
            if (MODE > 1) {
                console.warn("some noise with this.angle: " + this.angle);
            }
            // throw "no orientation"
            this.alive = false;
        }
    }

    get_status() {

        // SOLUTION WITH TOTAL DISTANCE - achtung kein else if
        // if (this.pos.dist(this.end) <= this.OkLevel) {
        //     this.alive = false;  // reaching the goal of one axis is enough (xy & yx case)
        // } else if (this.pos.dist(this.checkpointA) <= 2) {
        //     this.passedA = true;
        // } else if (this.pos.dist(this.checkpointB) <= 2) {
        //     this.passedB = true;
        // }

        if (this.orientation == "left-right") {
            if (this.pos.x > (this.end.x - this.OkLevel)) {
                this.alive = false;
            }
            if (this.pos.x > this.checkpointA.x) {
                this.passedA = true;
            }
            if (this.pos.x > this.checkpointB.x) {
                this.passedB = true;
            }
        } else if (this.orientation == "top/left-bottom/right") {
            if (this.pos.x > (this.end.x - this.OkLevel) && this.pos.y > (this.end.y - this.OkLevel)) {
                this.alive = false;
            }
            if (this.pos.x > this.checkpointA.x && this.pos.y > this.checkpointA.y) {
                this.passedA = true;
            }
            if (this.pos.x > this.checkpointB.x && this.pos.y > this.checkpointB.y) {
                this.passedB = true;
            }
        } else if (this.orientation == "top-bottom") {
            if (this.pos.y > (this.end.y - this.OkLevel)) {
                this.alive = false;
            }
            if (this.pos.y > this.checkpointA.y) {
                this.passedA = true;
            }
            if (this.pos.y > this.checkpointB.y) {
                this.passedB = true;
            }
        } else if (this.orientation == "left/bottom-top/right") {
            if (this.pos.x > (this.end.x - this.OkLevel) && this.pos.y < (this.end.y + this.OkLevel)) {
                this.alive = false;
            }
            if (this.pos.x > this.checkpointA.x && this.pos.y < this.checkpointA.y) {
                this.passedA = true;
            }
            if (this.pos.x > this.checkpointB.x && this.pos.y < this.checkpointB.y) {
                this.passedB = true;
            }
        } else {

        }

    }

    move() {

        this.get_status();


        if (this.passedA == false) {
            // console.log("accelerate");
            this.acc = this.accBoost;
        } else if (this.passedA == true && this.passedB == false) {
            // console.log("full speed");
            this.acc = createVector(0, 0, 0);
            // this.acc = createVector(getRandomFromInterval(-0.001, 0.001), getRandomFromInterval(-0.001, 0.001), 0);
        } else if (this.passedA == true && this.passedB == true) {
            // console.log("slow down");
            this.acc = this.sloBoost;
        } else if (this.alive == false) {
            // console.log("stop");
            this.acc = createVector(0, 0, 0);
            this.vel = createVector(0, 0, 0);
        }

        this.vel.add(this.acc);
        this.pos.add(this.vel);

        // if (this.orientation == "x") {
        // this.pos.y = this.start2 + this.noisesY[Math.round(mover)];
        // } else if (this.orientation == "y") {
        // this.pos.x = this.start2 + this.noisesY[Math.round(mover)];
        // } else if (this.orientation == "xy") {
        // }
        // MISSING THE NOISE

    }

    update() {

        if (this.alive) {
            this.move();
            if (this.vel.x > 0) {
                // this.radius = map(this.vel.x, 0, 3, 1, 0.3)
                this.radius = Math.round(map(this.vel.x, BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX, this.radiusMax, this.radiusMin) * 100) / 100
            } else if (this.vel.y > 0) {
                // this.radius = map(this.vel.y, 0, 3, 1, 0.3)
                this.radius = Math.round(map(this.vel.y, BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX, this.radiusMax, this.radiusMin) * 100) / 100
            }
        }

    }

    display() {

        if (MODE >= 5) {
            // start
            push();
            // translate(-width / 2, -height / 2);
            translate(this.start);
            noStroke();
            fill("blue");
            ellipse(0, 0, 10);
            pop();

            // accA
            push();
            // translate(-width / 2, -height / 2);
            translate(this.checkpointA);
            noStroke();
            fill("red");
            ellipse(0, 0, 5);
            stroke(5);
            pop();


            // accB
            push();
            // translate(-width / 2, -height / 2);
            translate(this.checkpointB);
            noStroke();
            fill("red");
            ellipse(0, 0, 5);
            pop();


            // end
            push();
            // translate(-width / 2, -height / 2);
            translate(this.end);
            noStroke();
            fill("purple");
            ellipse(0, 0, 10);
            pop();
        }

        if (this.alive) {

            push();
            // translate(-width / 2, -height / 2);
            translate(this.pos);
            if (MODE >= 5) {
                noStroke();
                fill("black");
                ellipse(0, 0, this.radius * 3, this.radius * 3);
            } else {
                // noStroke();
                // strokeWeight(this.strokeSize);
                // stroke(this.strokeColor);
                // noFill();
                // fill(this.fillColor);
                // rotate(frameCount % 3);
                // ellipse(0, 0, this.radius, this.radius);
                // rectMode(CENTER);
                // rect(0, 0, this.radius, this.radius);

                this.drawBrush();
            }
            pop();

        }
    }

    drawBrush() {

        this.brushSize = this.radius;

        push();
        strokeWeight(this.strokeSize);
        for (var i = 0; i <= 5; i++) {
            // stroke(this.strokeColor);
            stroke(distortColorNew(this.strokeColor, this.strokeColorDistort, false))
            if (BRUSHSHAPE == "Line") {
                // line(getRandomFromInterval(-this.brushSize, this.brushSize), getRandomFromInterval(-this.brushSize, this.brushSize), getRandomFromInterval(-this.brushSize, this.brushSize), getRandomFromInterval(-this.brushSize, this.brushSize));
                line(getP5RandomFromInterval(-this.brushSize, this.brushSize), getP5RandomFromInterval(-this.brushSize, this.brushSize), getP5RandomFromInterval(-this.brushSize, this.brushSize), getP5RandomFromInterval(-this.brushSize, this.brushSize));
            } else if (BRUSHSHAPE == "Ellipse") {
                noFill();
                // ellipse(getRandomFromInterval(-this.brushSize, this.brushSize), getRandomFromInterval(-this.brushSize, this.brushSize), getRandomFromInterval(0, this.brushSize / 2), getRandomFromInterval(0, this.brushSize / 2));
                ellipse(getP5RandomFromInterval(-this.brushSize, this.brushSize), getP5RandomFromInterval(-this.brushSize, this.brushSize), getP5RandomFromInterval(0, this.brushSize / 2), getP5RandomFromInterval(0, this.brushSize / 2));
            } else if (BRUSHSHAPE == "Triangle") {
                noFill();
                // triangle(getRandomFromInterval(-this.brushSize, this.brushSize), getRandomFromInterval(-this.brushSize, this.brushSize), getRandomFromInterval(-this.brushSize, this.brushSize), getRandomFromInterval(-this.brushSize, this.brushSize), getRandomFromInterval(-this.brushSize, this.brushSize), getRandomFromInterval(-this.brushSize, this.brushSize),);
                triangle(getP5RandomFromInterval(-this.brushSize, this.brushSize), getP5RandomFromInterval(-this.brushSize, this.brushSize), getP5RandomFromInterval(-this.brushSize, this.brushSize), getP5RandomFromInterval(-this.brushSize, this.brushSize), getP5RandomFromInterval(-this.brushSize, this.brushSize), getP5RandomFromInterval(-this.brushSize, this.brushSize),);
            } else {
                console.warn("No brush shape specified, oida!")
            }
        }
        pop();
    }


}