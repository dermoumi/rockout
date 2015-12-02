//=============================================================================
// pageevents.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Sat Dec 10 20:56:20 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/**
 *  Handle PageEvents and their settings and callbacks
 *
 *  @return A handling interface
 */
var rkt_pageevents = (function() {
    var pageEventsStack = [],
        onSetupCb       = function() {};
    
    /**
     *  Dummy function for filling
     *
     *  @param {*=} e First parameter to be filled or not
     */
    function dummyFnc(e) {
        // Nothing to do
    }

    /**
     *  Setups page event handlers
     *  
     *  @param {boolean=}  playModel Set determines control type
     *  @param {boolean=}  backable  Whether we can go back to the previous 
     *  @param {Function=} loadCb    A callback called when the page's loaded
     *  @param {Function=} unloadCb  A callback called before removing the page
     */
    runtimeObj['setupPage'] = function(playModel, backable, loadCb, unloadCb) {
        pageEventsStack[$('.page:not(.to-remove)').length - 1] = {
            canGoBack:   backable,
            isPlayModel: playModel,
            load:        loadCb   || dummyFnc,
            unload:      unloadCb || dummyFnc
        };

        onSetupCb();
    };

    /*
     * Object external handlers
     */
    return {
        /**
         * Sets an onSetup callback
         *
         * @param {Function=} callback The callback to set, undefined to remove
         */
        onSetup: function(callback) {
            onSetupCb = callback || dummyFnc;
        },

        /**
         * Returns the pageEvents of a certain index
         *
         * @param {number=} index   The index of the pageEvent to get,
         *                          undefined to get the last one
         * @return The wanted PageEvent or the last one if index is out of range
         */
        get: function(index) {
            var pageEvCount = pageEventsStack.length;
            if (!index || index >= pageEvCount) {
                index = $('.page:not(.to-remove)').length - 1;
            }

            return pageEventsStack[index];
        },

        /**
         * Removes the last PageEvent and returns it,
         * Will not remove the only element of the stack
         *
         * @return The last PageEvents of the stack;
         */
        pop: function() {
            var pageEvCount = pageEventsStack.length;
            if (pageEvCount > 1) return pageEventsStack.pop();

            return pageEventsStack[pageEvCount - 1];
        }
    };
}());
