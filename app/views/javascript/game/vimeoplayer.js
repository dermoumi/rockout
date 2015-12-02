//=============================================================================
// vimeoplayer.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Wed Dec 28 16:06:39 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

function VimeoPlayer(id, vidID, callback)
{
    this._handle    = undefined;
    this._cmdStack  = [];
    this._cTime     = 0;
    this._pctLoaded = 0;
    this._state     = -1;
    this._isIframe  = false;
    this._volume    = 1;

    var _this = this;
    var elem  = document.getElementById(id).parentNode;
    var iframe = undefined;

    this._ = function(fncName) {
        if (_this._isIframe) return fncName;
        return 'api_' + fncName;
    };

    // ONLY use iframe API when there's no flash,
    //   Actually, flash API don't provide 'wmode="opaque"' which
    //   allows layering DOM elements over Flash element
    if (!swfobject['hasFlashPlayerVersion']('8')) {
        this._isIframe = true;
        iframe = document.createElement('iframe');
        iframe.src = 'http://player.vimeo.com/video/' + vidID
            + '?api=1&color=660000&title=0&byline=0&portrait=0';
        iframe.frameborder = 0;
        $f(iframe).addEvent('ready', function() {
            onPlayerReady($f(iframe));
        })
        document.getElementById(id).appendChild(iframe);
    }
    else {
        this._isIframe = false;
        window['vimeo_player_loaded'] = function() {
            onPlayerReady(document.getElementById('video-player'));
        }
        swfobject['embedSWF'](
            'http://vimeo.com/moogaloop.swf?clip_id=' + vidID
            + '&server=vimeo.com&color=660000&api=1'
            + '&title=0&byline=0&portrait=0',
            'video-player', elem.clientWidth, elem.clientHeight, '8', undefined,
            undefined, {'allowScriptAccess': 'always', 'wmode': 'opaque'},
            {'id': id}
        );
    }

    function onPlayerStateChange(state) {
        _this._state = state;
    }

    window['rktVmPause'] = function() {
        onPlayerStateChange(3);
    }

    window['rktVmPlay'] = function() {
        onPlayerStateChange(1);
    }

    window['rktVmStop'] = function() {
        onPlayerStateChange(0);
    }
    
    window['rktVmLdPgrss'] = function(e) {
        var pct = parseFloat(e.percent);
        _this._pctLoaded = isNaN(pct) ? 0 : pct;
    }
    
    window['rktVmPlPgrss'] = function(e) {
        var time = parseFloat(e.seconds);
        _this._cTime = isNaN(time) ? 0 : time;
    }
    
    function onPlayerReady(target)
    {
        var player = _this._handle = target;

        if (_this._isIframe) {
            player.addEvent('pause', window['rktVmPause']);
            player.addEvent('play', window['rktVmPlay']);
            player.addEvent('finish', window['rktVmStop']);
            player.addEvent('loadProgress', window['rktVmLdPgrss']);
            player.addEvent('playProgress', window['rktVmPlPgrss']);
        }
        else {
            player['api_addEventListener']('pause', 'rktVmPause');
            player['api_addEventListener']('play', 'rktVmPlay');
            player['api_addEventListener']('finish', 'rktVmStop');
            player['api_addEventListener']('loadProgress', 'rktVmLdPgrss');
            player['api_addEventListener']('playProgress', 'rktVmPlPgrss');
        }

        // Let the video load without starting
        _this.play();
        _this.setVolume(1);
        
        for (i in _this._cmdStack) {
            _this._cmdStack[i]();
        }
        _this._cmdStack = [];
        
        if (callback) callback();
    }
}

VimeoPlayer.prototype.getDuration = function() {
    if (!this._handle) return 0;
    if (this._isIframe) return this._handle['api']('getDuration');
    return this._handle['api_getDuration']();
}

VimeoPlayer.prototype.getLoaded = function() {
    if (!this._handle) return 0;
    return this._pctLoaded;
}

VimeoPlayer.prototype.setVolume = function(val)
{
    this._volume = val;
    var _this = this;
    function fnc() {
        if (_this._isIframe) _this._handle['api']('setVolume', val);
        else                 _this._handle['api_setVolume'](val);
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else               fnc();
    
    return this;
}

VimeoPlayer.prototype.getVolume = function()
{
    return this._volume;
}

VimeoPlayer.prototype.play = function()
{
    var _this = this;
    function fnc() {
        if (_this._isIframe) _this._handle['api']('play');
        else                 _this._handle['api_play']();
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else               fnc();
    
    return this;
}

VimeoPlayer.prototype.pause = function()
{
    var _this = this;
    function fnc() {
        if (_this._isIframe) _this._handle['api']('pause');
        else                 _this._handle['api_pause']();
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else                fnc();
    
    return this;
}

VimeoPlayer.prototype.getCurrentTime = function()
{
    return this._cTime;
}

VimeoPlayer.prototype.setCurrentTime = function(val)
{
    var _this = this;
    function fnc() {
        if (_this._isIframe) _this._handle['api']('seekTo', val);
        else                 _this._handle['api_seekTo'](val + 1);
    }
    
    if (!this._handle) this._cmdStack.push(fnc);
    else               fnc();
    
    return this;
}

VimeoPlayer.prototype.isPlaying = function()
{
    if (this._handle) return (this._state == 1);
    return false;
}

VimeoPlayer.prototype.hasEnded = function()
{
    if (this._handle) return (this._state == 0);
    return false;
}

/*
 * References :
 * http://code.google.com/apis/youtube/js_reference.html
 *
 * Needs :
 * swfobject.js, http://www.youtube.com/player_api
 */
