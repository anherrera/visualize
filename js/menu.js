function setOption(option, value) {
    //ga('send', 'event', 'option', 'set ' + option + ' to ' + value);
    options[option] = value;
    init();
}

function setLayerOption(layerIdx, key, value) {
    //ga('send', 'event', 'layerOption', 'layer' + layerIdx + ' ' + key + ' set to ' + value);
    options.layers[layerIdx][key] = value;
    init();
}

function initMenu(options) {
    for (idx = 0; idx < options.layers.length; idx++) {
        var layerContainer = $('<div id="layer'+idx+'"/>');

        var radiusField = $('<div class="form-field" />');
        var radiusFieldLabel = $('<label>Layer '+(idx+1)+' Radius</label>');
        var radiusFieldSlider = $('<div class="slider" data-idx="'+idx+'" data-attr="radius" />');
        var clearDiv = $('<div class="clear" />');
        radiusFieldLabel.appendTo(radiusField);
        radiusFieldSlider.appendTo(radiusField);
        clearDiv.appendTo(radiusField);

        var numPointsField = $('<div class="form-field" />');
        var numPointsFieldLabel = $('<label>Layer '+(idx+1)+' Num Points</label>');
        var numPointsFieldSlider = $('<div class="slider" data-idx="'+idx+'" data-attr="numPoints" />');
        var clearDiv = $('<div class="clear" />');
        numPointsFieldLabel.appendTo(numPointsField);
        numPointsFieldSlider.appendTo(numPointsField);
        clearDiv.appendTo(numPointsField);

        radiusField.appendTo(layerContainer);
        numPointsField.appendTo(layerContainer);

        layerContainer.appendTo($('#layerBox'));
    }

    $.each([
        'connectOnSameLayer',
        'connectOnDiffLayer',
        'connectToCenter',
        'randomColors',
        'colorChangeOnDraw',
        'generateLineColors'
    ], function(idx, name) {
        $('#' + name).val(options[name] === true ? '1' : '0');
    });

    $.each([
        'connectionStyle',
        'quadraticStyle'
    ], function(idx, name) {
        $('#' + name).val(options[name]);
    });
}

$().ready(function() {
    initMenu(options);

    $('#fadeOut').slider({
        value: options.fadeOut,
        min: 0.1,
        max: 1,
        step: 0.1,
        slide: function(evt, ui) {
            setOption('fadeOut', ui.value);
        }
    });

    $('#connectOnSameLayer').change(function() {
        setOption('connectOnSameLayer', $(this).val() == '1');
    });

    $('#connectOnDiffLayer').change(function() {
        setOption('connectOnDiffLayer', $(this).val() == '1');
    });

    $('#connectToCenter').change(function() {
        setOption('connectToCenter', $(this).val() == '1');
    });

    $('#pointSpeed').slider({
        value: options.pointSpeed,
        min: 1,
        max: 5,
        step: 1,
        slide: function(evt, ui) {
            setOption('pointSpeed', ui.value);
        }
    });

    $('#lineDistanceFactor').slider({
        value: options.lineDistanceFactor,
        min: 1,
        max: 5,
        step: 1,
        slide: function(evt, ui) {
            setOption('lineDistanceFactor', ui.value);
        }
    });

    $('#randomColors').change(function() {
        setOption('randomColors', $(this).val() == '1');
    });

    $('#colorChangeOnDraw').change(function() {
        if ($('#randomColors').val() != '1') {
            $('#randomColors').val(1).change();
        }

        setOption('colorChangeOnDraw', $(this).val() == '1');
    });

    $('#generateLineColors').change(function() {
        if ($(this).val() == '0') {
            $('#randomColors').val(1).change();
        } else {
            $('#randomColors').val(0).change();
        }

        setOption('generateLineColors', $(this).val() == '1');
    });

    $('#numColorsGenerate').slider({
        value: options.numColorsGenerate,
        min: 1,
        max: 24,
        step: 1,
        slide: function(evt, ui) {
            setOption('numColorsGenerate', ui.value);
        }
    });

    $('#connectionStyle').change(function() {
        setOption('connectionStyle', $(this).val());
    });

    $('#quadraticStyle').change(function() {
        if ($('#connectionStyle').val() != 'quadratic') {
            $('#connectionStyle').val('quadratic').change();
        }

        setOption('quadraticStyle', $(this).val());
    });

    $('#regenerateColorScheme').click(function() {
        init();
    });

    $('#layerBox').find('.slider').each(function() {
        var idx = $(this).data('idx');
        var attr = $(this).data('attr');

        if (attr == 'radius') {
            var value = options.layers[idx].radius;
            var min = 100;
            var max = 800;
            var step = 100;
        }

        if (attr == 'numPoints') {
            var value = options.layers[idx].numPoints;
            var min = 1;
            var max = 24;
            var step = 1;
        }

        $(this).slider({
            value: value,
            min: min,
            max: max,
            step: step,
            slide: function(evt, ui) {
                setLayerOption(idx, attr, ui.value);
            }
        });
    });
});