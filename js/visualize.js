var VISUALIZE = function (presets) {
    this.options = presets[Math.round(Math.random() * (presets.length - 1))]; // randomize preset selection
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    // canvas - full width and height of the page
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // set the center of our "circle" to the middle of the canvas.
    this.circleCenterX = this.canvas.width / 2;
    this.circleCenterY = this.canvas.height / 2;

    this.particles = [];
    this.particleMatrix = [];
    this.connectionMap = [];
    //this.connectionColorMap = [];
    this.timesDrawn = 0;

    // completely fill the mask in over existing drawings
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (var n = 0; n < this.options.layers.length; n++) {
        var r = this.options.layers[n];

        for (var i = 0; i < r.numPoints; i++) {
            var angle = Math.PI * 2 * (i / r.numPoints);
            var newParticle = new Particle(r, angle, n, i, this);
            this.particles.push(newParticle);
        }
    }

    this.generateParticleMatrix();
    this.positionParticles();
    this.generateConnectionMap();
    //this.generateConnectionColorMap();
};

VISUALIZE.prototype.adjustParticles = function () {
    var j = 0;
    for (var n = 0; n < this.options.layers.length; n++) {
        var r = this.options.layers[n];

        for (var i = 0; i < r.numPoints; i++) {
            var angle = this.particles[j].angle;
            this.particles[j] = new Particle(this.options.layers[n], angle, n, i, this);
            j++;
        }
    }
};

VISUALIZE.prototype.generateParticleMatrix = function () {
    var matrixStart = [];
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];

        if (typeof matrixStart[p.layerIdx] === 'undefined') {
            matrixStart[p.layerIdx] = [];
        }

        matrixStart[p.layerIdx][p.particleInLayerIdx] = p;
    }

    this.particleMatrix = matrixStart;
};

VISUALIZE.prototype.positionParticles = function () {
    for (var i = 0; i < this.particles.length; i++) {
        var x = this.findX(this.particles[i]);
        var y = this.findY(this.particles[i]);
        this.particles[i].location.x = x;
        this.particles[i].location.y = y;
    }
};

VISUALIZE.prototype.generateConnectionMap = function () {
    var total = this.particles.length;

    for (var i = 0; i < total; i++) {
        for (var n = i + 1; n < total; n++) {

            var newConnection = {
                x1: this.particles[i].location.x,
                y1: this.particles[i].location.y,
                x2: this.particles[n].location.x,
                y2: this.particles[n].location.y,
                rgba: 'rgba(255, 255, 255, 1)'
            };

            if (this.options.connectOnSameLayer && this.particles[i].layerIdx == this.particles[n].layerIdx) {
                var makeConnection = true;

                if (this.options.outlineOnly) {
                    if (Math.abs(this.particles[i].particleInLayerIdx - this.particles[n].particleInLayerIdx) != 1) {
                        makeConnection = this.particles[i].particleInLayerIdx == 0 && this.particles[n].particleInLayerIdx == (this.particles[n].Layer.numPoints - 1);
                    }
                }

                if (makeConnection) {
                    this.connectionMap.push(newConnection);
                }
            }

            if (this.options.connectOnDiffLayer && this.particles[i].layerIdx !== this.particles[n].layerIdx) {
                this.connectionMap.push(newConnection);
            }
        }

        if (this.options.connectToCenter) {
            this.connectionMap.push({
                x1: this.particles[i].location.x,
                y1: this.particles[i].location.y,
                x2: circleCenterX,
                y2: circleCenterY,
                rgba: 'rgba(255, 255, 255, 1)'
            });
        }
    }

};

VISUALIZE.prototype.generateConnectionColorMap = function () {
    var lineColorsArray = this.options.lineColors;
    var numConnections = this.connectionMap.length;
    var numColors = lineColorsArray.length;

    if (this.options.generateLineColors) {
        lineColorsArray = [];
        numColors = 0;

        var numColorsToGenerate = this.options.numColorsGenerate ? this.options.numColorsGenerate : this.options.layers[0].numPoints / 2;

        for (var i = 0; i < numColorsToGenerate; i++) {
            var hex = Math.floor(Math.random() * (255 * 255 * 255)).toString(16);
            var paddedHex = String('0' + hex).slice(-6);
            lineColorsArray.push('#' + paddedHex);
            numColors++;
        }
    }

    if (numColors > 0) {
        while (numColors < numConnections) {
            lineColorsArray = lineColorsArray.concat(lineColorsArray);
            numColors = lineColorsArray.length;
        }
    }

    for (var j = 0; j < numConnections; j++) {
        if (this.options.randomColors || numColors == 0) {
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
        } else if (this.options.lineColors) {
            r = $c.hex2rgb(lineColorsArray[j]).R;
            g = $c.hex2rgb(lineColorsArray[j]).G;
            b = $c.hex2rgb(lineColorsArray[j]).B;
        }

        var rgba = "rgba(" + r + ", " + g + ", " + b + ", 1)";

        this.connectionColorMap.push({
            r: r,
            g: g,
            b: b,
            rgba: rgba
        });
    }
};

