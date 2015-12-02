//=============================================================================
// songplay.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Thu Jan 12 08:28:38 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

var spHeldButtons = [false, false, false, false, false, false];
var spDownButtons = [false, false, false, false, false, false];
var spHoldTimers  = [undefined, undefined, undefined, undefined, undefined];
var spFretsDone   = [false, false, false, false, false];
var spLongNotes   = [-1, -1, -1, -1, -1];

var spIgnitionTimer = undefined;
var spIgnitionTime  = 5;
var spAvDelay       = 0;
var spGlobalVolume  = 1;
var spPlayError     = false;

var spAfterPlayCalled = false;

var spScore         = new SecFloat();
var spStreak        = new SecFloat();
var spMultiplier    = new SecFloat(1);
var spGlobalMult    = new SecFloat(1);
var spLongestStreak = new SecFloat();

var spIsGuilty      = new SecFloat();
var spNoteCut       = new SecFloat();
var spMistakes      = new SecFloat();
var spMissedCount   = new SecFloat();

var spTbPower       = new SecFloat();

var spPaused = false;

function spNoteNbr(note) {
    if      ('g' == note || 'G' == note) return 0;
    else if ('r' == note || 'R' == note) return 1;
    else if ('y' == note || 'Y' == note) return 2;
    else if ('b' == note || 'B' == note) return 3;
    else if ('o' == note || 'O' == note) return 4;

    // Technically, we'll never have to face this. Unless in case of tweaking ;)
    alert('ERROR: unknown error');
    return -1;
}

function spIsTapNote(nc) {
    if (nc == 'g' || nc == 'r' || nc == 'y' || nc == 'b' || nc == 'o') {
        return false;
    }

    return true;
}

function spSubmitScore() {
    
}

function spKeyDown(c) {
    if (c >= 0 && c <= 5) {
        if (!spHeldButtons[c]) {
            spHeldButtons[c] = spDownButtons[c] = true;
        }
    }
    else if (c == KEY_BACK) {
        Pagination.slideBack();
    }
}

function spKeyUp(c) {
    if (c >= 0 && c <= 5) {
        spHeldButtons[c] = spDownButtons[c] = false;
        if (spHoldTimers[c]) spHoldTimers[c] = undefined; 
    }
}

function spGetCurrentTime() {
    var cTime;
    if (!spIgnitionTimer) {
        cTime = vdCurrentTime();
    }
    else {
        cTime = spIgnitionTimer.getTime() / 1e3 - spIgnitionTime;

        if (cTime > 0) {
            spIgnitionTimer = undefined;
            vdPlay();
            document.getElementById('video-mask').style.display = 'none';
        }
    }

    cTime += spAvDelay / 1e3;

    // Fade the screen before ending
    if (cTime + 0.6 > stDuration && !spAfterPlayCalled) {
        spAfterPlayCalled = true;
        transSetup(true, spSubmitScore);
    }

    return cTime;
}

function spCheckLongNotes(cTime) {
    // Check if current long notes are still the same as the last frame
    for (var i = 0; i < 5; ++i) {
        var index = spLongNotes[i];
        if (index == -1) continue;
        
        // if the note + its length are already past the current time
        // or if the note's timestamp isn't reached yet.
        var note = stNotes[index];
        if(!note || cTime >= note.ts + note.nd || cTime < note.ts) {
            if (spHoldTimers[i]) spHoldTimers[i] = null;
            spLongNotes[i] = -1;
        }
    }
}

function spFretSuccess() {
    spScore.add(100 * spMultiplier.get() * spGlobalMult.get());

    if (spIsGuilty.get() == 1) {
        vdVolume(spGlobalVolume);
        spIsGuilty.set(0);
    }
}

function spFretMissed(missedNote) {
    if (spStreak.get() > spLongestStreak.get()) {
        spLongestStreak.set(spStreak.get());
    }
    
    if (missedNote) spMissedCount.add(1);
    else            spPlayError = true;
    
    spStreak.set(0);
    spMultiplier.set(1);
    spMistakes.add(1);
    
    if (spIsGuilty.get() == 0) {
        spIsGuilty.set(1);
        vdVolume(0.3 * spGlobalVolume);
    }
}

