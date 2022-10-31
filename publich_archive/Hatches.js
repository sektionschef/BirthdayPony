class Hatches {
    constructor(axis, cornerLeft, cornerRight, brushColor, padding_x, padding_y, distance_between_lines) {
        this.offsetPoint = HATCHOFFSET;

        this.brushColorDistort = BRUSHCOLORDISTORT;

        this.brushColor = brushColor;

        this.axis = axis;
        this.cornerLeft = cornerLeft  // createVector(x_start, y_start);
        this.cornerRight = cornerRight // createVector(x_stop, y_stop);
        this.padding_x = padding_x;
        this.padding_y = padding_y;
        this.distance_between_lines = distance_between_lines;

        this.bodies = [];
        this.all_lines_complete = false;

        this.width = Math.round(this.cornerRight.x - this.cornerLeft.x);
        this.height = Math.round(this.cornerRight.y - this.cornerLeft.y);

        if (this.axis == "x") {
            this.x();
        } else if (this.axis == "y") {
            this.y();
        } else if (this.axis == "xy") {
            this.xy();
        } else if (this.axis == "yx") {
            this.yx();
        } else if (this.axis == "blank") {
        }
    }

    x() {

        let count_lines;
        let start;
        let end;

        count_lines = Math.round((this.cornerRight.y - this.cornerLeft.y - 2 * this.padding_y) / this.distance_between_lines);
        // console.warn("distance: " + this.distance_between_lines);
        // console.warn("area: " + (this.cornerRight.y - this.cornerLeft.y - 2 * this.padding_y));
        // console.warn("count_lines: " + count_lines);

        for (let i = 0; i < count_lines; i++) {

            start = createVector(this.cornerLeft.x + this.padding_x, this.cornerLeft.y + this.padding_y + this.distance_between_lines * i, 0);
            end = createVector(this.cornerRight.x - this.padding_x, this.cornerLeft.y + this.padding_y + this.distance_between_lines * i, 0);

            start.add(this.offsetter());
            end.add(this.offsetter());

            // console.log(i);
            this.bodies.push(new Brush(
                start,
                end,
                distortColorNew(this.brushColor, this.brushColorDistort, false)
            ));
        }
    }

    y() {
        let count_lines;
        let start;
        let end;

        count_lines = Math.round(((this.cornerRight.x - this.cornerLeft.x) - 2 * this.padding_x) / this.distance_between_lines);

        for (let i = 0; i < count_lines; i++) {

            start = createVector(this.cornerLeft.x + this.padding_x + this.distance_between_lines * i, this.cornerLeft.y + this.padding_y);
            end = createVector(this.cornerLeft.x + this.padding_x + this.distance_between_lines * i, this.cornerRight.y - this.padding_x);

            start.add(this.offsetter());
            end.add(this.offsetter());

            this.bodies.push(new Brush(
                start,
                end,
                distortColorNew(this.brushColor, this.brushColorDistort, false)
            ));
        }
    }

    xy() {

        // y = kx + d
        // k = -1/1  - https://de.serlo.org/mathe/1785/geradensteigung
        // y = -1x + 0;  // line 1
        // y = cornerRight.x or y = cornerRight.y
        // intersection: cornerRight.x or cornerRight.y = -1x -> 

        let count_lines;
        let start;
        let end;
        let type;


        if (this.width < this.height) {
            type = "height"
        } else {
            type = "width"
        }

        // main body
        if (type == "height") {
            // console.log("this.height: " + this.height);
            // console.log("this.width: " + this.width);
            // console.log("this.distance_between_lines: " + this.distance_between_lines);
            count_lines = Math.round((this.height - this.width - 2 * this.padding_x) / this.distance_between_lines);
            // console.warn("count_lines: " + count_lines);

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerLeft.x, this.cornerLeft.y + this.distance_between_lines * i, 0);
                end = createVector(this.cornerRight.x, this.cornerLeft.y + (this.cornerRight.x - this.cornerLeft.x) + this.distance_between_lines * i, 0);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }
        } else {

            count_lines = Math.round((this.width - this.height - 2 * this.padding_x) / this.distance_between_lines);

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerLeft.y, 0);
                end = createVector(this.cornerLeft.x + this.height + this.distance_between_lines * i, this.cornerRight.y, 0);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }

        }

        if (type == "height") {
            // triangle beneath
            // console.log(this.height - this.width);
            count_lines = Math.round((this.width - 2 * this.padding_x) / this.distance_between_lines);

            for (let i = 0; i < count_lines; i++) {  // skip first line

                start = createVector(this.cornerLeft.x, this.cornerLeft.y + (this.height - this.width) + this.distance_between_lines * i);
                end = createVector(this.cornerRight.x - this.distance_between_lines * i, this.cornerRight.y);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }

        } else {

            // left to floor
            count_lines = Math.round((this.height - 2 * this.padding_x) / this.distance_between_lines);

            for (let i = 1; i < count_lines; i++) {  // skip first line

                start = createVector(this.cornerLeft.x, this.cornerLeft.y + this.distance_between_lines * i);
                end = createVector(this.cornerLeft.x + this.height - this.distance_between_lines * i, this.cornerRight.y);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }
        }

        if (type == "height") {

            // // triangle beneath
            count_lines = Math.round((this.width - 2 * this.padding_x) / this.distance_between_lines);

            for (let i = 1; i < count_lines; i++) {  // skip first line

                start = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerLeft.y);
                end = createVector(this.cornerRight.x, this.cornerRight.y - (this.height - this.width) - this.distance_between_lines * i);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }
        } else {

            // // triangle ceiling to right
            count_lines = Math.round((this.height - 2 * this.padding_x) / this.distance_between_lines);

            for (let i = 0; i < count_lines; i++) {  // skip first line

                start = createVector(this.cornerRight.x - this.height + this.distance_between_lines * i, this.cornerLeft.y);
                end = createVector(this.cornerRight.x, this.cornerRight.y - this.distance_between_lines * i);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }

        }

    }


    yx() {
        let count_lines;
        let start;
        let end;
        let type;

        if (this.width < this.height) {
            type = "height"
        } else {
            type = "width"
        }



        if (type == "height") {
            count_lines = Math.round((this.height - this.width - 2 * this.padding_x) / this.distance_between_lines);
            // main body

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerLeft.x, this.cornerLeft.y + (this.cornerRight.x - this.cornerLeft.x) + this.distance_between_lines * i, 0);
                end = createVector(this.cornerRight.x, this.cornerLeft.y + this.distance_between_lines * i, 0);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }
        } else {
            // main body
            count_lines = Math.round((this.width - this.height) / this.distance_between_lines);

            for (let i = 0; i < count_lines; i++) {
                // + (this.height - this.width)
                start = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerRight.y);
                end = createVector(this.cornerLeft.x + this.height + this.distance_between_lines * i, this.cornerLeft.y);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }

        }

        if (type == "height") {
            // triangle beneath
            count_lines = Math.round((this.width - 2 * this.padding_x) / this.distance_between_lines);


            for (let i = 0; i < count_lines; i++) {
                // + (this.height - this.width)
                start = createVector(this.cornerLeft.x, this.cornerLeft.y + this.distance_between_lines * i);
                end = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerLeft.y);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }
        } else {
            // floor to right
            count_lines = Math.round((this.height - 2 * this.padding_x) / this.distance_between_lines);

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerRight.x - this.height + this.distance_between_lines * i, this.cornerRight.y, 0);
                end = createVector(this.cornerRight.x, this.cornerLeft.y + this.distance_between_lines * i, 0);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }

        }


        if (type == "height") {
            // // // triangle beneath
            count_lines = Math.round((this.width - 2 * this.padding_x) / this.distance_between_lines);

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerRight.y);
                end = createVector(this.cornerRight.x, this.cornerRight.y - this.width + this.distance_between_lines * i);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }
        } else {
            // left to ceiling
            count_lines = Math.round((this.height - 2 * this.padding_x) / this.distance_between_lines);

            for (let i = 0; i < count_lines; i++) {

                start = createVector(this.cornerLeft.x, this.cornerLeft.y + this.distance_between_lines * i);
                end = createVector(this.cornerLeft.x + this.distance_between_lines * i, this.cornerLeft.y);

                start.add(this.offsetter());
                end.add(this.offsetter());

                this.bodies.push(new Brush(
                    start,
                    end,
                    distortColorNew(this.brushColor, this.brushColorDistort, false)
                ));
            }

        }

    }

    offsetter() {
        return createVector(getP5RandomFromInterval(-this.offsetPoint, this.offsetPoint), getP5RandomFromInterval(-this.offsetPoint, this.offsetPoint), 0);
    }

    show() {

        this.check_all_complete();

        if (MODE >= 5) {
            push();
            // translate(-width / 2, -height / 2);
            translate(this.cornerLeft.x + this.width / 2, this.cornerLeft.y + this.height / 2, 0)
            fill(255, 255, 255, 100);
            box(this.width, this.height, 0);
            pop();
        }

        if (this.all_lines_complete == false) {
            for (var brush of this.bodies) {
                brush.update();
                brush.display();
            }
        }

    }

    check_all_complete() {

        // skip if already complete
        if (this.all_lines_complete == false) {
            this.brushes_alive_status = [];

            for (var brush of this.bodies) {

                this.brushes_alive_status.push(brush.alive);

            }

            this.all_lines_complete = this.brushes_alive_status.every(element => element === false);
        }

    }
}

