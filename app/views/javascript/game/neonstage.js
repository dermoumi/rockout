//=============================================================================
// neonstage.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Sat Jan 14 15:26:16 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

function NeonStage(loadingCb) {
    var _this = this;

    this._image = undefined;
    this._fretsCoords = [
        0,   95,  14,   93, // Frets dimensions
        95,  92,  106,  91,
        187, 90,  199,  89,
        277, 92,  289,  91,
        369, 96,  379,  94
    ];

    // Load interface image
    var img = document.createElement('img');
    img.onload = function() {
        _this._image = this;
        if(loadingCb) {
            loadingCb();
            loadingCb = undefined;
        }
    }
    img.src = BASE_URL + 'assets/skins/neonstage.png';
}

NeonStage.prototype.renderNeck = function(ctx, time) {
    ctx.drawImage(this._image, 0, 0, 482, 385, 2, 0, 482, 385);
}

NeonStage.prototype.renderSplitLine = function(ctx, percent) {
    ctx.lineWidth = 4 * percent;
    ctx.strokeStyle = '#FFF';
    ctx.lineCap = 'round';
     
    ctx.beginPath();
    ctx.moveTo(193 - 177 * percent, 1 + 353 * percent);
    ctx.lineTo(293 + 177 * percent, 1 + 353 * percent);
    ctx.stroke();
}

NeonStage.prototype.renderNote = function(ctx, tap, dim, nn, percent) {
    var vOffset = tap ? 20 : 0;
    
    // Dim the note if past the current time
    if (dim) {
        vOffset += 40; // A graphic of a darkened note
    }
    else {
        var alpha = percent * 5.1;
        if (alpha > 1) alpha = 1;
        ctx.globalAlpha = alpha;
    }

    var width, srcX, xPos, xFactor;
        
    // Set coordinates and dimensions of the note
    if (nn == 0) {
        width   = 92;
        srcX    = 0;
        xPos    = 192.5;
        xFactor = -177;
    }
    else if (nn == 1) {
        width   = 91;
        srcX    = 92;
        xPos    = 213.5;
        xFactor = -107;
    }
    else if (nn == 2) {
        width   = 89;
        srcX    = 183;
        xPos    = 233.5;
        xFactor = -34;
    }
    else if (nn == 3) {
        width   = 90;
        srcX    = 272;
        xPos    = 253.5;
        xFactor = 36;
    }
    else { // if nn == 4
        width   = 93;
        srcX    = 362;
        xPos    = 273.5;
        xFactor = 106;
    }
    
    var wFactor = width - 20; // width factor

    ctx.drawImage(
        this._image,
        srcX, 460 + vOffset,
        width, 20,
        (xPos+xFactor*percent)|0, (345*percent-.5)|0,
        (20.5+wFactor*percent)|0, (4.5+16*percent)
    );

    ctx.globalAlpha = 1;
}

NeonStage.prototype.renderTail = function(ctx, playing, nn, lengthPercent, endPercent) {
    var vOffset = (playing) ? 385.5 : 0.5;
    
    var length  = (lengthPercent * 353 + 0.5)|0;
    if (length <= 0) return;

    // if (nn == 0)
    var width = 168;
    var xPos  = 38;
    var srcX  = 482;
    
    if (nn == 1) {
        width = 92;
        xPos  = 134;
        srcX  = 650;
    }
    else if (nn == 2) {
        width = 26;
        xPos  = 230;
        srcX  = 742;
    }
    else if (nn == 3) {
        width = 92;
        xPos  = 260;
        srcX  = 768;
    }
    else if (nn == 4) {
        width = 168;
        xPos  = 281;
        srcX  = 860;
    }
    
    ctx.drawImage(
        this._image,
        srcX, (vOffset + endPercent*353)|0, width, length,
        xPos, (1.5 + endPercent*353)|0,     width, length
    );
}

NeonStage.prototype.renderFrets = function(ctx, holdTimers, longNotes, heldButtons) {
    ctx.drawImage(this._image, 252, 540, 134, 3, 13, 337, 458, 3);
    ctx.drawImage(this._image, 248, 543, 142, 3, 0, 369, 485, 3);
    
    if (!holdTimers) holdTimers = new Array(5);

    var fretsCoords = this._fretsCoords;
    for (var i = 0; i < 5; ++i) {
        ctx.globalAlpha = 1;
        var srcX = fretsCoords[i * 4];
        var srcW = fretsCoords[i * 4 + 1];
        var dstX = fretsCoords[i * 4 + 2];
        var dstW = fretsCoords[i * 4 + 3];

        var vOffset = 385;
        var timer = holdTimers[i];
        if (timer && longNotes[i] != -1) vOffset += 50;
        else if (heldButtons[i])         vOffset += 25;

        ctx.drawImage(
            this._image, srcX, vOffset, srcW, 25, dstX, 343, dstW, 22
        );

        if (timer && longNotes[i] != -1) {
            ctx.globalCompositeOperation = 'lighter';
            for(var j = 0; j < 4; ++j) {
                var f = (timer.getTime() + j*125)/500 % 1;
                ctx.globalAlpha = 1 - f;
                ctx.drawImage(
                    this._image, srcX, 410, srcW, 25,
                    dstX, (343.5-20*f)|0, dstW, 22
                );
            }
            ctx.globalCompositeOperation = 'source-over';
        }
    }
}

NeonStage.prototype.renderSelector = function(ctx, col) {
    var xPos, srcX, width;

    if (col == 0) {
        xPos  = 1;
        srcX  = 319;
        width = 182;
    }
    else if (col == 1) {
        xPos  = 96;
        srcX  = 501;
        width = 126;
    }
    else if (col == 2) {
        xPos  = 193;
        srcX  = 627;
        width = 97;
    }
    else if (col == 3) {
        xPos  = 261;
        srcX  = 724;
        width = 124;
    }
    else {    
        xPos  = 301;
        srcX  = 848;
        width = 180;
    }

    ctx.drawImage(this._image, srcX, 769, width, 297, xPos, 88, width, 297);
}

