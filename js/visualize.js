var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// canvas - full width and height of the page
var W = window.innerWidth, H = window.innerHeight;
canvas.width = W;
canvas.height = H;

// set the center of our "circle" to the middle of hte canvas.
circleCenterX = W/2;
circleCenterY = H/2;

var options = {
    // TODO outline only @depends connectOnSameLayer
    outlineOnly: true,
    // TODO connect only siblings (have same particle parent)
    connectOnlyToSiblings: false,
    // TODO connect only to Parents
    connectOnlyToParents: false
};

options = presets[Math.round(Math.random() * (presets.length-1))];

var particles;
var particleMatrix;
var connectionMap;
var connectionColorMap;
var timesDrawn;

function init() {
    // completely fill the mask in over existing drawings
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, W, H);

    // Make some particles
    particles = [];
    connectionMap = [];
    connectionColorMap = [];

    for (var n = 0; n < options.layers.length; n++) {
        var r = options.layers[n];

        for (var i = 0; i < r.numPoints; i++) {
            var angle = Math.PI*2 * (i / r.numPoints);
            var newParticle = new Particle(options.layers[n], angle, n, i);
            particles.push(newParticle);
        }
    }

    generateParticleMatrix(particles);
    positionParticles();
    generateConnectionMap(particles);
    generateConnectionColorMap();

    timesDrawn = 0;
}

function Particle(Layer, angle, layerIdx, particleInLayerIdx)
{
    var self = this;

    if (typeof Layer.center == 'undefined') {
        Layer.center = {};
        Layer.center.x = circleCenterX;
        Layer.center.y = circleCenterY;
    }

    this.radius = Layer.radius;
    //this.startRadius = Layer.radius;

    this.layerIdx = layerIdx;
    this.particleInLayerIdx = particleInLayerIdx;

    this.Layer = Layer;

    this.direction = Layer.direction;

    // radius of the particle - zero for invisible
    this.size = Layer.pointSize ? Layer.pointSize : options.pointSize;

    // speed at which it moves around the "circle"
    this.speed = Layer.pointSpeed ? Layer.pointSpeed : options.pointSpeed;

    // angle placement along the circle
    this.angle = angle;

    this.location = {};
}

function generateParticleMatrix(particles) {
    var matrixStart = [];
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        if (typeof matrixStart[p.layerIdx] === 'undefined') {
            matrixStart[p.layerIdx] = [];
        }

        matrixStart[p.layerIdx][p.particleInLayerIdx] = p;
    }

    particleMatrix = matrixStart;
}

