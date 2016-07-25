var MENU = function(presets) {
    VISUALIZE.call(this, presets);
    
    var self = this;

    this.generalNonDestructiveOptions = [
        'fadeOut',
        'pointSize',
        'connectionStyle',
        'quadraticStyle'
    ];
    this.layerNonDesctructiveOptions = [
        'radius',
        'direction',
        'pointSpeed',
        'center.layerIdx'
    ];
    
    this.boolFields = [
        'connectOnSameLayer',
        'connectOnDiffLayer',
        'connectToCenter',
        'randomColors',
        'colorChangeOnDraw',
        'generateLineColors'
    ];
    
    this.valueFields = [
        'connectionStyle',
        'quadraticStyle'
    ];
    
    this.sliderFields = {
        'pointSize' : {
            min: 0,
            max: 1,
            step: 0.1
        },
        'fadeOut': {
            min: 0.1,
            max: 1,
            step: 0.1
        },
        'lineDistanceFactor': {
            min: 1,
            max: 5,
            step: 1
        },
        'numColorsGenerate': {
            min: 1,
            max: 24,
            step: 1
        },
        'radius': {
            min: 50,
            max: 800,
            step: 50
        },
        'numPoints': {
            min: 1,
            max: 24,
            step: 1
        },
        'pointSpeed': {
            min: 1,
            max: 9,
            step: 1
        }
    };

    for (idx = 0; idx < this.options.layers.length; idx++) {
        var template = $('#layer-template').html();
        var templateScript = Handlebars.compile(template);

        var context = {
            idx: idx,
            layers: this.options.layers
        };
        var layerContainer = templateScript(context);
        $('#layerBox').append(layerContainer);
    }

    $.each(this.boolFields, function(idx, name) {
        $('#' + name).val(self.options[name] === true ? '1' : '0');
    });
    $.each(this.valueFields, function(idx, name) {
        $('#' + name).val(self.options[name]);
    });

    $.each(this.sliderFields, function(name, opts) {
        $('#' + name).slider({
            value: self.options[name],
            min: opts.min,
            max: opts.max,
            step: opts.step,
            slide: function(evt, ui) {
                self.setOption(name, ui.value);
            }
        })
    });

    $('#layerBox').find('.slider').each(function() {
        var idx = $(this).data('idx');
        var attr = $(this).data('attr');

        var value = self.options.layers[idx][attr];

        $(this).slider({
            value: value,
            min: self.sliderFields[attr].min,
            max: self.sliderFields[attr].max,
            step: self.sliderFields[attr].step,
            slide: function(evt, ui) {
                self.setLayerOption(idx, attr, ui.value);
            }
        });
    });

    $('#layerBox').find('select').each(function() {
        var idx = $(this).data('idx');
        var attr = $(this).data('attr');

        if (attr == 'direction') {
            $(this).val(self.options.layers[idx].direction);
        } else if (attr == 'center.layerIdx') {
            $(this).val(self.options.layers[idx].center.layerIdx);
        }

        $(this).change(function() {
            self.setLayerOption(idx, attr, $(this).val());
        });
    });

    $('#regenerateColorScheme').click(function() {
        self.init();
    });


    $.each(this.boolFields, function(idx, name) {
        $('#' + name).change(function() {
            self.setOption($(this).val() == '1');
        })
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

    $('#connectionStyle').change(function() {
        setOption('connectionStyle', $(this).val());
    });

    $('#quadraticStyle').change(function() {
        if ($('#connectionStyle').val() != 'quadratic') {
            $('#connectionStyle').val('quadratic').change();
        }

        setOption('quadraticStyle', $(this).val());
    });

};

MENU.prototype = Object.create(VISUALIZE.prototype);
MENU.prototype.constructor = MENU;
    
MENU.prototype.setOption = function(option, value) {
    ga('send', 'event', 'option', 'set ' + option + ' to ' + value);
    this.options[option] = value;

    if ($.inArray(option, this.generalNonDestructiveOptions) !== -1) {
        this.adjustParticles();
    } else {
        this.init();
    }
};

MENU.prototype.setLayerOption = function(layerIdx, key, value) {
    ga('send', 'event', 'layerOption', 'layer' + layerIdx + ' ' + key + ' set to ' + value);

    splitKey = key.split('.');
    if (splitKey.length == 2) {
        this.options.layers[layerIdx][splitKey[0]][splitKey[1]] = value;

        if (key == 'center.layerIdx') {
            this.options.layers[layerIdx].center.mutable = value != '';

            this.options.layers[layerIdx].center.x = circleCenterX;
            this.options.layers[layerIdx].center.y = circleCenterY;
        }

    } else if (splitKey.length == 1) {
        this.options.layers[layerIdx][key] = value;
    }

    if ($.inArray(key, this.layerNonDesctructiveOptions) !== -1) {
        this.adjustParticles();
    } else {
        this.init();
    }
};