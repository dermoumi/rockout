//=============================================================================
// transition.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Sat Jan 14 18:03:59 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

function transSetup(fadeIn, cb, duration) {
    if (isNaN(duration)) duration = 400;
    disableEvents = true;
    $('#dim-screen')[fadeIn?'fadeIn':'fadeOut'](duration, function() {
        disableEvents = false;
        if (cb) cb();
    });
}

