//=============================================================================
// pagination.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Dec 20 09:16:47 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/**
 *  Automatically guesses type of request from number of arguments
 */
function Ajax(url, callback, postdata) {
    var sig = '?' + new Date().getTime(); // Anti HTML Caching signature
    if (postdata !== undefined) $.post(url + sig, postdata, callback);
    else                        $.get (url + sig, callback);
}

/**
 *  Manages pages loading and sliding of the site
 */
var Pagination = (function() {
    /** @const */ var ANIM_DURATION = 400;
    var siteLoaded = false;
    var _currentPage = undefined;
    var loadingHtml = '<div class="loading-page"><div class="loading-block">'
        + '<div class="loading-illust"></div><p class="loading-caption">'
        + 'LANG{main_pleasewait}</p></div></div>';
    
    $(window).resize(assertScroll)
    .on('click', 'a.slider', function() {
        slideTo($(this).attr('href'));
        return false;
    }).on('click', 'a.backlink', function() {
        slideBack();
        return false;
    }).on('focus', '.page-content *', function(e) {
        if ($(this).parents('.' + Pages.getId())[0]) return;
        $(this).blur();
        e.stopPropagation();
        return false;
    });

    /**
     *  Get the top offset of an element relative to another element
     */
    function getTop(elem, parent) {
        parent = parent || $('#wrapper');
        return parent.scrollTop() + elem.position().top;
    }

    /**
     *  Makes sure the the viewport is synchronized with the current page's
     *    top offset. Useful to make sure the scrolling animation starts
     *    from the correct offset
     */
    function assertScroll() {
        $('#wrapper').scrollTop(getTop(cPage()));
    }

    /**
     *  Scrolls to a page inside #wrapper DOM element
     */
    function scrollTo(target, callback) {
        _currentPage = target;
        
        $('#wrapper').animate({ scrollTop: getTop(target) }, {
            complete: function() { callback && callback(), callback = null; },
            duration: ANIM_DURATION,
            queue:    false
        });

        // Note : we nullify callback so that it won't be called twice with
        //   Multiple elements (simultaneous) animations
    }
    
    /**
     *  Post-Slide callback for internal use
     */
    function slideToCb(load) {
        Navigation.disable(false);
        load.fadeOut({
            duration: ANIM_DURATION,
            queue:    false,
            complete: function() { load.remove(); }
        });
    }

    /**
     *  Loads a URL into a new .page and slides to it
     */
    function slideTo(url, postdata, keepLoadingMask) {
        var page = $('<div class="page"><div class="page-wrapper"></div></div>')
            .appendTo($('#wrapper'));
        var pagew = page.find('.page-wrapper');
        var load = $(loadingHtml).appendTo(pagew).show();

        Navigation.disable(true);

        assertScroll();
        scrollTo(page);
        SoundOk();

        Ajax(url, function(data) {
            pagew.append($(data));

            if (keepLoadingMask) {
                Pages.init(function() { slideToCb(load); });
            }
            else {
                Pages.init();
                slideToCb(load);
            }
        }, postdata);
    }
    
    /**
     *  Post-Slideback callback for internal use
     */
    function slideBackCb (index, page, callback) {
        assertScroll(); // The case of .empty-home having its height changed

        scrollTo(page, function() {
            $('div.page').slice(index+1).remove();
            callback && callback(), callback = null;
            Navigation.disable(false);
        });
    }

    /**
     *  Slides back to the previous .page inside #wrapper
     */
    function slideBack(depth, callback, prv) {
        var elems = $('div.page');
        if (elems.length <= 1 || !cPage()) return;

        depth = depth || 1;

        var index = elems.length - depth - 1;
        if (index < 0) index = 0;

        var page = elems.eq(index); // Make sure its shown
        var pagew = page.find('.page-wrapper');
        var p = Pages.get();

        // The page might not want to quit right away
        //   (Ex: exit confirmation for editor), the prv argument
        //   should indicate that we won't have to kill the page once again
        if (!prv && Pages.kill( function() {
            slideBack(depth, callback, true);
        }) === false) return;

        Navigation.disable(true);
        Pages.pop();

        SoundBack();

        if (page.hasClass('empty-home')) {
            $(loadingHtml).appendTo(cPage()).hide()
                .fadeIn(ANIM_DURATION, function() {
                    Ajax(SITE_URL, function(data) {
                        cPage().addClass('to-remove');

                        pagew.append($(data))
                        page.removeClass('empty-home');
                        Pages.init(undefined, index);

                        slideBackCb(index, page, callback);
                    });
                });
        }
        else {
            slideBackCb(index, page, callback);
        }
    }
    
    /**
     * Returns the current page
     */
    function cPage() {
        var a = _currentPage
            || (_currentPage = $('.page').not('.empty-home').first());

        return a;
    }
    
    /**
     *  Sets up all links on the page depending on their classes
     */
    function setupLinks() {
        // Setup the "Back" link
        if($('.page:not(.to-remove)').length <= 1) return;

        $('<a href="#" class="backlink"><span>LANG{main_back}</span></a>')
            .appendTo(cPage());
    }
    
    // The interface of the Modulee
    return {
        /**
         *  Gets a the current page
         *  @return A jQuery object of the current .page
         */
        setupLinks: setupLinks,
        slideTo:    slideTo,
        slideBack:  slideBack
    };
})();

