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
    ldSkinLoaded,

    hideLdMaskCb;
    
ldImage.onload = function() {
    ldImageLoaded = true;
}
ldImage.src = BASE_URL + 'assets/img/loading_guitar.png';

function ldAssertLoaded() {
    if (!vdReady
     || cvRenderFunc != ldUpdate
     || (ldLoadedPercent = vdLoaded()) < 0.01
     || !ldSkinLoaded
    ) {
         return false;
    }
    
    return true;
}

function ldUpdate() {
    // if (ldLoadedPercent == 1) return;

    ldIsLoaded = ldAssertLoaded();
    
    // Only update screen when percent increases :)
    if (isNaN(ldLoadedPercent)) ldLoadedPercent = 0;
    if (ldLastPercent >= ldLoadedPercent && ldLoadedPercent != 0) return;
    ldLastPercent = ldLoadedPercent;
    
    hudCtx.fillStyle = '#000';
    hudCtx.fillRect(0, 0, hudCvs.width, hudCvs.height);

    var posX = (hudCvs.width/2 - 244.5)|0;
    var posY = (hudCvs.height/2 - 99.5)|0;
    
    hudCtx.drawImage(ldImage, 0, 0, 491, 199, posX, posY, 491, 199);
    
    var illustHeight = (199*ldLoadedPercent+.5)|0;
    if (illustHeight > 0) {
        var ySrc = 398 - illustHeight;
        if (ySrc <= 397) {
            hudCtx.drawImage(
                ldImage,
                0,    ySrc,
                491,  illustHeight,
                posX, (hudCvs.height/2 - illustHeight + 99)|0,
                491,  illustHeight
            );
        }
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
    if (vdAltLoad) {
        hudCtx.font = '14px Prociono';
        hudCtx.fillText(
            'Using alternative, but slower loading method',
            hudCvs.width/2, hudCvs.height - 30
        );

        hudCtx.font = '12px Prociono';
        hudCtx.fillText(
            "Seems like Youtube Player is having problems loading videos",
            hudCvs.width/2, hudCvs.height - 14
        );
    }
    
    hudCtx.textAlign = 'left';
}

function ldInit() {

    // Reset some values
    ldLoadedPercent = 0;
    ldSkinLoaded    = false;
    ldIsLoaded      = ldAssertLoaded();
    ldLastPercent   = -1;

    vdInit(songVidID);

    // Load the stage's skin
    stageSkin = new NeonStage(function() {ldSkinLoaded = true});

    // Guess which screen to load
    var screen = (songPlayMode == 2) ? edInit : spInit;

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
    undefined,
    undefined,
    undefined,
    function() { // Resize
        // Resetting these to zero will force ldUpdate to render again
        ldLastPercent = -1;
        ldLoadedPercent = 0;
    });

    // Fade out dim mask and setup update function
    transSetup(false);
    cvRenderFunc = ldUpdate;
}

