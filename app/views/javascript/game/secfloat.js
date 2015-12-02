//=============================================================================
// secfloat.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Jan 10 15:18:28 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

function SecFloat(v) {
    if (!v) v = 0;
    this.set(v);
}

// Mult/Div by 10^6 so that we won't lose floats due to use of bytewise operators
SecFloat.prototype.get = function() {
    return ((this.value ^ 0x15F1A) - 0xDE4B3F) / 1e3;
    return parseFloat(this.value);
}

SecFloat.prototype.set = function(v) {
    this.value = (v * 1e3 + 0xDE4B3F) ^ 0x15F1A;
    return v;
}

SecFloat.prototype.add = function(v) {
    return this.set(this.get() + v);
}

