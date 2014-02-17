function registerFormChange(option, value) {
    options[option] = value;
    init();
}

$().ready(function() {
    $('#fadeOut').slider({
        value: options.fadeOut,
        min: 0.025,
        max: 1,
        step: 0.025,
        slide: function(evt, ui) {
            registerFormChange('fadeOut', ui.value);
        }
    });

    $('#connectOnSameLayer').change(function() {
        registerFormChange('connectOnSameLayer', $(this).val() == '1');
    });

    $('#connectOnDiffLayer').change(function() {
        registerFormChange('connectOnDiffLayer', $(this).val() == '1');
    });

    $('#connectToCenter').change(function() {
        registerFormChange('connectToCenter', $(this).val() == '1');
    });

    $('#pointSpeed').slider({
        value: options.pointSpeed,
        min: 1,
        max: 5,
        step: 1,
        slide: function(evt, ui) {
            registerFormChange('pointSpeed', ui.value);
        }
    });

    $('#lineDistanceFactor').slider({
        value: options.lineDistanceFactor,
        min: 1,
        max: 5,
        step: 1,
        slide: function(evt, ui) {
            registerFormChange('lineDistanceFactor', ui.value);
        }
    });

    $('#randomColors').change(function() {
        registerFormChange('randomColors', $(this).val() == '1');
    });

    $('#colorChangeOnDraw').change(function() {
        if ($('#randomColors').val() != '1') {
            $('#randomColors').val(1).change();
        }

        registerFormChange('colorChangeOnDraw', $(this).val() == '1');
    });

    $('#connectionStyle').change(function() {
        registerFormChange('connectionStyle', $(this).val());
    });

    $('#quadraticStyle').change(function() {
        if ($('#connectionStyle').val() != 'quadratic') {
            $('#connectionStyle').val('quadratic').change();
        }

        registerFormChange('quadraticStyle', $(this).val());
    });
});