//=============================================================================
// songdata.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Wed Jan 18 20:53:03 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

var songData     = undefined;
var songNotes    = undefined;
var songBpm      = undefined;
var songPlayMode = undefined;
var songVidID    = undefined;

function songReadData(str) {
    str = Base64Decode(str);
    if (str.length < 8) return false;

    var keyStr = Crypt(str.substr(-8), ':T*K25k6');
    var data = Crypt(str.substr(0, str.length - 8), keyStr).split('!');

    if (!data[0] || data[0] != 'RKT1.0') return false;

    return data;
}

function songParseNotes(str) {
    if (str == '') return [];
    var table = str.split('~');
    var notes = [];
    for (var i = 0; i < table.length; i+=3) {
        notes.push({
            nc: table[i],
            ts: parseFloat(table[i+1]),
            nd: parseFloat(table[i+2])
        });
    }
    return notes;
}

function songInit(songdata) {
    var data = songReadData(songdata);
    songData = songdata;

    songNotes    = songParseNotes(data[3]);
    songVidID    = data[2].substr(2);
    songBpm      = data[4];
    songPlayMode = data[1];
}