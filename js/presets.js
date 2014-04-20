var presets = [
    {
        fadeOut: .1,
        layers: [
            {
                radius: 200,
                direction: 'cw',
                numPoints: 6
            },
            {
                radius: 400,
                direction: 'ccw',
                numPoints: 6
            },
            {
                radius: 600,
                direction: 'cw',
                numPoints: 6
            }
        ],
        connectOnSameLayer: false,
        connectOnDiffLayer: true,
        connectToCenter: false,
        pointSize: 0,
        pointSpeed: 1,
        lineDistanceFactor: 1,
        randomColors: false,
        colorChangeOnDraw: false,
        lineColors: [],
        generateLineColors: true,
        numColorsGenerate: 4,
        connectionStyle: 'quadratic',
        quadraticStyle: 'rose'
    },
    {
        fadeOut: 1,
        layers: [
            {
                radius: 200,
                direction: 'ccw',
                numPoints: 4
            },
            {
                radius: 400,
                direction: 'ccw',
                numPoints: 3
            },
            {
                radius: 500,
                direction: 'cw',
                numPoints: 24
            }
        ],
        connectOnSameLayer: false,
        connectOnDiffLayer: true,
        connectToCenter: false,
        pointSize: 0,
        pointSpeed: 1,
        lineDistanceFactor: 1,
        randomColors: false,
        colorChangeOnDraw: false,
        lineColors: [],
        generateLineColors: true,
        numColorsGenerate: 3,
        connectionStyle: 'quadratic',
        quadraticStyle: 'rose'
    },
    {
        fadeOut: .5,
        layers: [
            {
                radius: 300,
                direction: 'cw',
                numPoints: 6
            },
            {
                radius: 400,
                direction: 'ccw',
                numPoints: 6
            },
            {
                radius: 500,
                direction: 'cw',
                numPoints: 6
            }
        ],
        connectOnSameLayer: false,
        connectOnDiffLayer: true,
        connectToCenter: false,
        pointSize: 0,
        pointSpeed: 1,
        lineDistanceFactor: 1,
        randomColors: false,
        colorChangeOnDraw: false,
        lineColors: [],
        generateLineColors: true,
        numColorsGenerate: 1,
        connectionStyle: 'linear',
        quadraticStyle: 'daisy'
    },
    {
        fadeOut: .6,
        layers: [
            {
                radius: 400,
                direction: 'cw',
                numPoints: 12
            },
            {
                radius: 600,
                direction: 'ccw',
                numPoints: 24
            },
            {
                radius: 600,
                direction: 'cw',
                numPoints: 24
            }
        ],
        connectOnSameLayer: false,
        connectOnDiffLayer: true,
        connectToCenter: false,
        pointSize: 0,
        pointSpeed: 1,
        lineDistanceFactor: 1,
        randomColors: false,
        colorChangeOnDraw: false,
        lineColors: [],
        generateLineColors: true,
        numColorsGenerate: 5,
        connectionStyle: 'linear',
        quadraticStyle: 'daisy'
    },
    {
        fadeOut: 1,
        layers: [
            {
                radius: 500,
                direction: 'ccw',
                numPoints: 10
            },
            {
                radius: 300,
                direction: 'ccw',
                numPoints: 11
            },
            {
                radius: 500,
                direction: 'cw',
                numPoints: 24
            }
        ],
        connectOnSameLayer: false,
        connectOnDiffLayer: true,
        connectToCenter: false,
        pointSize: 0,
        pointSpeed: 1,
        lineDistanceFactor: 1,
        randomColors: false,
        colorChangeOnDraw: false,
        lineColors: [],
        generateLineColors: true,
        numColorsGenerate: 3,
        connectionStyle: 'quadratic',
        quadraticStyle: 'rose'
    },
    {
        fadeOut: 1,
        layers: [
            {
                radius: 200,
                direction: 'cw',
                numPoints: 24
            },
            {
                radius: 200,
                direction: 'ccw',
                numPoints: 6
            },
            {
                radius: 800,
                direction: 'cw',
                numPoints: 24
            }
        ],
        connectOnSameLayer: false,
        connectOnDiffLayer: true,
        connectToCenter: false,
        pointSize: 0,
        pointSpeed: 1,
        lineDistanceFactor: 1,
        randomColors: false,
        colorChangeOnDraw: false,
        lineColors: [],
        generateLineColors: true,
        numColorsGenerate: 24,
        connectionStyle: 'quadratic',
        quadraticStyle: 'rose'
    },
    {
        fadeOut: 0.1,
        layers: [
            {
                radius: 200,
                direction: 'cw',
                numPoints: 4
            },
            {
                radius: 200,
                center: {
                    mutable: true,
                    layerIdx: 0
                },
                direction: 'ccw',
                numPoints: 16,
                pointSpeed: 3
            }
        ],
        connectOnSameLayer: false,
        connectOnDiffLayer: true,
        connectToCenter: false,
        pointSize: 0,
        pointSpeed: 1,
        lineDistanceFactor: 1,
        randomColors: false,
        colorChangeOnDraw: false,
        lineColors: [],
        generateLineColors: true,
        numColorsGenerate: 4,
        connectionStyle: 'linear',
        quadraticStyle: 'rose',
        outlineOnly: true
    }
];