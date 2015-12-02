//=============================================================================
// sound.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Sun Jan 15 01:56:13 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

var SoundOk, SoundBack, SoundError;
(function() {
    var soundMgrReady = false;
    var volume = Settings.getVal('SfxVolume');

    soundManager.url = BASE_URL + 'assets/swf/';
    soundManager.flashVersion = 9;
    soundManager.useFlashBlock = false;

    soundManager.onready(function() {
        soundMgrReady = true;

        loadSound('ok');
        loadSound('back');
        loadSound('err1');
        loadSound('err2');
        loadSound('err3');
        loadSound('err4');
    });

    soundManager.ontimeout(function() {
        console.log('Silly');
    });

    function playSound(file) {
        if (!soundMgrReady) return;
        soundManager.play(file, {volume: volume});
    }
    
    function loadSound(file) {
        soundManager.createSound(file, BASE_URL+'assets/sounds/'+file+'.mp3');
        // TODO : Make it fallback to a .ogg file when not using flash
    }
    
    SoundOk = function() {
        playSound('ok');
    };
    
    SoundBack = function() {
        playSound('back');
    };
    
    SoundError = function() {
        playSound('err'+((Math.random()*4 + 1)|0));
    };
})();

