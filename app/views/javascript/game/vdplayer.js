//=============================================================================
// vdplayer.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Sun Jan 15 16:44:28 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

var vdHandle = undefined;
var vdTimer = undefined;
var vdCallback = undefined;
var vdAltLoad = undefined;
var vdReady = false;

function vdDuration() {
    if (!vdReady) return 0;
    return vdHandle.getDuration();
}

function vdLoaded() {
    if (!vdReady) return 0;
    
    var pct;
    if (vdHandle.getDuration() <= 0) {
        return 0;
    }
    else if (vdAltLoad) {
        pct = vdHandle.getCurrentTime() / (vdHandle.getDuration() || 1);
    }
    else if (vdHandle.getVideoBytesTotal() <= 0) {
        return 0;
    }
    else {
        pct = vdHandle.getVideoBytesLoaded()/(vdHandle.getVideoBytesTotal()||1);
    }
    
    if (isNaN(pct)) return 0;
    else            return pct;
}

function vdVolume(value) {
    if (!vdReady) return 1;

    if (!isNaN(value)) {
        vdHandle.setVolume(value);
        return value;
    }

    return vdHandle.getVolume();
}

function vdPlay() {
    if (!vdReady) return;

    vdHandle.playVideo();
    vdTimer.setTime(vdHandle.getCurrentTime() * 1e3);
}

function vdPause() {
    if (!vdReady) return;

    vdHandle.pauseVideo();
    vdTimer.setTime(vdHandle.getCurrentTime() * 1e3);
}

function vdCurrentTime(value) {
    if (!vdReady) return 0;

    if (value === true) {
        var time = vdHandle.getCurrentTime();
        vdTimer.setTime(time * 1e3);
        return time;
    }
    else if (!isNaN(value)) {
        var state = vdHandle.getPlayerState();
        vdHandle.playVideo();
        vdHandle.seekTo(value, true);

        if (state != 1) { // Not playing
            vdHandle.pauseVideo();
        }

        vdTimer.setTime(vdHandle.getCurrentTime() * 1e3);
    }

    return vdTimer.getTime() / 1e3;
}

function vdOnError(error) {
    // TODO
}

function vdOnStateChange(state) {
    vdTimer.setTime(vdHandle.getCurrentTime() * 1e3);
}

function vdOnReady(target) {
    vdHandle = target;

    vdHandle.playVideo();
    vdHandle.setVolume(0);
    vdTimer.setTime(vdHandle.getCurrentTime() * 1e3);

    vdReady = true;

    if (vdCallback) {
        vdCallback();
        vdCallback = undefined;
    }
}

function vdInit(vidId, callback) {
    vdHandle   = undefined;
    vdTimer    = new Clock;
    vdCallback = callback;
    vdReady    = false;
    vdAltLoad = undefined;

    var id = 'video-player';
    var elem = document.getElementById(id).parentNode;

    if (!swfobject.hasFlashPlayerVersion('8')) {
        function onApiReady() {
            if (!YT.Player) {
                setTimeout(onApiReady, 400);
                return;
            }
            new YT.Player(id, {
                videoId: vidId,
                width: elem.clientWidth,
                height: elem.clientHeight,
                playerVars: {
                    controls: 0,
                    disablekb: 1,
                    showinfo: 0,
                    iv_load_policy: 3,
                    rel: 0,
                    modestbranding: 0
                },
                events: {
                    'onReady': function(e) {
                        vdOnReady(e.target);
                    },
                    'onStateChange': function(e) {
                        vdOnStateChange(e.data);
                    },
                    'onError': function(e) {
                        vdOnError(e.data);
                    }
                }
            });
        }
        onApiReady();
    }
    else {
        window.onYtPlayerError       = vdOnError;
        window.onYtPlayerStateChange = vdOnStateChange;
        window.onYouTubePlayerReady  = function() {
            var target = document.getElementById('video-player');

            target.addEventListener('onStateChange', 'onYtPlayerStateChange');
            target.addEventListener('onError', 'onYtPlayerError');

            vdOnReady(target);

            setTimeout(function() {
                // Additionnal test in cas the video removed before 10s has passed
                if (target && target.getVideoBytesLoaded
                    && target.getVideoBytesTotal() <= 0) {
                    vdAltLoad = true;
                }
            }, 4e3);
        };

        swfobject.embedSWF(
            'http://www.youtube.com/e/' + vidId + '?enablejsapi=1'
            + '&playerapiid=ytPlayer&disablekb=1&showinfo=0'
            + '&modestbranding=1&rel=0&controls=0&iv_load_policy=3',
            'video-player', elem.clientWidth, elem.clientHeight, '8', undefined,
            undefined, {'allowScriptAccess': 'always', 'wmode': 'opaque'},
            {'id': id }
        );
    }
}

