//=============================================================================
// editor.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Thu Jan 19 07:46:54 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

var edHeldButtons,
    edCTime,
    edIsPlaying,
    edSelectedCol,
    edColCount,
    edNotes,
    edNotesCount,
    edDuration,

    edAvDelay,
    edGlobalVolume,

    edAddNote,
    edRemoveNote,
    edNotesToAdd,
    edCurrentNotes,
    edPrevCurrentNotes,
    edHeldNotes,
    edUpdateNotesDuration,

    edHoldTimers = [undefined, undefined, undefined, undefined, undefined],
    edTimeAssert = new Clock();

function edNoteCode(nbr, tap) {
    var nc = (nbr==0)?'g':((nbr==1)?'r':((nbr==2)?'y':((nbr==3)?'b':'o')));
    if (tap) nc = nc.toLowerCase();
    return nc;
}

function edNearestValidTime() {
    var time = vdCurrentTime(true);
    var left = time % stBeatrate_4;
    if (left > stBeatrate_8) return time + stBeatrate_4 - left;
    else                     return time - left;
}

function edKeyDown (c) {
    if (c >= 0 && c <= 5) {
        if (!edHeldButtons[c]) {
            edHeldButtons[c] = true;
            if (c != 5) edAddNote = true;
        }
    }
    else if (c == KEY_UP) {
        if (edIsPlaying || edCTime >= stDuration - 0.6 - stBeatrate_4) return;

        edCTime += stBeatrate_4;
        edUpdateNotesDuration = 2;
        //console.log(edCurrentNotes, edHeldNotes);
    }
    else if (c == KEY_DOWN) {
        if (edIsPlaying || edCTime < stBeatrate_4) return;

        edCTime -= stBeatrate_4;
        edUpdateNotesDuration = 1;
        //console.log(edCurrentNotes, edHeldNotes);
    }
    else if (c == KEY_LEFT) {
        if (--edSelectedCol < 0) {
            edSelectedCol = edColCount - 1;
        }
    }
    else if (c == KEY_RIGHT) {
        if (++edSelectedCol >= edColCount) edSelectedCol = 0;
    }
    else if (c == KEY_SPACE) {
        if (edIsPlaying = !edIsPlaying) vdPlay();
        else                            vdPause();

        edCTime = edNearestValidTime();
        edTimeAssert.setTime(0);
    }
    else if (c == KEY_BACK) {
        Pagination.slideBack();
    }
}

function edKeyUp (c) {
    if (c >= 0 && c <= 5) {
        edHeldButtons[c] = false;
        if (c != 5) edHeldNotes[c] = -1;
    }
    else if (c == KEY_UP || c == KEY_DOWN) {
        if (edIsPlaying) return;
        vdCurrentTime(edCTime);
    }
    else if (c == KEY_TBREAK || c == KEY_DELETE) {
        edRemoveNote = true;
    }
    else if (c == KEY_TAB) {
        console.log(edCurrentNotes, edHeldNotes);
    }
}

