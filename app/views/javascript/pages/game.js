//=============================================================================
// game.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Dec 27 08:54:10 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

(function() {
    var unbindEvents = function() {};
    
    var stageSkin = undefined;
    var playMode  = 0;
    
    <?php $this->load->view('javascript/game/canvas.js'); ?>
    <?php $this->load->view('javascript/game/events.js'); ?>
    <?php $this->load->view('javascript/game/vdplayer.js'); ?>
    <?php $this->load->view('javascript/game/clock.js'); ?>
    <?php $this->load->view('javascript/game/secfloat.js'); ?>
    <?php $this->load->view('javascript/game/crypt.js'); ?>
    <?php $this->load->view('javascript/game/transition.js'); ?>
    <?php $this->load->view('javascript/game/loading.js'); ?>
    <?php $this->load->view('javascript/game/songplay.js'); ?>
    <?php $this->load->view('javascript/game/neonstage.js'); ?>
    <?php $this->load->view('javascript/game/songdata.js'); ?>
    <?php $this->load->view('javascript/game/stage.js'); ?>
    <?php $this->load->view('javascript/game/editor.js'); ?>

    Pages['v-game'] = {
        init: function(callback, args) {
            songInit(args);
            cvInit();
            evInit();
            ldInit();
        },

        kill: function() {
            cvRenderFunc = function() {};
            unbindEvents();
            Input.initNavModel();
        }
    };
})();

