//=============================================================================
// clock.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Dec 27 11:09:41 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

function Clock() {
    this._startTime = new Date().getTime();
    this._time  = 0;
    this._isPaused  = 0;
}

Clock.prototype.reset = function() {
    this._startTime = new Date().getTime();
    this._time    = 0;
}

Clock.prototype.getTime = function() {
    if (this._isPaused) return this._time;
    
    var time = new Date().getTime();
    this._time += time - this._startTime;
    this._startTime = time;
    return this._time;
}

Clock.prototype.pause = function() {
    // Make sure time wasn't already paused, otherwize messes everything
    if (this._isPaused) return;
    
    this._isPaused = true;
    this._time += new Date().getTime() - this._startTime;
}

Clock.prototype.resume = function() {
    // Same note
    if(!this._isPaused) return;
    
    this._isPaused = false;
    this._startTime = new Date().getTime();
}

Clock.prototype.setTime = function(v) {
    this._time = v;
    this._startTime = new Date().getTime();
}

