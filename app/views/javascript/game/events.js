//=============================================================================
// events.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Wed Jan 11 20:09:27 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

var keydownEvent    = function(c) {},
    keyupEvent      = function(c) {},
    visibilityEvent = function() {},
    blurEvent       = function() {},
    resizeEvent     = function() {},

    tabHidden       = false;

function setupEvents(keydown, keyup, visibility, blur, resize) {
    keydownEvent    = keydown    || function(c) {};
    keyupEvent      = keyup      || function(c) {};
    visibilityEvent = visibility || function() {};
    blurEvent       = blur       || function() {};
    resizeEvent     = resize     || function() {};
}

function resizeFunc() {
    var page = $('.v-game');
    if (page[0]) {
        var padding = (window.innerHeight > 480 && window.innerWidth > 640) ? 20 : 0;
        page.css({height: window.innerHeight - padding});

        var container = document.getElementById('vd-container');
        var width = container.clientWidth;
        var height = container.clientHeight;

        var iframe = container.getElementsByTagName('iframe')[0];
        if (iframe) {
            iframe.width = width;
            iframe.height = height;
        }

        var hudCvs = document.getElementById('hud-canvas');
        if (hudCvs.width != width)   hudCvs.width  = width;
        if (hudCvs.height != height) hudCvs.height = height;

        var cvsWidth = neckCvs.width;
        var cvsHeight = neckCvs.height;
        function setCvsSize(attr, val) {
            val = (val+.5)|0;
            neckCvs.style[attr] = val + 'px';
            backCvs.style[attr] = val + 'px';
            stageCvs.style[attr] = val + 'px';
        } 
        if (width >= cvsWidth && height >= cvsHeight) {
            setCvsSize('width', cvsWidth);
            setCvsSize('height', cvsHeight);
        }
        else {
            if (width < cvsWidth && height < cvsHeight) {
                if (cvsWidth < cvsHeight) {
                    setCvsSize('width', width);
                    setCvsSize('height', width * cvsHeight/cvsWidth);
                }
                else {
                    setCvsSize('width', height * cvsWidth/cvsHeight);
                    setCvsSize('height', height);
                }
            }
            else if (width < cvsWidth) {
                setCvsSize('width', width);
                setCvsSize('height', width * cvsHeight/cvsWidth);
            }
            else {
                setCvsSize('width', height * cvsWidth/cvsHeight);
                setCvsSize('height', height);
            }
        }
    }
}

function resizeEv() {
    if (tabHidden || cvRenderPause) return;

    resizeFunc();
    resizeEvent();
    cvDraw();
}

function visibilityEv() {
    tabHidden = document['webkitHidden'];
    if (tabHidden) {
        cvRenderPause = true;
    }
    else {
        cvRenderPause = false;
        cvDraw();
    }
    
    visibilityEvent(tabHidden);
}

function blurEv() {
    blurEvent();
}

function unbindEvents() {
    document.removeEventListener('webkitvisibilitychange', visibilityEv, false);
    window.removeEventListener('blur', blurEv, false);
}

function evInit() {
    Input.initPlayModel(
        function(c) {keydownEvent(c)},
        function(c) {keyupEvent(c)}
    );
    resizeFunc();
}

document.addEventListener('webkitvisibilitychange', visibilityEv, false);
window.addEventListener('blur', blurEv, false);
window.addEventListener('resize', resizeEv, false);

