
class Grid {
    constructor() {
        this.minimumDistance = 50 / RESCALINGCONSTANT * DOMINANTSIDE;  // width * 0.05 // 50;
        this.margin = 50 / RESCALINGCONSTANT * DOMINANTSIDE; // width * 0.05 // 50;

        this.boxes = [];
        this.possible_pairings_x = [];
        this.possible_pairings_y = [];
        this.boxes_complete_status = [];
        this.boxes_completely_run = false;

        this.count_of_points_x = Math.round(getRandomFromInterval(2, 5));  // 1-5
        this.count_of_points_y = Math.round(getRandomFromInterval(2, 5));  // 1-5
        this.grid_label = this.count_of_points_x + "x" + this.count_of_points_y;
        if (MODE > 1) {
            console.log("Grid: " + this.grid_label);
        }

        this.columns_count = this.count_of_points_x + 1;
        this.row_count = this.count_of_points_y + 1;
        this.boxes_count = (this.columns_count) * (this.row_count)
        if (MODE > 1) {
            console.log("Grid with " + this.columns_count + " columns, " + this.row_count + " rows, " + this.boxes_count + " boxes and " + this.pairing_count + " planned pairings.")
        }

        this.pairing_count = Math.round(getRandomFromInterval(1, 4));
        if (MODE > 1) {
            console.log("Number of pairing: " + this.pairing_count);
        }

        this.getPoints();
        this.create_unpaired_boxes();

        this.scout_possible_pairings();


        for (var i = 0; i < this.pairing_count; i++) {
            if (this.pairing_count > 0 && this.possible_pairings_x.length > 0 && this.possible_pairings_y.length > 0) {
                this.choose_pairing();
                this.pair();
                this.remove_used_pairs();
            }
        }
        if (MODE > 1) {
            console.log("The real boxes are:");
            console.log(this.boxes);
        }

        this.create_lines();
    }


    getPoints() {

        // pool of points are resolution independent
        // points are dependent

        // start - generate a list from  0 to width
        this.standardStartX = 0;
        this.standardEndX = 100;
        this.standardPoolX = [...Array(this.standardEndX).keys()];
        this.standardStartY = 0;
        this.standardEndY = 100;
        this.standardPoolY = [...Array(this.standardEndY).keys()];

        this.marginStandard = Math.round(map(this.margin, 0, width, this.standardStartX, this.standardEndX));
        this.minimumDistanceStandard = Math.round(map(this.minimumDistance, 0, width, this.standardStartX, this.standardEndX));

        // remove start and end of axis
        for (var i = this.standardPoolX.length - 1; i >= 0; i--) {
            if (i <= (0 + this.marginStandard + this.minimumDistanceStandard) || i >= (this.standardEndX - this.marginStandard - this.minimumDistanceStandard)) {
                this.standardPoolX.splice(i, 1);
            }
        }
        this.pointsX = [(0 + this.margin), (width - this.margin)];

        for (var i = this.standardPoolY.length - 1; i >= 0; i--) {
            if (i <= (0 + this.marginStandard + this.minimumDistanceStandard) || i >= (this.standardEndY - this.marginStandard - this.minimumDistanceStandard)) {
                this.standardPoolY.splice(i, 1);
            }
        }
        this.pointsY = [(0 + this.margin), (height - this.margin)];

        for (var i = 0; i < this.count_of_points_x; i++) {
            this.getSinglePointX();
        }

        for (var i = 0; i < this.count_of_points_y; i++) {
            this.getSinglePointY();
        }

        // simple sort
        this.pointsX.sort(function (a, b) {
            return a - b;
        });
        this.pointsY.sort(function (a, b) {
            return a - b;
        });

        if (MODE > 1) {
            console.log("Coordinates of points on x axis: " + this.pointsX);
            console.log("Coordinates of points on y axis: " + this.pointsY);
        }

        // console.log(this.pointsXPool);
    }

    getSinglePointX() {

        let chosen_oneStandard = getRandomFromList(this.standardPoolX);  // standard for resolution independence
        // console.log("original: " + chosen_one);
        let chosen_one = Math.round(map(chosen_oneStandard, this.standardStartX, this.standardEndX, 0, width));
        // console.error("chosen_one: " + chosen_one);
        // console.error("standardStartX: " + this.standardStartX);
        // console.error("standardEndX: " + this.standardEndX);

        // remove near points
        for (var i = this.standardPoolX.length - 1; i >= 0; i--) {
            if (this.standardPoolX[i] >= (chosen_oneStandard - this.minimumDistanceStandard) && this.standardPoolX[i] <= (chosen_oneStandard + this.minimumDistanceStandard)) {
                this.standardPoolX.splice(i, 1);
            }
        }
        this.pointsX.push(chosen_one);
    }

