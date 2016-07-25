var Particle = function(Layer, angle, layerIdx, particleInLayerIdx, v) {
    if (typeof Layer.center == 'undefined') {
        Layer.center = {};
        Layer.center.x = v.circleCenterX;
        Layer.center.y = v.circleCenterY;
    }

    this.radius = Layer.radius;
    //this.startRadius = Layer.radius;

    this.layerIdx = layerIdx;
    this.particleInLayerIdx = particleInLayerIdx;

    this.Layer = Layer;

    this.direction = Layer.direction;

    // radius of the particle - zero for invisible
    this.size = Layer.pointSize ? Layer.pointSize : v.options.pointSize;

    // speed at which it moves around the "circle"
    this.speed = Layer.pointSpeed ? Layer.pointSpeed : v.options.pointSpeed;

    // angle placement along the circle
    this.angle = angle;

    this.location = {};
};