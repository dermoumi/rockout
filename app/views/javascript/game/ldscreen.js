//=============================================================================
// ldscreen.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Thu Jan 12 04:30:56 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

var ldImageLoaded = false,
    ldImage = document.createElement('img'),

    ldLoadedPercent,
    ldLastPercent,
    ldIsLoaded,
    ldLoadedCount;
    
ldImage.onload = function() {
    ldImageLoaded = true;
}
ldImage.src = BASE_URL + 'assets/img/loading_guitar.png';

function ldCheck() {
    ldLoadedCount = 0;
    
    //if (songDataLoaded)   ++ldLoadedCount;
    //if (stageSkin._image) ++ldLoadedCount;
}

function ldAssertLoaded() {
    if (!vdPlayer
     || cvRenderFunc != ldUpdate
     || (ldLoadedPercent = vdPlayer.getLoaded()) < .1
     // || ldLoadedCount < 2
    ) {
         return false;
    }
    
    return true;
}

function ldUpdate() {
    if (ldLoadedPercent == 1) return;

    ldIsLoaded = ldAssertLoaded();
    
    // Only update screen when percent increases :)
    if (isNaN(ldLoadedPercent)) ldLoadedPercent = 0;
    if (ldLastPercent >= ldLoadedPercent) return;
    ldLastPercent = ldLoadedPercent;
    
    if (ldLoadedPercent >= .05) {
        callback && callback(); callback = undefined;
    }
    
    hudCtx.fillStyle = '#000';
    hudCtx.fillRect(0, 0, hudCvs.width, hudCvs.height);

    var posX = (hudCvs.width/2 - 244.5)|0;
    var posY = (hudCvs.height/2 - 99.5)|0;
    
    hudCtx.drawImage(ldImage, 0, 0, 491, 199, posX, posY, 491, 199);
    
    var illustHeight = (199*ldLoadedPercent+.5)|0;
    if (illustHeight > 0) {
        var ySrc = (398.5 - 199*ldLoadedPercent)|0;
        if (ySrc > 397) return;
        
        hudCtx.drawImage(
            ldImage, 0, ySrc,
            491,        illustHeight,
            posX,       (hudCvs.height/2 - 199*ldLoadedPercent + 99.5)|0,
            491,        illustHeight
        );
    }
    
    hudCtx.fillStyle = '#FFF';
    hudCtx.font = '28px Prociono';
    hudCtx.textAlign = 'center';
    hudCtx.fillText('%s% Loaded'.replace(
        '%s', ((ldLoadedPercent * 100)|0)
        ), hudCvs.width/2, hudCvs.height/2);
    
    if (ldIsLoaded) {
        hudCtx.font = '14px Prociono';
        hudCtx.fillText(
            'Press Pick key to continue', hudCvs.width/2, hudCvs.height/2 + 30
        );
    }
    
    hudCtx.textAlign = 'left';
}

function ldInit() {
    // Check if everything is loaded at the start
    ldIsLoaded       = ldAssertLoaded();
    // Reset some values
    ldLoadedCount    = 0;
    ldLastPercent    = -1;
    
    // Mute the player
    vdPlayer.setVolume(0);
    // Guess which screen to load
    var screen = (args['mode'] == 2) ? edInit : spInit;

    // Setup keydown and resize events
    setupEvents(function(c) { // Keydown
        if (c == KEY_PICK && ldIsLoaded && screen) {
            transSetup(true, screen);
            screen = undefined;
        }
        else if (c == KEY_BACK) {
            Pagination.slideBack();
        }
    },
    undefined, undefined, undefined, function() { // Resize
        // Resetting these to zero will force ldUpdate to render again
        ldLastPercent = 0;
        ldLoadedPercent = 0;
    });

    // Fade out dim mask and setup update function
    transSetup(false);
    cvRenderFunc = ldUpdate;
}

