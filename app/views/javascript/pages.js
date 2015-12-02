//=============================================================================
// pages.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Mon Dec 19 09:37:41 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

var Pages = (function() {
    var pagesStack = [];

    runtimeObj['addPage'] = function(id, args) {
        // Add to the stack
        pagesStack.push({
            id: id,
            args: args,
            elem: $('.page:not(.to-remove):last')
        });
    };

    return {
        get: function(index) {
            if (isNaN(index)) index = pagesStack.length - 1;

            return Pages[pagesStack[index].id];
        },

        init: function(callback, index) {
            if (isNaN(index)) index = pagesStack.length - 1;
            var p = Pages[pagesStack[index].id];

            if (p.init) return p.init(callback, pagesStack[index].args);
        },

        kill: function(callback, index) {
            var p = this.get(index);
            if (p.kill) return p.kill(callback);
        },

        getElem: function(index) {
            if (isNaN(index)) index = pagesStack.length - 1;

            return pagesStack[index].elem;
        },

        getId: function(index) {
            if (isNaN(index)) index = pagesStack.length - 1;
            return pagesStack[index].id;
        },

        remove: function(index) {
            if (isNaN(index)) return pagesStack.pop();
            return pagesStack.splice(index, 1);
        },

        pop: function() {
            return pagesStack.pop();
        }
    }
})();

