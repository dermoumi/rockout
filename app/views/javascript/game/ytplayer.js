//=============================================================================
// ytplayer.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Dec 27 10:00:41 2011
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
function YtPlayer(id, vidID, callback)
{
    this._handle  = undefined;
    this._cmdStack = [];
    this._timer    = new Clock();
    this._altLoad  = false;
    
    var _this = this;

    var elem = document.getElementById(id).parentNode;
    
    // ONLY use Youtube's iframe API when there's no flash,
    //   Actually, youtube's API don't provide 'wmode="opaque"' which
    //   allows layering DOM elements over Flash element
    if (!window['swfobject']['hasFlashPlayerVersion']('8')) {
        new YT.Player(id, {
            videoId: vidID,
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
                    onPlayerReady(e.target)
                },
                'onStateChange': function(e) {
                    onPlayerStateChange(e.data)
                }
            }
        });
    }
    else {
        window['onYtPlayerStateChange'] = onPlayerStateChange;
        window['onYouTubePlayerReady'] = function() {
            onPlayerReady(document.getElementById('video-player'));
        }
        swfobject['embedSWF'](
            'http://www.youtube.com/e/' + vidID + '?enablejsapi=1'
            + '&playerapiid=ytPlayer&controls=0&disablekb=1&showinfo=0'
            + '&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3',
            'video-player', elem.clientWidth, elem.clientHeight, '8', undefined,
            undefined, {'allowScriptAccess': 'always', 'wmode': 'opaque'},
            {'id': id}
        );
    }

    function onPlayerStateChange(state)
    {
        if (state == 1) _this._timer.resume();
        else            _this._timer.pause();
        
        var cTime = (_this._handle && _this._handle['getCurrentTime']) ?
            _this._handle['getCurrentTime']() * 1e3 : 0;
        _this._timer.setTime(cTime);
    }
    
    function onPlayerReady(target)
    {
        var player = _this._handle = target;
        
        // Let the video load without starting
        _this.play();
        _this._timer.setTime(_this._handle['getCurrentTime']() * 1e3);
        
        for (i in _this._cmdStack) {
            _this._cmdStack[i]();
        }
        _this._cmdStack = [];
        
        if (callback) callback();
        
        setTimeout(function() {
            // Additionnal test in cas the video removed before 10s has passed
            if (_this._handle && _this._handle['getVideoBytesLoaded']
                && _this._handle['getVideoBytesLoaded']() <= 0) {
                _this._altLoad = true;
            }
        }, 1e4)
    }
}

YtPlayer.prototype.getDuration = function()
{
    if (this._handle) return this._handle['getDuration']();
    return undefined;
}

YtPlayer.prototype.getLoaded = function()
{
    if (!this._handle) return 0;
    
    var percent;
    if (this._handle['getDuration']() <= 0) {
        return 0;
    }
    else if (this._altLoad) {
        percent = this._handle['getCurrentTime']()
            / (this._handle['getDuration']() || 1);
    }
    else {
        percent = this._handle['getVideoBytesLoaded']()
            / (this._handle['getVideoBytesTotal']() || 1);
    }
    
    if (isNaN(percent)) return 0;
    else                return percent;
}

YtPlayer.prototype.setVolume = function(val)
{
    var _this = this;
    function fnc() { _this._handle['setVolume'](val * 100); }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else                fnc();
    
    return this;
}

YtPlayer.prototype.getVolume = function()
{
    if (!this._handle) return 0;
    return this._handle['getVolume']() / 100;
}

YtPlayer.prototype.play = function()
{
    var _this = this;
    function fnc() {
        _this._handle['playVideo']();
        _this._timer.setTime(_this._handle['getCurrentTime']() * 1e3);
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else                fnc();
    
    return this;
}

YtPlayer.prototype.pause = function()
{
    var _this = this;
    function fnc() {
        _this._handle['pauseVideo']();
        _this._timer.setTime(_this._handle['getCurrentTime']() * 1e3);
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else                fnc();
    
    return this;
}

YtPlayer.prototype.getCurrentTime = function()
{
    return this._timer.getTime() / 1e3;
}

YtPlayer.prototype.setCurrentTime = function(val)
{
    var _this = this;
    function fnc() {
        _this._handle['seekTo'](val, true);
        // Update player side current time
        if (_this._handle['getPlayerState']() != 1) { // Not playing
            _this._handle['playVideo']();
            _this._handle['pauseVideo']();
        }
        _this._timer.setTime(_this._handle['getCurrentTime']() * 1e3);
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else                fnc();
    
    return this;
}

YtPlayer.prototype.isPlaying = function()
{
    if (this._handle) return (this._handle['getPlayerState']() == 1);
    return false;
}

YtPlayer.prototype.hasEnded = function()
{
    if (this._handle) return (this._handle['getPlayerState']() == 0);
    return false;
}

/*
 * References :
 * http://code.google.com/apis/youtube/js_api_reference.html
 *
 * Needs :
 * swfobject.js, http://www.youtube.com/player_api
 */
