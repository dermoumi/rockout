//=============================================================================
// pagesettings.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Mon Dec 12 20:57:01 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/**
 * Handles settings page mechanics
 */
var PageSettings = (function() {
    var options = {
        'FPS': {
            min: 24,
            max: 1e9
        }, 
        'AvDelay': {
            min: -1e9,
            max: 1e9
        }, 
        'GlobalVolume': {
            min: 0,
            max: 100
        }, 
        'SfxVolume': {
            min: 0,
            max: 100
        }, 
        'KbLayout': {
            min: 0,
            max: 3
        }, 
        'IgnoreInput': {
            min: 0,
            max: 1
        }
    };

    function assertVal(name, val) {
        val = parseInt(val);
        val = Math.min(val, options[name].max);
        val = Math.max(val, options[name].min);

        return val;
    }

    function fillSettings() {
        $('.settings-input .number-input').each(function(index) {
            $(this).val(Settings.getVal($(this).attr('name')));
        })
    }

    function saveSettings() {
        var settings = {};
        $('.settings-input .number-input').each(function() {
            settings[$(this).attr('name')] = $(this).val();
        })

        Settings.update(settings);
        alert('saved');
    }

    function setup() {
        $('.settings-input')
            .append($('<input type="button" class="add btn" value="+" />'))
            .prepend($('<input type="button" class="sub btn" value="-" />'));

        $('.settings-input .number-input').change(function() {
            $(this).val(assertVal($(this).attr('name'), $(this).val()));
        });

        $('.settings-option button.add').click(function() {
            addValue($(this).parent());
            return false;
        });

        $('.settings-option button.sub').click(function() {
            subValue($(this).parent());
            return false;
        });

        fillSettings();
    }

    function addValue(container) {
        var elem  = container.find('.number-input'),
            val = parseInt(elem.val()) + 1;
        
        elem.val(assertVal(elem.attr('name'), isNaN(val) ? 1 : val));
        
        return false;
    }

    function subValue(container) {
        var elem  = container.find('.number-input'),
            val = parseInt(elem.val()) - 1;
        
        elem.val(assertVal(elem.attr('name'), isNaN(val) ? 0 : val));
        
        return false;
    }

    runtimeObj['setupSettingsPage'] = setup;

    return {
        addValue: addValue,
        subValue: subValue,
        reset: fillSettings,
        save: saveSettings
    }
})();