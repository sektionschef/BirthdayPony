class Brush {
    constructor(start, end, colorObject) {
        this.fullspeed = 3; // BRUSHFULLSPEED // 2-5;
        this.radiusMin = 1; // BRUSHSIZEMIN; // 1;
        this.radiusMax = 2; //BRUSHSIZEMAX; // 2;
        this.brushShape = "Line"; // "Triangle"; //BRUSHSHAPE;
        this.distanceBoost = 4; // 4 faster, 8 slower, but thicker - where the points are
        // this.noiseYzoom = 0.007;  // zoom on noise
        // this.amplitudeNoiseY = 3.5;  // up and down on Y axis
        this.OkLevel = 8;  // some offset is ok.
        this.fillColor = colorObject;
        this.strokeColor = colorObject;
        this.strokeSize = 0.1; // BRUSHFIBRESIZE;  // good one
        this.strokeColorDistort = 10; // BRUSHFIBRECOLORNOISE;

        this.start = start;
        this.end = end;

        this.alive = true;
        this.passedA = false;
        this.passedB = false;

        this.pos = this.start.copy();
        this.elementCount = 5;  // per step
        this.elements = [];

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

    savePath() {

        this.brushSize = this.radius;

        if (this.brushShape == "Line") {

            for (var i = 0; i < this.elementCount; i++) {
                this.elements.push({
                    shape: "Line",
                    posX: this.pos.x + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posY: this.pos.y + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posBX: this.pos.x + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posBY: this.pos.y + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                })
            }
        } else if (this.brushShape == "Ellipse") {

            for (var i = 0; i < this.elementCount; i++) {
                this.elements.push({
                    shape: "Ellipse",
                    posX: getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posY: getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    width: getP5RandomFromInterval(0, this.brushSize / 2),
                    height: getP5RandomFromInterval(0, this.brushSize / 2),
                })
            }
        } else if (this.brushShape == "Triangle") {
            for (var i = 0; i < this.elementCount; i++) {
                this.elements.push({
                    shape: "Triangle",
                    posX: getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posY: getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posBX: getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posBY: getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posCX: getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posCY: getP5RandomFromInterval(-this.brushSize, this.brushSize),
                })
            }
        } else {
            console.warn("No brush shape specified, oida!")
        }
    }


    update() {

        if (this.alive) {
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


            if (this.vel.x > 0) {
                // this.radius = map(this.vel.x, 0, 3, 1, 0.3)
                this.radius = Math.round(map(this.vel.x, BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX, this.radiusMax, this.radiusMin) * 100) / 100
            } else if (this.vel.y > 0) {
                // this.radius = map(this.vel.y, 0, 3, 1, 0.3)
                this.radius = Math.round(map(this.vel.y, BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX, this.radiusMax, this.radiusMin) * 100) / 100
            }

            this.savePath();
        }

    }

    show() {

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

        // if (this.alive) {

        if (MODE >= 5) {
            push();
            translate(-width / 2, -height / 2);
            translate(this.pos);
            noStroke();
            fill("black");
            ellipse(0, 0, this.radius * 3, this.radius * 3);
            pop();
        } else {
            this.drawBrush();
        }
        // }
    }

    drawBrush() {
        for (var i = 0; i < this.elements.length; i++) {
            push();
            translate(-width / 2, -height / 2);
            // console.log(this.elements);
            strokeWeight(this.strokeSize);
            stroke(distortColorNew(this.strokeColor, this.strokeColorDistort, false))
            noFill();
            if (this.brushShape == "Line") {
                line(this.elements[i].posX, this.elements[i].posY, this.elements[i].posBX, this.elements[i].posBY);
            } else if (this.brushShape == "Ellipse") {
                ellipse(this.elements[i].posX, this.elements[i].posY, this.elements[i].width, this.elements[i].height);
            } else if (this.brushShape == "Triangle") {
                triangle(this.elements[i].posX, this.elements[i].posY, this.elements[i].posBX, this.elements[i].posBY, this.elements[i].posCX, this.elements[i].posCY);
            } else {
                console.warn("No brush shape specified, oida!")
            }
            pop();
        }
    }


}

class BrushSystem {
    constructor() {
        this.brushes = [];
    }

    add(brush) {
        this.brushes.push(brush);
    }

    show() {
        for (var brush of this.brushes) {
            brush.update();
            brush.show();
        }
    }
}