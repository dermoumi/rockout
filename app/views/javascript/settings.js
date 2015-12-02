//==============================================================================
// settings.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Dec  6 17:52:22 GMT 2011.
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//==============================================================================

/**
 *  Loads and handles settings
 */

var Settings = (function() {
    var callbacks = []; // Functions to call when settings're updated

    var defaults = {                 // Default settings
        'KbLayout':     0,           // Input Settings
        'IgnoreInput':  1,
        
        'AvDelay':      375,         // Audio settings
        'GlobalVolume': 100,
        'SfxVolume':    100,
        
        'FPS':          120          // Graphics settings
    };
    
    var intervals = {
        'KbLayout': [0, 4],          // Input Settings
        'IgnoreInput':  [0, 1],
        
        'AvDelay':      [-500, 500], // Audio settings
        'GlobalVolume': [0, 100],
        'SfxVolume':    [0, 100],
        
        'FPS':          [24, 120]    // Graphics settings
    }
    
    // The handling interface
    return {
        /**
         *  Return setting value if exists, creates it from Defaults if not
         */
        getVal: function(key) {
            if (!localStorage) return defaults[key];
            
            var val = parseInt(localStorage.getItem(key), 10);
            if(!isNaN(val)) {
                // Within interval check, update if not.
                var value = Math.min(intervals[key][1],
                    Math.max(intervals[key][0], val));
                if (value != val) localStorage.setItem(key, value);

                return value;
            }

            localStorage.setItem(key, defaults[key]);
            return defaults[key];
        },

        getInterval: function(key) {
            return intervals[key];
        },
        
        /**
         *  Update settings (or some) with new values and calls callbacks
         */
        update: function(newSettings) {
            if (!newSettings) return;
            
            for(key in newSettings) {
                // Update only Integers
                var val = parseInt(newSettings[key], 10);
                if (isNaN(val)) continue;

                // Make sure the value is within the interval
                val = Math.min(intervals[key][1],
                    Math.max(intervals[key][0], val));

                localStorage.setItem(key, val);
            }
            
            // Call callbacks
            for(var i = callbacks.length-1; i >= 0; --i) {
                if (callbacks[i]) callbacks[i]();
            }
        },

        /*
         *  Returns the default value of a key
         */
        defaults: function(key) {
            return defaults[key];
        },
        
        /**
         *  Add update events listeners
         */
        onUpdate: function(callback) {
            callbacks.push(callback);
        }
    };
})();