// Find x coordinates of point on the circle given angle (uses circleRadius)
VISUALIZE.prototype.findX = function (particle) {
    var angle = particle.angle;
    var radius = particle.radius;
    var center = particle.Layer.center;

    if (center.mutable) {
        if (typeof center.particleIdx != 'undefined') {
            var parentParticle = this.particles[center.particleIdx];
            center.x = parentParticle.location.x;
        }

        if (typeof center.layerIdx != 'undefined') {
            var currentParticleIdx = particle.particleInLayerIdx;
            parentParticle = this.grabParentParticle(center.layerIdx, currentParticleIdx);
            center.x = parentParticle.location.x;
        }
    }

    return center.x + radius * Math.cos(angle);
};

// Find y coordinates of point on the circle given angle (uses circleRadius)
VISUALIZE.prototype.findY = function (particle) {
    var angle = particle.angle;
    var radius = particle.radius;
    var center = particle.Layer.center;

    if (center.mutable) {
        if (typeof center.particleIdx != 'undefined') {
            var parentParticle = this.particles[center.particleIdx];
            center.y = parentParticle.location.y;
        }

        if (typeof center.layerIdx != 'undefined') {
            var currentParticleIdx = particle.particleInLayerIdx;
            parentParticle = this.grabParentParticle(center.layerIdx, currentParticleIdx);
            center.y = parentParticle.location.y;
        }
    }
    return center.y + radius * Math.sin(angle);
};

VISUALIZE.prototype.grabParentParticle = function (parentLayerIdx, particleIdx) {
    var parentParticle = this.particleMatrix[parentLayerIdx][particleIdx];
    while (typeof parentParticle != 'object') {
        particleIdx -= options.layers[parentLayerIdx].numPoints;
        parentParticle = this.particleMatrix[parentLayerIdx][particleIdx];
    }

    return parentParticle;
};

// connect all the particles and move them
VISUALIZE.prototype._draw = function () {
    this.timesDrawn++;
    
    console.log(this.canvas);
    console.log(this.ctx);
    
    // fill the mask in over existing drawings
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fill();

    this.ctx.globalCompositeOperation = "lighter";

    for (var j = 0; j < this.connectionMap.length; j++) {
        var connection = this.connectionMap[j];

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;

        if (this.options.connectionStyle == 'linear') {
            this.ctx.moveTo(connection.x1, connection.y1);
            this.ctx.lineTo(connection.x2, connection.y2);
        } else if (this.options.connectionStyle == 'quadratic') {
            if (this.options.quadraticStyle == 'rose') {
                this.ctx.moveTo(connection.x1, connection.y1);
                this.ctx.quadraticCurveTo(connection.x2, connection.y2, this.circleCenterX, this.circleCenterY);
            } else if (options.quadraticStyle == 'daisy') {
                this.ctx.moveTo(this.circleCenterX, this.circleCenterY);
                this.ctx.quadraticCurveTo(connection.x1, connection.y1, connection.x2, connection.y2);
            }
        }

        this.ctx.strokeStyle = connection.rgba;
        this.ctx.stroke();
    }

    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(p.location.x - (p.size / 2), p.location.y - (p.size / 2), p.size, p.size);

        // move the particles around our circle
        if (p.direction == 'cw') {
            p.angle += p.speed * Math.PI / 180;
        } else if (p.direction == 'ccw') {
            p.angle -= p.speed * Math.PI / 180;
        } else if (p.direction == 'erratic') {
            var rand = Math.random();
            if (rand > .5) {
                p.angle += p.speed * Math.PI / 180;
            } else {
                p.angle -= p.speed * Math.PI / 180;
            }
        }

        this.particles[i].angle = p.angle;
        this.particles[i].location.x = this.findX(p);
        this.particles[i].location.y = this.findY(p);
    }

    this.generateConnectionMap(this.particles);
};

VISUALIZE.prototype.draw = function() {
    var self = this;
    window.setInterval(function() {
        self._draw();
    }, 1000);
};