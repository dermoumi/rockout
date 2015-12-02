//=============================================================================
// stage.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Thu Jan 19 08:09:51 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/*
 * Contains functions that are common to both SongPlayScreen and EditorScreen
 */

var stNotes,
    stNotesCount,
    stDuration,
    
    stNotesSpan,
    stEarlyMargin,
    stLateMargin,
    
    stBeatrate,
    stBeatrate_2,
    stBeatrate_4,
    stBeatrate_8,
    
    stItDiv,
    stItCycle,
    stItIndices;

    var debugIndex;

function stDrawSplitLines(ctx, cTime) {
    var splitLineCount = (stNotesSpan/stBeatrate)|0 + 1;
    for (var i = 0; i < splitLineCount; ++i) {

        var percent = (cTime % stBeatrate + 1 + i * stBeatrate)/stNotesSpan;
        percent *= percent;

        var alpha = percent * 5.1;
        if (alpha > .6) alpha = .6;
        ctx.globalAlpha = alpha;
        
        stageSkin.renderSplitLine(ctx, percent);
    }
    ctx.globalAlpha = 1;
}

function stDrawDeepSplitlines(ctx, cTime) {
    var splitLineCount = ((stNotesSpan/stBeatrate)|0) * 4 + 1;
    for (var i = 0; i < splitLineCount; ++i) {

        var percent = (cTime % stBeatrate + i * stBeatrate_4)/stNotesSpan;
        percent *= percent;

        var alpha = percent * 5.1;

        if (i % 4 == 0) {
            if (alpha > .6) alpha = .6;
        }
        else {
            if (alpha > .12) alpha = .12;
        }

        ctx.globalAlpha = alpha;
        
        stageSkin.renderSplitLine(ctx, percent);
    }
    ctx.globalAlpha = 1;
}

function stDrawNote(cTime, ts, nc, nn) {
    var percent = 1 + (cTime - ts)/stNotesSpan;
    percent *= percent;
    
    stageSkin.renderNote(
        stageCtx, spIsTapNote(nc), (percent>=1.04249), nn, percent
    );
}

function stDrawTail(cTime, nn, start, end, played, current, cut) {
    if (start < cTime - .2 - played)  start = cTime - .2 - played;
    if (end > cTime + stNotesSpan)    end = cTime + stNotesSpan;

    // Makes the srcY point to the correct graphic depending of note type
    var startPercent = 1 + (cTime - start - played) / (stNotesSpan),
        endPercent   = 1 + (cTime - end) / (stNotesSpan);

    startPercent *= startPercent;
    endPercent *= endPercent;

    if (played) {
        if (endPercent > 1) endPercent = 1;
        if (startPercent > 1) startPercent = 1;
    }

    var lengthPercent = Math.abs(endPercent - startPercent);

    if (lengthPercent == 0) return;
    
    stageSkin.renderTail(
        backCtx, current && !cut && played, nn, lengthPercent, endPercent
    );
}

function stSetBPM(bpm) {
    if (!bpm) bpm = 120;
    
    stBeatrate    = 60 / bpm;
    stBeatrate_2  = stBeatrate / 2;
    stBeatrate_4  = stBeatrate / 4;
    stBeatrate_8  = stBeatrate / 8;
    
    stNotesSpan   = 5 * stBeatrate;
    
    // Values at a BPM of 120
    stLateMargin  = -0.17 * stNotesSpan / 2.5;
    stEarlyMargin = 0.155 * stNotesSpan / 2.5;
}

function stIterateNotes(cTime, cb) {
    if (!cb) return;

    if (stUpdIndices) {
        stItDiv     = 10;
        stItCycle   = (stNotesCount / stItDiv)|0;
        stItIndices = [];
        for (var i = 1; i < stItDiv + 1; ++i) {
            var index = i * stItCycle;
            if (stNotes[index]) stItIndices.push(stNotes[index].ts);
        }

        stUpdIndices = false;
    }

    var itIndex = 0;
    for (var i = 0; i < stItDiv; ++i) {
        itIndex = i;
        if (stItIndices[i] > cTime + stNotesSpan) break;
    }

    debugIndex = itIndex;
    
    // Run through all the notes
    for (var i = ((itIndex >= stItDiv - 1) || (stItCycle <= 1))
            ? stNotesCount - 1
            : (itIndex + 1) * stItCycle - 1;
        i >= 0; --i) {
        
        // Call the callback
        if(cb(i) === false) break;

    }
}

function stInit() {
    stNotes      = songNotes.slice(); // Copy, don't instanciate
    stNotesCount = stNotes.length;
    stDuration   = vdDuration(); // Assuming vdPlayer's loaded in ldScreen
    stUpdIndices = true;
    stSetBPM(songBpm);

    // Add/Reinit missing attributes
    for (var i = stNotesCount - 1; i >= 0; --i) {
        // played: how much of the note is played (seconds)
        // State: the state of the note, 0 unplayed, 1 played, 2 missed
        // Cut: If the long note was released before its ends (-Beatrate/8)
        stNotes[i].played = 0;
        stNotes[i].state = 0;
        stNotes[i].cut = false;
        if (songPlayMode == 1) stNotes[i].nc = stNotes[i].nc.toUpperCase();
    }
}