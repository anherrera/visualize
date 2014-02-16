var options = {
    // the opacity of the mask that layers over the drawings (0-1)
    fadeOut: .05,
    // the layers that our points travel on
    layers: [
        {
            radius: 200,
            direction: 'cw',
            numPoints: 3
        },
        {
            radius: 600,
            direction: 'ccw',
            numPoints: 6
        }
    ],
    // draw lines between points on the same layer
    connectOnSameLayer: false,
    // draw lines between points on different layers
    connectOnDiffLayer: true,
    // connect to center of circle
    connectToCenter: false,
    // outline only @depends connectOnSameLayer
    //outlineOnly: true,
    // the size of the points (zero for invisible)
    pointSize: 0,
    // the speed at which the points move
    pointSpeed: 1,
    // how spaced out the lines are
    lineDistanceFactor: 2,
    // choose random colors for connections
    randomColors: true,
    // color change on each draw @depends randomColors
    colorChangeOnDraw: false,
    // line color if not random (hex) @depends !randomColors
    lineColor: '#883300',
    // draw straight or quadratic lines between points
    connectionStyle: 'quadratic',
    // change the radius as the points move
    varyRadius: false
};

window.onload = function() {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // canvas - full width and height of the page
    var W = window.innerWidth, H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // set the center of our "circle" to the middle of hte canvas.
    circleCenterX = W/2;
    circleCenterY = H/2;

    // Make some particles
    var particles = [];
    var connectionMap = [];
    var connectionColorMap = [];

    for (var n = 0; n < options.layers.length; n++) {
        r = options.layers[n];

        for (i = 0; i < r.numPoints; i++) {
            var angle = Math.PI*2 * (i / r.numPoints);
            var newParticle = new Particle(angle, options.layers[n].radius, options.layers[n].direction);
            particles.push(newParticle);
        }
    }

    generateConnectionMap(particles);

    // Find x coordinates of point on the circle given angle (uses circleRadius)
    function findX(angle, radius) {
        var angleInDegrees = angle/Math.PI * 180;
        angleInDegrees = Math.round(angleInDegrees);
        angle = angleInDegrees * Math.PI/180;

        return circleCenterX + radius * Math.cos(angle);
    }

    // Find y coordinates of point on the circle given angle (uses circleRadius)
    function findY(angle, radius) {
        var angleInDegrees = angle/Math.PI * 180;
        angleInDegrees = Math.round(angleInDegrees);
        angle = angleInDegrees * Math.PI/180;

        return circleCenterY + radius * Math.sin(angle);
    }

    function Particle(angle, radius, direction)
    {
        var x = findX(angle, radius);
        var y = findY(angle, radius);

        this.radius = radius;
        this.startRadius = radius;

        this.direction = direction;

        // coordinates
        this.location = {x: x, y: y};

        // radius of the particle - zero for invisible
        this.size = options.pointSize;

        // speed at which it moves around the "circle"
        this.speed = options.pointSpeed;

        // angle placement along the circle
        this.angle = angle;
    }

    function generateConnectionMap(particles) {
        connectionMap = [];
        var total = particles.length;

        for (var i = 0; i < total; i++) {
            for (var n = i+1; n < total; n++) {

                var newConnection = {
                    x1: particles[i].location.x,
                    y1: particles[i].location.y,
                    x2: particles[n].location.x,
                    y2: particles[n].location.y
                };

                if (options.connectOnSameLayer && particles[i].radius == particles[n].radius) {
                    connectionMap.push(newConnection);
                }

                if (options.connectOnDiffLayer && particles[i].radius !== particles[n].radius) {
                    connectionMap.push(newConnection);
                }
            }

            if (options.connectToCenter) {
                connectionMap.push({
                    x1: particles[i].location.x,
                    y1: particles[i].location.y,
                    x2: circleCenterX,
                    y2: circleCenterY
                });
            }
        }

    }

    function generateConnectionColorMap() {
        if (options.colorChangeGradient) {
            var oldMap = connectionColorMap;
        }

        connectionColorMap = [];

        for (var j = 0; j < connectionMap.length; j++) {
            if (options.randomColors && !options.colorChangeGradient || oldMap.length == 0) {
                var r = Math.round(Math.random()*255);
                var g = Math.round(Math.random()*255);
                var b = Math.round(Math.random()*255);
            } else if (options.lineColor) {
                r = $c.hex2rgb(options.lineColor).R;
                g = $c.hex2rgb(options.lineColor).G;
                b = $c.hex2rgb(options.lineColor).B;
            }

            var rgba = "rgba("+r+", "+g+", "+b+", 1)";

            connectionColorMap.push({
                r: r,
                g: g,
                b: b,
                rgba: rgba
            });
        }
    }
    generateConnectionColorMap();

    var timesDrawn = 0;

    // connect all the particles and move them
    function draw()
    {
        timesDrawn++;

        if (timesDrawn % options.lineDistanceFactor === 0) {
            // fill the mask in over existing drawings
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "rgba(0, 0, 0, "+ options.fadeOut +")";
            ctx.fillRect(0, 0, W, H);

            //ctx.fillStyle = "black";
            //ctx.fillRect(circleCenterX-3, circleCenterY-3, 6, 6);

            ctx.globalCompositeOperation = "lighter";

            for (var j = 0; j < connectionMap.length; j++) {
                var connection = connectionMap[j];
                var rgba = connectionColorMap[j].rgba;

                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(connection.x1, connection.y1);

                if (options.connectionStyle == 'linear') {
                    ctx.lineTo(connection.x2, connection.y2);
                } else if (options.connectionStyle == 'quadratic') {
                    ctx.quadraticCurveTo(connection.x2, connection.y2, circleCenterX, circleCenterY);
                }

                ctx.strokeStyle = rgba;
                ctx.stroke();
            }
        }

        for(var i = 0; i < particles.length; i++)
        {
            var p = particles[i];
            ctx.fillStyle = "white";
            ctx.fillRect(p.location.x, p.location.y, p.size, p.size);

            // move the particles around our circle
            if (p.direction == 'cw') {
                p.angle += p.speed*Math.PI/180;
                /*if (p.angle >= Math.PI*2) {
                 p.angle = Math.PI/180;
                 }*/
            } else {
                p.angle -= p.speed*Math.PI/180;
                /*if (p.angle <= 0) {
                 p.angle = 359*Math.PI/180;
                 }*/
            }

            particles[i].angle = p.angle;
            //particles[i].radius = Math.abs(p.startRadius * Math.sin(p.angle));
            particles[i].location.x = findX(p.angle, p.radius);
            particles[i].location.y = findY(p.angle, p.radius);
        }

        generateConnectionMap(particles);

        if (options.colorChangeOnDraw) {
            generateConnectionColorMap();
        }

        // semi-randomly take or add particles
        /*if (Math.random() > .9) {
         particles.push(new particle(2*Math.PI*Math.random()));
         } else {
         if (particles.length > numOfPoints) {
         particles.shift();
         }
         }*/

        //circleRadius = Math.random() * origCircleRadius;
        //particles[i].radius = Math.cos(p.angle) * p.radius;
    }

    setInterval(draw, 30);
    //draw();
    //draw();
}