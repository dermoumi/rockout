//=============================================================================
// canvas.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Wed Jan 11 19:58:02 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

var neckCvs, neckCtx,
    backCvs, backCtx,
    stageCvs, stageCtx,
    hudCvs, hudCtx,
    cvWidth, cvHeight,
    
    // 60FPS is barely good enough for this kind of games :/
    // Might limit it to at least 80, 120 is best
    cvFramerate       = 1e3/Settings.getVal('FPS'),
    cvActualFramerate = 0,
    cvRenderPause     = false,
    cvRenderFunc      = function() {},

    // Use the built(in rendering function of the browser
    cvRenderFrame     = (function() {
        return window['requestAnimationFrame']       ||
               window['webkitRequestAnimationFrame'] ||
               window['mozRequestAnimationFrame']    ||
               window['oRequestAnimationFrame']      ||
               window['msRequestAnimationFrame']     ||
               function(callback) {
                   window.setTimeout(callback, cvActualFramerate);
               };
    })();

function cvDraw() {
    // Make sure our canvas didn't get deleted
    if (cvRenderPause || !document.getElementById('neck-canvas')) return;
    
    var startTime = new Date().getTime();
    cvRenderFunc();
    cvActualFramerate = new Date().getTime() - startTime;

    // If higher than desired FPS (faster, takes less time)
    if (cvActualFramerate <= cvFramerate) cvActualFramerate = cvFramerate;
    
    cvRenderFrame(cvDraw);
}

function cvInit() {
    neckCvs  = document.getElementById('neck-canvas');
    neckCtx  = neckCvs.getContext('2d');
    backCvs  = document.getElementById('back-canvas');
    backCtx  = backCvs.getContext('2d');
    stageCvs = document.getElementById('stage-canvas');
    stageCtx = stageCvs.getContext('2d');
    hudCvs   = document.getElementById('hud-canvas');
    hudCtx   = hudCvs.getContext('2d');

    cvWidth  = neckCvs.width  = backCvs.width  = stageCvs.width = 485,
    cvHeight = neckCvs.height = backCvs.height = stageCvs.height = 385,
    //neckCvs.style.maxWidth  = stageCvs.style.maxWidth  = cvWidth + 'px';
    //neckCvs.style.maxHeight = stageCvs.style.maxHeight = cvHeight + 'px';

    hudCtx.textBaseline = 'top';

    cvFramerate = 1e3/Settings.getVal('FPS');
    cvActualFramerate = 0;
    cvRenderPause     = false;
    cvRenderFunc      = function() {};

    cvDraw();
}