    getSinglePointY() {

        let chosen_oneStandard = getRandomFromList(this.standardPoolY);
        let chosen_one = Math.round(map(chosen_oneStandard, this.standardStartY, this.standardEndY, 0, height));

        // remove near points
        for (var i = this.standardPoolY.length - 1; i >= 0; i--) {
            if (this.standardPoolY[i] >= (chosen_oneStandard - this.minimumDistanceStandard) && this.standardPoolY[i] <= (chosen_oneStandard + this.minimumDistanceStandard)) {
                // console.log(chosen_one + ": " + i);
                this.standardPoolY.splice(i, 1);
            }
        }
        this.pointsY.push(chosen_one);
    }

    create_unpaired_boxes() {
        this.label_counter = 0;

        for (let v = 0; v < (this.row_count); v++) {
            for (let i = 0; i < (this.columns_count); i++) {
                this.label_counter += 1;

                let data = {
                    label: (this.label_counter),
                    a: createVector(this.pointsX[i], this.pointsY[v]),
                    b: createVector(this.pointsX[i + 1], this.pointsY[v]),
                    c: createVector(this.pointsX[i + 1], this.pointsY[v + 1]),
                    d: createVector(this.pointsX[i], this.pointsY[v + 1])
                }

                this.boxes.push(new Box(data))
            }
        }
        // console.log("Unpaired Boxes:")
        // console.log(this.boxes)
    }

