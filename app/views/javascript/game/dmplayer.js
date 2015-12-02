//=============================================================================
// dmplayer.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Thu Dec 29 06:52:22 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/**
 * Loads Youtube player into a DOM elem and provides a uniform controlling
 *   interface
 *
 * @param id       ID of the DOM element to put iframe into or to replace with
 *                    SWFObject element.
 * @param vidID    11 character Youtube id of the video to load
 * @param callback A function to call when the video is loaded and can start
 *                    playing
 */
function DmPlayer(id, vidID, callback)
{
    this._handle   = undefined;
    this._cmdStack = [];
    this._timer    = new Clock();
    this._isIframe = false;
    this._cTime    = 0;
    this._state    = -1;

    var _this = this;

    var elem = document.getElementById(id).parentNode;
    
    // ONLY use Youtube's iframe API when there's no flash,
    //   Actually, youtube's API don't provide 'wmode="opaque"' which
    //   allows layering DOM elements over Flash element
    if (!window['swfobject']['hasFlashPlayerVersion']('8')) {
        this._isIframe = true;
        var player = new DM.player(id, {
            video: vidID,
            width: elem.clientWidth,
            height: elem.clientHeight,
            params: {
                enableApi:  1,
                chromeless: 1,
                explicit:   0
            }
        });

        player.addEventListener('apiready', function(e) {
            onPlayerReady(e.target);
        });
    }
    else {
        this._isIframe = false;
        window['onDailymotionPlayerReady'] = function() {
            console.log('ready');
            onPlayerReady(document.getElementById('video-player'));
        }
        swfobject['embedSWF'](
            'http://www.dailymotion.com/swf/' + vidID + '?chromeless=1'
            + '&enableApi=1&explicit=0',
            'video-player', elem.clientWidth, elem.clientHeight, '8', undefined,
            undefined, {'allowScriptAccess': 'always', 'wmode': 'opaque'},
            {'id': id}
        );
    }

    window['rktDmState'] = function(state) {
        if (state == 2) state = 3;
        _this._state = state;
    }

    window['rktDmPause'] = function(e) {
        window['rktDmState'](3);
    }

    window['rktDmPlay'] = function() {
        window['rktDmState'](1);
    }

    window['rktDmStop'] = function() {
        window['rktDmState'](0);
    }
    
    window['rktDmPlPgrss'] = function(data) {
        var loaded = parseFloat(data.mediaBytesReceived);
        var total  = parseFloat(data.mediaBytesTotal);
        if (total == 0) total = 1e10;
        _this._pctLoaded = isNaN(loaded) ? 0 : loaded/duration;
        if (_this._pctLoaded > 1) _this._pctLoaded = 1;

        var time      = parseFloat(data.mediaTime);
        _this._cTime = isNaN(time) ? 0 : time;
    }

    function onProgress(e) {
        var loaded   = parseFloat(e.target.bufferedTime);
        var duration = parseFloat(e.target.duration);
        if (duration == 0) duration = 1e10;
        _this._pctLoaded = isNaN(loaded) ? 0 : loaded/duration;
        if (_this._pctLoaded > 1) _this._pctLoaded = 1;

        var time     = parseFloat(e.target.currentTime);
        _this._cTime = isNaN(time) ? 0 : time;
    }
    
    function onPlayerReady(target)
    {
        _this._handle = target;
        
        if (_this._isIframe) {
            target.addEventListener('pause', window['rktDmPause']);
            target.addEventListener('playing', window['rktDmPlay']);
            target.addEventListener('ended', window['rktDmStop']);
            target.addEventListener('progress', onProgress);
        }
        else {
            target.addEventListener('onStateChange', 'rktDmState');
            target.addEventListener('onVideoProgress', 'rktDmPlPgrss');
        }

        setTimeout(function() {
            if (callback) callback();
            _this.play();
        }, 2e3);
        
        for (i in _this._cmdStack) {
            _this._cmdStack[i]();
        }
        _this._cmdStack = [];
    }
}

DmPlayer.prototype.getDuration = function()
{
    if (!this._handle) return 0;
    if (_this._isIframe) return this._handle['duration'];
    return this._handle['getDuration']();
}

DmPlayer.prototype.getLoaded = function()
{
    if (!this._handle) return 0;
    return this._pctLoaded;
}

DmPlayer.prototype.setVolume = function(val)
{
    var _this = this;
    function fnc() {
        if (_this._isIframe) _this._handle['setVolume'](val);
        else                 _this._handle['setVolume'](val * 100);
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else                fnc();
    
    return this;
}

DmPlayer.prototype.getVolume = function()
{
    if (!this._handle) return 0;
    if (_this._isIframe) return this._handle['volume'];
    return this._handle['getVolume']();
}

DmPlayer.prototype.play = function()
{
    var _this = this;
    function fnc() {
        if (_this._isIframe) _this._handle['api']('play');
        else                 _this._handle['playVideo']();
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else               fnc();
    
    return this;
}

DmPlayer.prototype.pause = function()
{
    var _this = this;
    function fnc() {
        if (_this._isIframe) _this._handle['api']('pause');
        else                 _this._handle['pauseVideo']();
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else                fnc();
    
    return this;
}

DmPlayer.prototype.getCurrentTime = function()
{
    if (!this._handle) return 0;
    if (_this._isIframe) return this._handle['currentTime'];
    return this._cTime;
}

DmPlayer.prototype.setCurrentTime = function(val)
{
    var _this = this;
    function fnc() {
        if (_this._isIframe) _this._handle['api']('seek', val);
        else                 _this._handle['seekTo'](val);
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else                fnc();
    
    return this;
}

DmPlayer.prototype.isPlaying = function()
{
    if (this._handle) return (this._state == 1);
    return false;
}

DmPlayer.prototype.hasEnded = function()
{
    if (this._handle) return (this._state == 0);
    return false;
}

/*
 * References :
 * http://code.google.com/apis/youtube/js_api_reference.html
 *
 * Needs :
 * swfobject.js, http://www.youtube.com/player_api
 */