function edUpdate () {
    backCtx.clearRect(0, 0, backCvs.width, backCvs.height);
    stageCtx.clearRect(0, 0, stageCvs.width, stageCvs.height);

    if (edIsPlaying) {
        if (edTimeAssert.getTime() < 1e3) edCTime = vdCurrentTime(true);
        else                              edCTime = vdCurrentTime();
    }

    var cTime = edCTime + edAvDelay;

    if (edUpdateNotesDuration != 0) {
        var ts2 = -1;

        // In/Decrease the note's duration
        for (var i = 0; i < 5; ++i) {
            var index = edHeldNotes[i];
            if (index >= 0 && index < stNotesCount) {
                ts2 = stNotes[index].ts;
                var nd = cTime - ts2;
                if (nd >= stBeatrate_4) stNotes[index].nd = nd;
            }
        }

        for (var i = 0; edUpdateNotesDuration == 2
            && ts2 >= 0 && cTime >= ts2 && i < 5; ++i) {
            var cNote = edCurrentNotes[i];
            if (cNote < 0 || cNote == edHeldNotes[i] || stNotes[cNote].ts == ts2)
                continue;

            stNotes[cNote].nd -= cTime - stNotes[cNote].ts;
            stNotes[cNote].ts = cTime;

            if (stNotes[cNote].nd <= stBeatrate_4) {
                stNotes.splice(cNote, 1);
                edCurrentNotes[i] = -1;
            }
            else if (edPrevCurrentNotes[i] >= 0
                && stNotes[edPrevCurrentNotes[i]].nd <= stBeatrate_4) {
                stNotes.splice(cNote, 1);
                edPrevCurrentNotes[i] = -1;
            }
            else {
                continue;
            }
            stNotesCount--;
            stUpdIndices = true;
        }

        edUpdateNotesDuration = 0;
    }

    stDrawDeepSplitlines(backCtx, cTime);
    stageSkin.renderSelector(backCtx, edSelectedCol);

    edCurrentNotes = [-1, -1, -1, -1, -1];
    edPrevCurrentNotes = [-1, -1, -1, -1, -1];
    stIterateNotes(cTime, function(i) {
        var note = stNotes[i];
        var ts   = note.ts;

        if (ts < cTime + stNotesSpan) {
            var nc   = note.nc;
            var nd   = note.nd;
            var nn   = spNoteNbr(nc);

            stDrawNote(cTime, ts, nc, nn);
            stDrawTail(cTime, nn, ts, ts + nd, note.played, false, note.cut);

            if (edCurrentNotes[nn] < 0 && ts <= cTime && ts + nd > cTime) {
                edCurrentNotes[nn] = i;
            }
            else if (edPrevCurrentNotes[nn] < 0 && ts + nd == cTime) {
                edPrevCurrentNotes[nn] = i;
            }
        }

        for (var j = 0; edAddNote && j < 5; ++j) {
            if (ts <= cTime || !edHeldButtons[j]) continue;
            edNotesToAdd[j] = i;
        }
    });

    if (edRemoveNote) {
        var cNote = edCurrentNotes[edSelectedCol];
        var ts = (cNote<0) ? -1 : stNotes[cNote].ts;
        if (ts >= 0 && ts >= cTime-stBeatrate_8 && ts < cTime+stBeatrate_8) {
            stNotes.splice(cNote, 1);
            stNotesCount--;
                stUpdIndices = true;
        }

        edRemoveNote = false;
    }

    for (var i = 0; edAddNote && i < 5; ++i) {
        var index = edNotesToAdd[i];
        var ts = (edCurrentNotes[i]<0) ? -1 : stNotes[edCurrentNotes[i]].ts;
        
        // if there's already a note in this position, just select it
        if (edHeldButtons[i] && ts >= 0
            && ts >= cTime-stBeatrate_8 && ts < cTime+stBeatrate_8) {
            edHeldNotes[i] = edCurrentNotes[i];
            continue;
        }

        // Otherwise, add a new note
        if (index < 0) continue;

        // Cut down the long notes intersectng with this one
        for (var j = 0; j < 5; ++j) {
            var cNote = edCurrentNotes[j];
            var ts2 = (cNote<0) ? -1 : stNotes[cNote].ts;
            if (ts2>=0
                && (ts2<cTime-stBeatrate_8 || ts>=cTime+stBeatrate_8)) {
                stNotes[cNote].nd = cTime - ts2;
            }
        }

        stNotes.splice(index, 0, {
            nc: edNoteCode(i),
            ts: cTime,
            nd: stBeatrate_4,
            played: 0,
            state: 0,
            cut: false
        });
        edHeldNotes[i] = index;
        stNotesCount++;
        stUpdIndices = true;
    }
    edNotesToAdd = [-1, -1, -1, -1, -1];
    edAddNote = false;

    // Render Fret buttons
    stageSkin.renderFrets(stageCtx, edHoldTimers, undefined, edHeldButtons);

    hudCtx.clearRect(0, 0, 200, 200); // Clear only this portion for the moment
    hudCtx.font = '10px sans-serif';
    hudCtx.fillStyle = '#FFF';
    hudCtx.textBaseline = 'top';
    hudCtx.fillText('FPS: ' + ((1e3/cvActualFramerate + .5)|0), 10, 10);
    hudCtx.fillText('CurrentTime: ' + (((cTime*100 + .5)|0) / 100), 10, 20);
}

function edInit () {
    // Setup keydown and keyup events
    setupEvents(edKeyDown, edKeyUp, undefined, undefined, undefined);

    edHeldButtons = [false, false, false, false, false, false];
    edCTime       = 0;
    edSelectedCol = 0;
    edColCount    = 5; // For the moment, drum and bass might have 4 columns
    edIsPlaying   = false;
    edTimeAssert.setTime(4e3);
    document.getElementById('video-mask').style.display = 'block';

    edAddNote       = false;
    edRemoveNote    = false;
    edNotesToAdd    = [-1, -1, -1, -1, -1];
    edCurrentNotes  = [-1, -1, -1, -1, -1];
    edHeldNotes     = [-1, -1, -1, -1, -1];
    edPrevCurrentNotes = [-1, -1, -1, -1, -1];

    stInit();

    edAvDelay         = Settings.getVal('AvDelay') / 1e3;
    edGlobalVolume    = Settings.getVal('GlobalVolume');

    vdPause();
    vdCurrentTime(0);
    vdVolume(edGlobalVolume);

    hudCtx.clearRect(0, 0, hudCvs.width, hudCvs.height);
    neckCtx.clearRect(0, 0, neckCvs.width, neckCvs.height);
    stageSkin.renderNeck(neckCtx);

    transSetup(false);
    cvRenderFunc = edUpdate;
}

