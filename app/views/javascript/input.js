//==============================================================================
// Rockout - Browser-based GuitarHero-like video game
//
// File:   input.js
// Author: Said Dermoumi <sdermoumi@gmail.com>
// Date:   Tue Dec  6 10:57:36 GMT 2011;
//==============================================================================

/** @const */ var KEY_GFRET  =  0;
/** @const */ var KEY_BFRET  =  1;
/** @const */ var KEY_YFRET  =  2;
/** @const */ var KEY_RFRET  =  3;
/** @const */ var KEY_VFRET  =  4;
/** @const */ var KEY_ENTER  =  5;
/** @const */ var KEY_BACK   =  6;
/** @const */ var KEY_UP     =  7;
/** @const */ var KEY_DOWN   =  8;
/** @const */ var KEY_LEFT   =  9;
/** @const */ var KEY_RIGHT  = 10;
/** @const */ var KEY_SHIFT  = 11;
/** @const */ var KEY_TBREAK = 12;
/** @const */ var KEY_SPACE  = 13;
/** @const */ var KEY_TAB    = 14;
/** @const */ var KEY_DELETE = 15;
/** @const */ var KEY_HOME   = 16;
/** @const */ var KEY_END    = 17;
/** @const */ var KEY_PGUP   = 18;
/** @const */ var KEY_PGDOWN = 19;

var KEY_PICK   = KEY_ENTER;

/**
 *  Handles input
 */
