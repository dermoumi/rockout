//=============================================================================
// message.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Sun Jan  1 17:24:34 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

(function() {

Pages['v-message'] = {
    init: function(cb, reload) {
        if (reload) {
            setTimeout(function() {
                window.location = SITE_URL;
            }, 3e3);
        }
    }
}

})();