function positionParticles() {
    for (var i = 0; i < particles.length; i++) {
        var x = findX(particles[i]);
        var y = findY(particles[i]);
        particles[i].location.x = x;
        particles[i].location.y = y;
    }
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

            if (options.connectOnSameLayer && particles[i].layerIdx == particles[n].layerIdx) {
                var makeConnection = true;

                if (options.outlineOnly) {
                    if (Math.abs(particles[i].particleInLayerIdx - particles[n].particleInLayerIdx) != 1) {
                        makeConnection = false;

                        if (particles[i].particleInLayerIdx == 0 && particles[n].particleInLayerIdx == (particles[n].Layer.numPoints - 1)) {
                            makeConnection = true;
                        }
                    }
                }

                if (makeConnection) {
                    connectionMap.push(newConnection);
                }
            }

            if (options.connectOnDiffLayer && particles[i].layerIdx !== particles[n].layerIdx) {
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
    var lineColorsArray = options.lineColors;
    var numConnections = connectionMap.length;
    var numColors = lineColorsArray.length;

    if (options.generateLineColors) {
        lineColorsArray = [];
        numColors = 0;

        var numColorsToGenerate = options.numColorsGenerate ? options.numColorsGenerate : options.layers[0].numPoints/2;

        for (var i = 0; i < numColorsToGenerate; i++) {
            var hex = Math.floor(Math.random()*(255*255*255)).toString(16);
            var paddedHex = String('0' + hex).slice(-6);
            lineColorsArray.push('#'+paddedHex);
            numColors++;
        }
    }

    connectionColorMap = [];

    if (numColors > 0) {
        while (numColors < numConnections) {
            lineColorsArray = lineColorsArray.concat(lineColorsArray);
            numColors = lineColorsArray.length;
        }
    }

    for (var j = 0; j < numConnections; j++) {
        if (options.randomColors || numColors == 0) {
            var r = Math.round(Math.random()*255);
            var g = Math.round(Math.random()*255);
            var b = Math.round(Math.random()*255);
        } else if (options.lineColors) {
            r = $c.hex2rgb(lineColorsArray[j]).R;
            g = $c.hex2rgb(lineColorsArray[j]).G;
            b = $c.hex2rgb(lineColorsArray[j]).B;
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

// Find x coordinates of point on the circle given angle (uses circleRadius)
function findX(particle) {
    var angle = particle.angle;
    var radius = particle.radius;
    var center = particle.Layer.center;

    if (center.mutable) {
        if (typeof center.particleIdx != 'undefined') {
            var parentParticle = particles[center.particleIdx];
            center.x = parentParticle.location.x;
        }

        if (typeof center.layerIdx != 'undefined') {
            var currentParticleIdx = particle.particleInLayerIdx;
            parentParticle = grabParentParticle(center.layerIdx, currentParticleIdx);
            center.x = parentParticle.location.x;
        }
    }

    return center.x + radius * Math.cos(angle);
}

// Find y coordinates of point on the circle given angle (uses circleRadius)
function findY(particle) {
    var angle = particle.angle;
    var radius = particle.radius;
    var center = particle.Layer.center;

    if (center.mutable) {
        if (typeof center.particleIdx != 'undefined') {
            var parentParticle = particles[center.particleIdx];
            center.y = parentParticle.location.y;
        }

        if (typeof center.layerIdx != 'undefined') {
            var currentParticleIdx = particle.particleInLayerIdx;
            parentParticle = grabParentParticle(center.layerIdx, currentParticleIdx);
            center.y = parentParticle.location.y;
        }
    }
    return center.y + radius * Math.sin(angle);
}

function grabParentParticle(parentLayerIdx, particleIdx) {
    var parentParticle = particleMatrix[parentLayerIdx][particleIdx];
    while (typeof parentParticle != 'object') {
        particleIdx -= options.layers[parentLayerIdx].numPoints;
        parentParticle = particleMatrix[parentLayerIdx][particleIdx];
    }

    return parentParticle;
}

// connect all the particles and move them
function draw()
{
    timesDrawn++;

    if (timesDrawn % options.lineDistanceFactor === 0) {
        // fill the mask in over existing drawings
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0, 0, 0, "+ options.fadeOut +")";
        ctx.fillRect(0, 0, W, H);

        ctx.globalCompositeOperation = "lighter";

        for (var j = 0; j < connectionMap.length; j++) {
            var connection = connectionMap[j];
            var rgba = connectionColorMap[j].rgba;

            ctx.beginPath();
            ctx.lineWidth = 1;

            if (options.connectionStyle == 'linear') {
                ctx.moveTo(connection.x1, connection.y1);
                ctx.lineTo(connection.x2, connection.y2);
            } else if (options.connectionStyle == 'quadratic') {
                if (options.quadraticStyle == 'rose') {
                    ctx.moveTo(connection.x1, connection.y1);
                    ctx.quadraticCurveTo(connection.x2, connection.y2, circleCenterX, circleCenterY);
                } else if (options.quadraticStyle == 'daisy') {
                    ctx.moveTo(circleCenterX, circleCenterY);
                    ctx.quadraticCurveTo(connection.x1, connection.y1, connection.x2, connection.y2);
                }
            }

            ctx.strokeStyle = rgba;
            ctx.stroke();
        }
    }

    for(var i = 0; i < particles.length; i++)
    {
        var p = particles[i];
        ctx.fillStyle = "white";
        ctx.fillRect(p.location.x - (p.size/2), p.location.y - (p.size/2), p.size, p.size);

        // move the particles around our circle
        if (p.direction == 'cw') {
            p.angle += p.speed*Math.PI/180;
        } else if (p.direction == 'ccw') {
            p.angle -= p.speed*Math.PI/180;
        } else if (p.direction == 'erratic') {
            var rand = Math.random();
            if (rand > .5) {
                p.angle += p.speed*Math.PI/180;
            } else {
                p.angle -= p.speed*Math.PI/180;
            }
        }

        particles[i].angle = p.angle;
        particles[i].location.x = findX(p);
        particles[i].location.y = findY(p);
    }

    generateConnectionMap(particles);

    if (options.colorChangeOnDraw) {
        generateConnectionColorMap();
    }
}

// --- AND NOW WE BEGIN!

init();
setInterval(draw, 30);
//draw();