function spStrumUpdate() {
    backCtx.clearRect(0, 0, backCvs.width, backCvs.height);
    stageCtx.clearRect(0, 0, stageCvs.width, stageCvs.height);

    var cTime = spGetCurrentTime();
    stDrawSplitLines(backCtx, cTime);
    spCheckLongNotes(cTime);

    var tbPower = spTbPower.get();
    var tapPlayed = false;

    // Iterate through notes
    stIterateNotes(cTime, function(i) {
        var note = stNotes[i];
        var ts   = note.ts;
        var nd   = note.nd;
        if (ts+nd <= cTime - 0.18335) return false;
        if (ts >= cTime + stNotesSpan) return;
        
        var nc   = note.nc;
        var nn   = spNoteNbr(nc);
        
        if (tbPower == 0x4F) nc = nc.toUpperCase();

        // Temporary, check that at least, a note is Beatrate/4 long
        if (!nd) nd = stBeatrate_4;

        // Check if there are any current long notes
        if (cTime >= ts && cTime < ts + nd) spLongNotes[nn] = i;

        var isTapValid = (spIsTapNote(nc) && spDownButtons[nn]
            && ((spNoteCut.get() == 0 && spIsGuilty.get() == 0)
            || tbPower == 0x4F));

        if (!spFretsDone[nn]
            && ts < cTime + stEarlyMargin && ts >= cTime + stLateMargin
            && ((spDownButtons[5] && spHeldButtons[nn]) || isTapValid)) {

            if (isTapValid) tapPlayed = true;
            spFretsDone[nn] = true;

            if (note.state != 1) {
                note.state = 1; // Played
                spFretSuccess();
            }
        }
        
        if (spLongNotes[nn] == i && !note.cut && note.state == 1) {
            if (spHeldButtons[nn]) {

                note.played = stNotes[i].played = cTime - ts;
                spNoteCut.set(0);

                if (!spHoldTimers[nn]) spHoldTimers[nn] = new Clock();

                // 5000 Score points per minute => 
                // Note that cvActualFramerate is in milliseconds
                if (nd > stBeatrate_4 && !spPaused) {
                    spScore.add(0.0833 * cvActualFramerate
                        * spMultiplier.get() * spGlobalMult.get());
                }
            }
            else {
                stNotes[i].cut = true;
                if (nd - note.played > stBeatrate_2) spNoteCut.set(1);
            }
        }

        // Draw the long note before messing with opacity
        if (nd > stBeatrate_4) {
            stDrawTail(
                cTime, nn, ts, ts + nd, note.played,
                spLongNotes[nn] == i, note.cut
            );
        }

        // Draw the notes
        if (ts > cTime || note.state != 1) {
            stDrawNote(cTime, ts, nc, nn);

            // If the note is late
            if (
                note.state != 1 && note.state != 2 && ts < cTime + stLateMargin
            ) {
                stNotes[i].state = 2; // Missed
                spFretMissed(true);
            }
        }
    });

    if (spDownButtons[5] || tapPlayed) {
        if (
            spFretsDone[0] || spFretsDone[1] || spFretsDone[2]
            || spFretsDone[3] || spFretsDone[4]
        ) {
            if (spMultiplier.set(0|(spStreak.add(1) / 10) + 1) > 4) {
                spMultiplier.set(4);
            }
        }
        // If the player pressed enter with no note at the validation margin
        else {
            spFretMissed();
            tapPlayed = spDownButtons[5] = false; // Disable the next checks
        }
    }

    for (var i = 0; i < 5; ++i) {
        // Check if the player has pressed Enter/Shift where he shouldn't
        if (spFretsDone[i] != spHeldButtons[i] && spDownButtons[5]) {
            spFretMissed();
            spDownButtons[5] = false; // Disable the next checks
        }

        spFretsDone[i] = spDownButtons[i] = false;
    }

    spDownButtons[5] = false;

    if (spPlayError) {
        SoundError();
        spPlayError = false;
    }
    
    // Render Fret buttons
    stageSkin.renderFrets(
        stageCtx, spHoldTimers, spLongNotes, spHeldButtons
    );

    hudCtx.clearRect(0, 0, 200, 200); // Clear only this portion for the moment
    hudCtx.font = '10px sans-serif';
    hudCtx.fillStyle = '#FFF';
    hudCtx.textBaseline = 'top';
    hudCtx.fillText('FPS: ' + ((1e3/cvActualFramerate + .5)|0), 10, 10);
    hudCtx.fillText('Score: ' + ((spScore.get() + .5)|0), 10, 20);
    hudCtx.fillText('Mistakes: ' + spMistakes.get(), 10, 30);
    hudCtx.fillText('Missed Notes: ' + spMissedCount.get(), 10, 40);
    hudCtx.fillText('Multiplier: ' + spMultiplier.get(), 10, 50);
    hudCtx.fillText('Streak: ' + spStreak.get(), 10, 60);
    hudCtx.fillText('CurrentTime: ' + (((cTime*100 + .5)|0) / 100), 10, 70);
}

