//==============================================================================
// navmenu.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Dec  6 19:20:10 GMT 2011.
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//==============================================================================

/**
 *  Setups links and navigation assets of the page
 */
var NavMenu = (function() {
    var isDisabled = false,
        mouseUsed  = false;

    /** @const */ var CURRENT_ITEM = '.nav-menu-item.current-item';

    /**
     *  Checks the current element's visibility on the viewport, and scrolls it
     *   to fit
     */
    function assertVisibility() {
        var elem    = Pages.current().find(CURRENT_ITEM),
            page    = Pages.current(),
            pageTop = page.scrollTop(),
            top     = elem.offset().top;

        if (top < 0) {
            page.animate({
                scrollTop: pageTop + top - 10
            }, {
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
    }

    /**
     *  Called when UP key is pressed
     */
    function onUp() {
        if (isDisabled) return;
        if ($(CURRENT_ITEM).find('input:focus')[0]) return false;

        mouseUsed = false;
        var currentDefined = false,
            items = Pages.current().find('.nav-menu').find('.nav-menu-item');
        
        // Look for the current item
        items.each(function(i) {
            var item = $(this);
            if (item.hasClass('current-item')) {
                // We found our current item, next item will be the current one
                var currentIndex = i - 1;
                if (currentIndex < 0) currentIndex = items.length - 1;
                
                // Move "current-item"
                item.removeClass('current-item');
                $(items[currentIndex]).addClass('current-item');
                
                // Everything's done
                currentDefined = true;
                return false;
            }
        });
        
        // We found no current item, let's set the last one as current
        if (!currentDefined) {
            Pages.current().find('.nav-menu .nav-menu-item:last')
                .addClass('current-item');
        }
        assertVisibility();
    }
    
    /**
     *  Called when DOWN key is pressed
     */
    function onDown() {
        if (isDisabled) return;
        if ($(CURRENT_ITEM).find('input:focus')[0]) return false;
        
        mouseUsed = false;
        var currentDefined = false,
            items = Pages.current().find('.nav-menu').find('.nav-menu-item');
            
        // Look for the current item
        items.each(function(i) {
            var item = $(this);
            if (item.hasClass('current-item')) {
                // We found our current item, prev item will be the current one
                var currentIndex = i + 1;
                if (currentIndex >= items.length) currentIndex = 0;
                
                // Move "current-item"
                item.removeClass('current-item');
                $(items[currentIndex]).addClass('current-item');
                
                // Everything's done
                currentDefined = true;
                return false;
            }
        });
        
        // We found no current item, let's set the first one as current
        if (!currentDefined) {
            Pages.current().find('.nav-menu .nav-menu-item:first')
                .addClass('current-item');
        }
        
        assertVisibility();
    }
    
    /**
     *  Called when PICK key is pressed
     */
    function onEnter() {
        if (isDisabled) return;
        if ($(CURRENT_ITEM + ' input:focus')[0]) return false;
        
        mouseUsed = false;
        var aElem = Pages.current()
            .find('.nav-menu').find(CURRENT_ITEM);
        
        if (aElem.hasClass('slider')) { // Slide to the page on the link
            console.log("hi3");
            var link = aElem.attr('href');
            if (link != '#') NavPage.slideTo(link); // # links are disabled
        }
        else if (aElem.hasClass('settings-option')) {
            console.log("hi1");
            aElem.find('.number-input').focus();
            return false;
        }
        else if(aElem.hasClass('settings-save')) {
            console.log("hi4");
            PageSettings.save();
        }
        else if(aElem.hasClass('settings-reset')) {
            console.log("hi2");
            PageSettings.reset();
        }
        else {
            console.log("hi");
            return false;
        }
    }
    
    /**
     *  Called when BACK key is pressed
     */
    function onBack() {
        if (isDisabled) return;

        mouseUsed = false;
        var aElem = Pages.current()
            .find('.nav-menu').find(CURRENT_ITEM);

        if (aElem.hasClass('settings-option') && aElem.find('input:focus')[0]) {
            aElem.find('input').blur();
        }
        else {
            NavPage.slideBack();
        }
    }
    
    /**
     *  Called when one of the other play keys is pressed
     */
    function onOther(c) {
        mouseUsed = false;
        var aElem = Pages.current()
            .find('.nav-menu').find(CURRENT_ITEM);

        if ($('input:focus')[0]) {
            return false;
        }
        else if(c == KEY_LEFT && aElem.hasClass('settings-option')) {
            PageSettings.subValue(aElem);
        }
        else if(c == KEY_RIGHT && aElem.hasClass('settings-option')) {
            PageSettings.addValue(aElem);
        }
    }

    /**
     *  Sets up different links on the page
     */
    function setup() {
        Pages.current()
            .on('mouseenter', '.nav-menu-item', function() {
                $('.nav-menu .nav-menu-item').removeClass('current-item');
                $(this).addClass('current-item');
                mouseUsed = true;
            }).on('mouseleave', '.nav-menu-item', function() {
                if (!mouseUsed) return;
                $(this).removeClass('current-item');
            }).on('click', '.nav-menu-item', function() {
                var val = onEnter();
                return true;
            });
            
        Input.initNavModel(onUp, onDown, onEnter, onBack, onOther);
    }
    
    // Setup runtime handlers
    runtimeObj['setupMenu'] = setup;
    
    return {
        /**
         *  Disables NavMenu
         *  
         *  @param {boolean=} disabled TRUE to disable, FALSE to not
         *  @return The current disability state of NavMenu
         */
        disable: function(disabled) {
            if (disabled !== undefined) isDisabled = disabled;
            return isDisabled;
        },

        setupMenu: setup
    };
})();

