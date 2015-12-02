//=============================================================================
// song.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Thu Dec 22 07:52:47 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

(function() {

function submitCreateForm() {
    // Nothing to do
}

Pages['v-song'] = {
    init: function() {
        Pagination.setupLinks();
    },

    onEnter: function(cItem) {
/*        if (cItem.hasClass('play')) {
            Pagination.slideTo(cItem.attr('href'), {
                mode: cItem.hasClass('strummode') ? 'strum' : 'tap'
            }, true, true);
        }*/
    }
};

Pages['v-song-create'] = {
    init: function() {
        Pagination.setupLinks();
    },

    onEnter: function(cItem) {
        if (cItem.hasClass('submit-button')) {
            submitCreateForm();
        }
        else {
            cItem.find('input').focus();
        }
    }
}

})();