function spTapUpdate() {
    backCtx.clearRect(0, 0, backCvs.width, backCvs.height);
    stageCtx.clearRect(0, 0, stageCvs.width, stageCvs.height);

    var cTime = spGetCurrentTime();
    stDrawSplitLines(backCtx, cTime);
    spCheckLongNotes(cTime);

    var tapPlayed = false;

    // Iterate through notes
    stIterateNotes(cTime, function(i) {
        var note = stNotes[i];
        var ts   = note.ts;
        var nd   = note.nd;
        if (ts+nd <= cTime - 0.18335) return false;
        if (ts >= cTime + stNotesSpan) return;

        var nc   = note.nc;
        var nn   = spNoteNbr(nc);

        // Temporary, check that at least, a note is Beatrate/4 long
        if (!nd) nd = stBeatrate_4;

        // Check if there are any current long notes
        if (cTime >= ts && cTime < ts + nd) spLongNotes[nn] = i;

        if (!spFretsDone[nn] && spDownButtons[nn]
            && ts < cTime + stEarlyMargin && ts >= cTime + stLateMargin) {

            spFretsDone[nn] = true;
            tapPlayed = true;

            if (note.state != 1) {
                note.state = 1; // Played
                spFretSuccess();
            }
        }
        
        if (spLongNotes[nn] == i && !note.cut && note.state == 1) {
            if (spHeldButtons[nn]) {

                note.played = stNotes[i].played = cTime - ts;
                spNoteCut.set(0);

                if (!spHoldTimers[nn]) spHoldTimers[nn] = new Clock();

                // 5000 Score points per minute
                // Note that cvActualFramerate is in milliseconds
                if (nd >= stBeatrate_4 && !spPaused) {
                    spScore.add(0.0833 * cvActualFramerate * spMultiplier.get() * spGlobalMult.get());
                }
            }
            else {
                stNotes[i].cut = true;
                if (nd - note.played > stBeatrate_2) spNoteCut.set(1);
            }
        }

        // Draw the long note before messing with opacity
        if (nd > stBeatrate_4) {
            stDrawTail(
                cTime, nn, ts, ts + nd, note.played,
                spLongNotes[nn] == i, note.cut
            );
        }

        // Draw the notes
        if (ts > cTime || note.state != 1) {
            stDrawNote(cTime, ts, nc, nn);

            // If the note is late
            if (
                note.state != 1 && note.state != 2 && ts < cTime + stLateMargin
            ) {
                stNotes[i].state = 2; // Missed
                spFretMissed(true);
            }
        }
    });

    var tapped = spDownButtons[0] || spDownButtons[1] || spDownButtons[2]
                 || spDownButtons[3] || spDownButtons[4];

    if (tapped || tapPlayed) {
        if (
            spFretsDone[0] || spFretsDone[1] || spFretsDone[2]
            || spFretsDone[3] || spFretsDone[4]
        ) {
            if (spMultiplier.set(0|(spStreak.add(1) / 10) + 1) > 4) {
                spMultiplier.set(4);
            }
        }
        // If the player pressed enter with no note at the validation margin
        else {
            spFretMissed();
            tapPlayed = false; // Disable the next checks
        }
    }

    for (var i = 0; i < 5; ++i) {
        spFretsDone[i] = spDownButtons[i] = false;
    }

    if (spPlayError) {
        SoundError();
        spPlayError = false;
    }

    // Render Fret buttons
    stageSkin.renderFrets(
        stageCtx, spHoldTimers, spLongNotes, spHeldButtons
    );

    hudCtx.clearRect(0, 0, 200, 200); // Clear only this portion for the moment
    hudCtx.font = '10px sans-serif';
    hudCtx.fillStyle = '#FFF';
    hudCtx.textBaseline = 'top';
    hudCtx.fillText('FPS: ' + ((1e3/cvActualFramerate + .5)|0), 10, 10);
    hudCtx.fillText('Score: ' + ((spScore.get() + .5)|0), 10, 20);
    hudCtx.fillText('Mistakes: ' + spMistakes.get(), 10, 30);
    hudCtx.fillText('Missed Notes: ' + spMissedCount.get(), 10, 40);
    hudCtx.fillText('Multiplier: ' + spMultiplier.get(), 10, 50);
    hudCtx.fillText('Streak: ' + spStreak.get(), 10, 60);
    hudCtx.fillText('CurrentTime: ' + (((cTime*100 + .5)|0) / 100), 10, 70);
}

function spInit() {
    // Setup keydown and keyup events
    setupEvents(spKeyDown, spKeyUp, undefined, undefined, undefined);

    spHeldButtons = [false, false, false, false, false, false];
    spDownButtons = [false, false, false, false, false, false];
    spHoldTimers  = [undefined, undefined, undefined, undefined, undefined];
    spFretsDone   = [false, false, false, false, false];
    spLongNotes   = [-1, -1, -1, -1, -1];
    document.getElementById('video-mask').style.display = 'block';

    // Reset Secured floats
    spScore.set(0);
    spMultiplier.set(1);
    spStreak.set(0);
    spLongestStreak.set(0);

    spNoteCut.set(0);
    spIsGuilty.set(0);
    spMistakes.set(0);
    spMissedCount.set(0);
    
    spTbPower.set(0); // TimeBreak Power, some sort of StarPower

    spPlayError  = false;

    // Setup stage and song data
    stInit();

    spAvDelay         = Settings.getVal('AvDelay');
    spGlobalVolume    = Settings.getVal('GlobalVolume');
    spAfterPlayCalled = false;

    // Setup video player
    vdPause();
    vdCurrentTime(0);
    vdVolume(spGlobalVolume);

    // Setup timer
    spIgnitionTimer = new Clock();

    // Setup HUD and NECK
    hudCtx.clearRect(0, 0, hudCvs.width, hudCvs.height);
    neckCtx.clearRect(0, 0, neckCvs.width, neckCvs.height);
    stageSkin.renderNeck(neckCtx);

    // Start Rendering
    if (songPlayMode == 1) cvRenderFunc = spTapUpdate;
    else                   cvRenderFunc = spStrumUpdate;

    transSetup(false);
}

