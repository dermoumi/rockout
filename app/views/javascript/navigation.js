//=============================================================================
// Navigation.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Mon Dec 19 09:19:14 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

var Navigation = (function() {
    var focusable = '.nav-menu-item, select, input, textarea, button';
    var inputDisabled = false;
    /*
     * Bind mouse events
     *
     *  + When the mouse hovers a NavMenuItem we remove CurrentItem class
     *      from all NavMenuItems of the current page, and add it to the
     *      hovered one
     *  + When the mouse leaves a CurrentItem, we remove the class from it
     */
    $(document).on('mouseenter', '.nav-menu-item', function() {
        setCurrentItem($(this));
    })
    .on('mouseleave', '.current-item', function() {
        var _this = $(this);
        if (_this.find(':focus')[0]) return;
        _this.removeClass('current-item');
    })
    .on('focus', '.nav-menu-item', function() {
        var _this = $(this);
        if (!_this.hasClass('current-item')) setCurrentItem(_this);
    })
    .on('click', '.nav-menu-item', function() {
        var _this = $(this);
        if (_this.hasClass('no-event')) return;

        setCurrentItem(_this);
        onEnter(_this);
        return false;
    }).on('mousedown', ':not(.nav-menu-item)', function() {
        if ($(this).parents('.current-item')[0]) return;
        $('.current-item').removeClass('current-item');
    });

    function setCurrentItem(elem, force) {
        if (!elem[0] || $('input:focus')[0]) return;

        var cItem = Pages.getElem().find('.current-item');
        cItem.removeClass('current-item');
        elem.addClass('current-item');
        assertVisibility();
    }

    /**
     *  Checks the current element's visibility on the viewport, and scrolls it
     *   to fit
     */
    function assertVisibility() {
        var page    = Pages.getElem();
        var elem    = page.find('.current-item');
        var pageTop = page.scrollTop();
        var top     = undefined;
        if (elem.offset()) top = elem.offset().top;
        if (!top) return;
        
        if (top < 0) {
            page.animate({ scrollTop: pageTop + top - 10 }, {
                duration: 300,
                queue: false
            });
        }
        else if (top + elem.height() > page.height()) {
            page.animate({
                scrollTop: pageTop + top + elem.height() - page.height() + 20
            }, {
                duration: 300,
                queue: false
            });
        }
        // */
    }

    /*
     * Keyboard callbacks
     */
    function onUp() {
        var elems = Pages.getElem().find('.nav-menu-item').filter(':visible');

        if (!Pages.getElem().find('.current-item')[0]) {
            elems.last().addClass('current-item');
            return;
        }

        elems.each(function(i) {
            var _this = $(this);
            if (!_this.hasClass('current-item')) return;

            var elem = elems.eq((i || elems.length) - 1);

            _this.removeClass('current-item');
            elem.addClass('current-item');

            var page = Pages.get();
            page.onMenuElemChange && page.onMenuElemChange(elem);

            return false;
        });

        assertVisibility();
    }

    function onDown() {
        var elems = Pages.getElem().find('.nav-menu-item').filter(':visible');

        if (!Pages.getElem().find('.current-item')[0]) {
            elems.first().addClass('current-item');
            return;
        }

        elems.each(function(i) {
            var _this = $(this);
            if (!_this.hasClass('current-item')) return;

            var elem = elems.eq((i == elems.length-1) ? 0 : i + 1);
            _this.removeClass('current-item');
            elem.addClass('current-item');

            var page = Pages.get();
            page.onMenuElemChange && page.onMenuElemChange(elem);

            return false;
        });

        assertVisibility();
    }

    function onEnter(elem) {
        elem = elem || Pages.getElem().find('.current-item');

        var page = Pages.get();
        var returnVal;
        page.onEnter && (returnVal = page.onEnter(elem));
        if (returnVal === false) return false;

        if(elem.hasClass('slider')) Pagination.slideTo(elem.attr('href'));
    }

    function onBack() {
        Pagination.slideBack();
    }

    function onOther(c) {
        var page = Pages.get();
        page.onOtherKey && page.onOtherKey(c);
    }
    
    /*
     * Handler interface
     */
    return {
        /*
         * Called by Input module when a key is pressed
         */
        KeyDown: function(c) {
            if (inputDisabled) return;
            
            if (c == KEY_UP)
                return onUp();
            else if (c == KEY_DOWN || c == KEY_TAB)
                return onDown();
            else if (c == KEY_ENTER || c == KEY_SPACE || c == KEY_PICK)
                return onEnter();
            else if (c == KEY_BACK)
                return onBack();
            else
                return onOther(c);
        },
        
        disable: function(disabled) {
            inputDisabled = disabled;
        },

        setCurrentItem: setCurrentItem
    };
})();