    scout_possible_pairings() {

        // skip boxes at the end of the row
        for (let i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].label % this.columns_count != 0) {
                this.possible_pairings_x.push({
                    left: this.boxes[i].label,
                    right: this.boxes[(i + 1)].label
                })
            }
            // skip last row
            if (this.boxes[i].label <= (this.boxes.length - this.columns_count)) {
                this.possible_pairings_y.push({
                    left: this.boxes[i].label,
                    // right: this.boxes[(i + this.row_count + 1)].label  // next row
                    right: this.boxes[(i + this.columns_count)].label  // next row
                })
            }
        }

        if (MODE > 1) {
            console.log(this.possible_pairings_x.length + " possible combinations for x:");
            console.log(this.possible_pairings_x);
            console.log(this.possible_pairings_y.length + " possible combinations for y: ");
            console.log(this.possible_pairings_y);
        }
    }

    choose_pairing() {

        if (fxrand() >= 0.5) {
            this.chosen_axis = "x"
            this.chosen = getRandomFromList(this.possible_pairings_x)
            if (MODE > 1) {
                console.log("Pairing on the x axis with:");
                console.log(this.chosen);
            }
        } else {
            this.chosen_axis = "y"
            this.chosen = getRandomFromList(this.possible_pairings_y)
            if (MODE > 1) {
                console.log("Pairing on the y axis with:");
                console.log(this.chosen);
            }
        }
    }

    pair() {

        let left_temp;
        let right_temp;

        for (let box of this.boxes) {
            if (box.label == this.chosen.left) {
                left_temp = {
                    a: box.a, b: box.b, c: box.c, d: box.d
                }
                this.left_label = box.label
            } else if (box.label == this.chosen.right) {
                right_temp = {
                    a: box.a, b: box.b, c: box.c, d: box.d
                }
                this.right_label = box.label;
            } else {
            }
        }

        if (this.chosen_axis == "x") {
            let data = {
                label: this.left_label + "+" + this.right_label,
                a: {
                    x: left_temp.a.x,
                    y: left_temp.a.y
                },
                b: {
                    x: right_temp.b.x,
                    y: right_temp.b.y
                },
                c: {
                    x: right_temp.c.x,
                    y: right_temp.c.y
                },
                d: {
                    x: left_temp.d.x,
                    y: left_temp.d.y
                },
            };
            this.paired_box = new Box(data);
        } else {
            let data = {
                label: this.left_label + "+" + this.right_label,
                a: {
                    x: left_temp.a.x,
                    y: left_temp.a.y
                },
                b: {
                    x: left_temp.b.x,
                    y: left_temp.b.y
                },
                c: {
                    x: right_temp.c.x,
                    y: right_temp.c.y
                },
                d: {
                    x: right_temp.d.x,
                    y: right_temp.d.y
                },
            };
            this.paired_box = new Box(data);
        }

        if (MODE > 1) {
            console.log("Adding the newly paired box: ");
            console.log(this.paired_box);
        }

        this.boxes.push(this.paired_box)

        if (MODE > 1) {
            console.log("Remove original boxes from array.");
        }
        for (var i = this.boxes.length - 1; i >= 0; i--) {
            if (this.boxes[i].label == this.left_label) {
                this.boxes.splice(i, 1);
            }
            if (this.boxes[i].label == this.right_label) {
                this.boxes.splice(i, 1);
            }
        }
    }

    remove_used_pairs() {
        if (MODE > 1) {
            console.log("Remove used pairs from both pools.")
        }
        for (var i = this.possible_pairings_x.length - 1; i >= 0; i--) {

            if (
                this.possible_pairings_x[i].left == this.chosen.left ||
                this.possible_pairings_x[i].left == this.chosen.right ||
                this.possible_pairings_x[i].right == this.chosen.left ||
                this.possible_pairings_x[i].right == this.chosen.right
            ) {
                this.possible_pairings_x.splice(i, 1);
            }
        }
        for (var i = this.possible_pairings_y.length - 1; i >= 0; i--) {
            if (
                this.possible_pairings_y[i].left == this.chosen.left ||
                this.possible_pairings_y[i].left == this.chosen.right ||
                this.possible_pairings_y[i].right == this.chosen.left ||
                this.possible_pairings_y[i].right == this.chosen.right
            ) {
                this.possible_pairings_y.splice(i, 1);
            }
        }
    }

    create_lines() {
        let indexChooser
        let hatchColor;
        let rothkoColor;


        for (let box of this.boxes) {

            // let axis = getRandomFromList(["x", "y", "xy", "yx", "blank"]);
            let axis = getRandomFromList(["x", "y", "xy", "yx"]);
            if (MODE > 1) {
                console.log(axis + " axis randomly chosen.");
            }

            indexChooser = Math.round(getRandomFromInterval(0, 1));
            if (indexChooser == 0) {
                hatchColor = PALETTE.hatches[0];
                rothkoColor = PALETTE.primaries[1];
            } else {
                hatchColor = PALETTE.hatches[1];
                rothkoColor = PALETTE.primaries[0];
            }

            box.rothko = new RothkoRect({
                custom_width: (box.c.x - box.a.x),
                custom_height: (box.c.y - box.a.y),
                posX: box.a.x,
                posY: box.a.y,
                elementSizeMin: 10 / RESCALINGCONSTANT * DOMINANTSIDE, //width * 0.01,
                elementSizeMax: 50 / RESCALINGCONSTANT * DOMINANTSIDE, //width * 0.05,
                margin: 0,
                fillColor: rothkoColor,
                fillColorNoise: 3,
                fillColorOpacity: 10,
                noStroke: false,
                strokeColor: color(PALETTE.rothkoStroke),
                strokeWeight: 1 / RESCALINGCONSTANT * DOMINANTSIDE,// width * 0.001,
                strokeColorNoise: 3,
                strokeOpacity: ROTHKOSTROKEOPACITY, // 50, // 15,
                numberQuantisizer: 20, // 20
            });

            box.dirtLines = new dirtLines(
                {
                    custom_width: (box.c.x - box.a.x),
                    custom_height: (box.c.y - box.a.y),
                    margin: 0,
                    posX: box.a.x,
                    posY: box.a.y,
                    strokeColor: distortColorNew(color(PALETTE.dirtline), 10, false),
                    // strokeColor: distortColorNew(hatchColor, 10),
                    strokeWeight: 0.2 / RESCALINGCONSTANT * DOMINANTSIDE, // width * 0.0002,
                    strokeColorNoise: 15,
                    numberQuantisizer: getRandomFromInterval(200, 600),  // 3
                    length: 20 / RESCALINGCONSTANT * DOMINANTSIDE, // width * 0.042,  // 40
                }
            );

            box.dirtCircles = new dirtCircles(
                {
                    custom_width: (box.c.x - box.a.x),
                    custom_height: (box.c.y - box.a.y),
                    margin: 0,
                    posX: box.a.x,
                    posY: box.a.y,
                    fillColor: color(PALETTE.dirtCircles),
                    fillColorNoise: 10,
                    numberQuantisizer: 200,
                    radiusBase: 0.75,
                    radiusNoise: 0.25,
                }
            );

            box.hatches = new Hatches(axis, box.a, box.c, hatchColor, 0, 0, DISTANCE_BETWEEN_LINES);
        }
    }


    show(startFrame, drawBackground = true) {
        this.startFrame = startFrame;
        this.boxes_complete_status = [];

        for (let box of this.boxes) {
            if (drawBackground) {
                if (frameCount == this.startFrame) {
                    box.rothko.show();
                    box.dirtLines.show();
                    box.dirtCircles.show();
                }
            }
            box.show();

            box.hatches.show();
            box.hatches.check_all_complete();
            if (this.boxes_completely_run == false) {
                this.boxes_complete_status.push(box.hatches.all_lines_complete)
            }
        }

        this.boxes_completely_run = this.boxes_complete_status.every(element => element === true);
        if (this.boxes_completely_run && typeof this.frameCountFinished === "undefined") {
            this.frameCountFinished = frameCount;  // save when finished
        }
    }
}


class Box {
    constructor(data) {

        this.label = data.label;
        this.a = data.a;
        this.b = data.b;
        this.c = data.c;
        this.d = data.d;

        this.radiusX = (this.b.x - this.a.x) / 2
        this.radiusY = (this.d.y - this.a.y) / 2

        this.center_x = this.a.x + this.radiusX;
        this.center_y = this.a.y + this.radiusY;
    }

    show() {
        if (MODE >= 5) {
            push();
            rectMode(CENTER);
            // translate(this.center_x - width / 2, this.center_y - height / 2);
            // translate(-width / 2, -height / 2);
            translate(this.center_x, this.center_y);
            noFill();
            strokeWeight(1);
            stroke(51);
            rect(0, 0, this.radiusX * 2, this.radiusY * 2);
            fill(0)
            ellipse(0, 0, 2);
            textFont(font);
            textSize(20);
            text(this.label, 10, 20);
            pop();
        }
    }
}