var Input = (function() {
    // Variables
    var KeyGFret, // Keycodes
        KeyBFret,
        KeyYFret,
        KeyRFret,
        KeyVFret,
        KeyGAlt,
        KeyBAlt,
        KeyYAlt,
        KeyRAlt,
        KeyVAlt,
        KeyTimeBreak,
        KeyBack,
        KeyShift,
        KeyEnter,
        KeyUp,
        KeyDown,
        KeyLeft,
        KeyRight,
        KeySpace,
        KeyTab,
        KeyDelete,
        KeyHome,
        KeyEnd,
        KeyPgUp,
        KeyPgDown
        
        isDisabled     = false,                           // Parameters
        isPlayModel    = false,
        isInputIgnored = true,
        
        dummyFunc      = function(e) {},                  // Dummy function
        
        cbOnDown       = dummyFunc,                       // Callbacks
        cbOnUp         = dummyFunc,
        cbOnEnter      = dummyFunc,
        cbOnBack       = dummyFunc,
        cbOnOther      = dummyFunc;
    
    // Stops input system when focusing on an input or textarea
    $(document).on('focus', 'select, input[type=checkbox], input[type=text], input[type=password], textarea', function() {
        isDisabled = true;
    })
    .on('blur', 'select, input[type=checkbox], input[type=text], input[type=password], textarea', function() {
        isDisabled = false;
    });
    
    /**
     *  Returns the local keycode equivalent from Browser's keycodes
     *
     *  @return The local keycode if exists, -1 otherwise
     */
    function isPlayKey(c) {
        if (c == KeyEnter)                 return KEY_ENTER;
        if (c == KeyGFret || c == KeyGAlt) return KEY_GFRET;
        if (c == KeyBFret || c == KeyBAlt) return KEY_BFRET;
        if (c == KeyYFret || c == KeyYAlt) return KEY_YFRET;
        if (c == KeyRFret || c == KeyRAlt) return KEY_RFRET;
        if (c == KeyVFret || c == KeyVAlt) return KEY_VFRET;
        if (c == KeyBack)                  return KEY_BACK;
        if (c == KeyUp)                    return KEY_UP;
        if (c == KeyDown)                  return KEY_DOWN;
        if (c == KeyLeft)                  return KEY_LEFT;
        if (c == KeyRight)                 return KEY_RIGHT;
        if (c == KeyShift)                 return KEY_SHIFT;
        if (c == KeyTimeBreak)             return KEY_TBREAK;
        if (c == KeySpace)                 return KEY_SPACE;
        if (c == KeyTab)                   return KEY_TAB;
        if (c == KeyDelete)                return KEY_DELETE;
        if (c == KeyHome)                  return KEY_HOME;
        if (c == KeyEnd)                   return KEY_END;
        if (c == KeyPgUp)                  return KEY_PGUP;
        if (c == KeyPgDown)                return KEY_PGDOWN;
        
        return -1;
    }
    
    /**
     *  A callback function triggered when a key is pressed
     */
    function onKeyDown(e) {
        // Test keys by priority (PlayModel > Up > Down > Enter > Back)
        var returnVal = true,
            playKey   = isPlayKey(e.keyCode);

        if (isDisabled) {
            if (playKey == KEY_BACK) $(':focus').blur();
            return;
        }

        // If Control or Alt keys are held, let the browser handle them
        if (e.ctrlKey || e.altKey) return;
        
        if (playKey >= 0)         {
            if (isPlayModel) cbOnDown(playKey);
            else             returnVal = Navigation.KeyDown(playKey);
        }
        else if (!isInputIgnored) {
            return;
        }
        
        // Input is not ignored, skip next step
        if (returnVal === false) return;
        
        // Prevent browser's default action
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
        return false;
    }
    window.addEventListener('keydown', onKeyDown, false);

    window.addEventListener('help', function(e) {
        if (!isInputIgnored && KeyGFret != 112) return;
        e.preventDefault();
        return false;
    }, false);
    
    /**
     *  A callback function triggered when a key is released
     */
    function onKeyUp(e) {
        // Only PlayModel would need this event)
        var playKey = isPlayKey(e.keyCode);

        if (isDisabled) return;

        // If Control or Alt keys are held, let the browser handle them
        if (e.ctrlKey || e.altKey) return;
        
        if (playKey >= 0) if (isPlayModel) cbOnUp(playKey); // Play model
        else if (!isInputIgnored) return;
        
        // Prevent browser's default action
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
        return false;
    }
    window.addEventListener('keyup', onKeyUp, false);
    
    /**
     *  Setup KeyCodes and Parameters, mainly loaded from Settings module
     */
    function setup(forceLayout) {
        // If input is ignored, all keys even not-used ones are disabled
        isInputIgnored = Settings.getVal('IgnoreInput');
        
        // Load key layouts
        var keyLayout = (forceLayout !== undefined)
            ? forceLayout
            : Settings.getVal('KbLayout')
            
        if (keyLayout == 0) { // QWEOP / AZIOP as Frets
            KeyGFret = 81; KeyGAlt = 65;
            KeyBFret = 87; KeyBAlt = 90;
            KeyYFret = 69; KeyYAlt = 73;
            KeyRFret = KeyRAlt = 79;
            KeyVFret = KeyVAlt = 80;
            KeyTimeBreak = 8;

            KEY_PICK = KEY_SPACE;
        }
        else if (keyLayout == 1) {      // QWERT / AZERT as Frets
            KeyGFret = 81; KeyGAlt = 65;
            KeyBFret = 87; KeyBAlt = 90;
            KeyYFret = KeyYAlt = 69;
            KeyRFret = KeyRAlt = 82;
            KeyVFret = KeyVAlt = 84;
            KeyTimeBreak = 8;

            KEY_PICK = KEY_ENTER;
        }
        else if (keyLayout == 2) {  // 12345 as Frets (QWERTY keyboards only)
            KeyGFret = KeyGAlt = 49;
            KeyBFret = KeyBAlt = 50;
            KeyYFret = KeyYAlt = 51;
            KeyRFret = KeyRAlt = 52;
            KeyVFret = KeyVAlt = 53;
            KeyTimeBreak = 8;

            KEY_PICK = KEY_ENTER;
        }
        else /* if (keyLayout == 3) */ { // FnKeys as Frets
            KeyGFret = KeyGAlt = 112;
            KeyBFret = KeyBAlt = 113;
            KeyYFret = KeyYAlt = 114;
            KeyRFret = KeyRAlt = 115;
            KeyVFret = KeyVAlt = 116;
            KeyTimeBreak = 8;

            KEY_PICK = KEY_ENTER;
        }
        
        KeyBack   = 27;
        KeyShift  = 16;
        KeyUp     = 38;
        KeyDown   = 40;
        KeyLeft   = 37;
        KeyRight  = 39;
        KeySpace  = 32;
        KeyEnter  = 13;
        KeyTab    = 9;
        KeyDelete = 46;
        KeyHome   = 36;
        KeyEnd    = 35;
        KeyPgUp   = 33;
        KeyPgDown = 34;

        // Everything successful
        return true;
    }
    Settings.onUpdate(setup); setup();
    
    /**
     *  Object handler's interface
     */
    return {
        /**
         *  Disables InputModule of preventing non used keys
         */
        disable: function(disabled) {
            if (disabled !== undefined) isDisabled = disabled;
            return isDisabled;
        },
        
        /**
         *  Initialize Playing model
         */
        initPlayModel: function(keydown, keyup) {
            cbOnDown = keydown || dummyFunc;
            cbOnUp   = keyup   || dummyFunc;
            isPlayModel   = true;
        },
        
        /**
         *  Initialize Navigation model
         */
        initNavModel: function() {
            isPlayModel = false;
        },

        setup: setup
    };
})();

