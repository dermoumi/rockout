//==============================================================================
// navpage.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Wed Dec  7 06:14:30 GMT 2011.
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//==============================================================================

/**
 *  Handles page loading and navigation
 */
var rkt_navpage = (function() {
    /** @const */ var ANIM_DURATION = 400;
    var currentPage = undefined;
    var loadingHtml = '<div class="loading-page"><div class="loading-block"><div class="loading-illust"></div><p class="loading-caption"><?=lang('main_pleasewait')?></p></div></div>';
    
    /**
     *  Get the top offset of an element relative to another element
     *
     *  @param {*}  elem   A jQuery object of the element to get the top of
     *  @param {*=} parent A jQuery object of the relative element
     *                       Defaults to $('#wrapper')
     *  @return The top offset of the element
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
		$('#wrapper').scrollTop(getTop(currentPage));
    }

    /**
     *  Automatically guesses type of request from number of arguments
     *
     *  @param {String}    url      The url of the page to request
     *  @param {Function=} callback The function to call after a successful
     *                                request
     *  @param {String=}   postdata If set, will send a POST request with the 
     *                                the given postdata, GET request otherwise
     */
    function request(url, callback, postdata) {
        var sig = '?' + new Date().getTime(); // Anti HTML Caching signature
        if (postdata !== undefined) $.post(url + sig, postdata, callback);
        else                        $.get(url + sig, callback);
    }
    
    /**
     *  Scrolls to a page inside #wrapper DOM element
     *
     *  @param {*}         target The jQuery .page object to scroll to
     *  @param {Function=} callback The function to call after scrolling
     */
    function scrollTo(target, callback) {
		currentPage = target;
		
		$('#wrapper').animate({ scrollTop: getTop(currentPage) }, {
            complete: function() { callback && callback(); callback = null; },
		    duration: ANIM_DURATION,
		    queue:    false
		});
    }
    
    /**
     *  Centers the .page-content vertically and synchronizes the top offset
     *
     *  @param {boolean=} scroll If set to TRUE, syncrhonizes the top offset
     *  @param {*=}       page   A jQuery .page object. If defined, centers the
     *                             the content of that page rather than the
     *                             the current page's.
     */
    function centerView(scroll, page) {
        if (!page && !currentPage) return; 
        if (scroll !== true) assertScroll();
        
        page = page || currentPage;
        var elem = page.find('.page-content');
        if(!elem[0]) return;
        
        var mh = 0|(($(window).height() - elem.height()) / 2);
        if (mh <= 0) mh = 0;
        
        elem.css('margin-top', mh);
    };
    
    /**
     *  Post-Slide callback for internal use
     *
     *  @param {*} load A jQuery instance to the loading mask
     */
    function slideToCb(load) {
        rkt_navmenu.disable(false);
        load.fadeOut({
            duration: ANIM_DURATION,
            queue:    false,
            complete: function() { load.remove(); }
        });
    }

    /**
     *  Loads a URL into a new .page and slides to it
     *
     *  @param {string}   url             The url of the page to load
     *  @param {string=}  postdata        The postdata to send in the request
     *  @param {boolean=} keepLoadingMask If TRUE, the loading mask wont fade
     *                                      after the scrolling animation
     */
    function slideTo(url, postdata, keepLoadingMask) {
        var page = $('<div class="page"></div>').appendTo($('#wrapper'));
        var load = $(loadingHtml).appendTo(page).show();

        rkt_navmenu.disable(true);

        assertScroll();
        scrollTo(page, function() {
            request(url, function(data) {
                page.append($(data));
                centerView();

                if (keepLoadingMask) {
                    rkt_pageevents.get().load(function() {
                        slideToCb(load);
                    });
                }
                else {
                    rkt_pageevents.get().load();
                    slideToCb(load);
                }
            }, postdata);
        });
    }
    
    /**
     *  Post-Slideback callback for internal use
     *
     *  @param {number}    index
     *  @param {*}         page
     *  @param {Function=} callback
     */
    function slideBackCb (index, page, callback) {
        assertScroll(); // In case page was hidden, offsets would change

        centerView(true, page);
        scrollTo(page, function() {
            $('div.page').slice(index+1).remove();
            callback && callback();
            rkt_navmenu.disable(false);
        });
    }

    /**
     *  Slides back to the previous .page inside #wrapper
     *
     *  @param {number=}   depth    The number of .page to go back to,
     *                                defaults to 1
     *  @param {Function=} callback The function to call after animation
     *  @param {boolean=}  implicit Private argument. Tells if the function
     *                                was called from a PageEvents' unload
     *                                function so we avoid re-calling it.
     */
    function slideBack(depth, callback, implicit) {
        var elems = $('div.page');
        if (elems.length <= 1 || !currentPage) return;

        depth = (depth || 1);

        var index = elems.length - depth - 1;
        if (index < 0) index = 0;
        var page = elems.eq(index); // Make sure its shown

        // The page might not want to quit right away
        // (Exit confirmation for editor)
        if (!implicit) {
            var skip = rkt_pageevents.get().unload(function(){
                slideBack(depth, callback, true);
            });
            if (skip === false) return;
        };

        rkt_navmenu.disable(true);
        rkt_pageevents.pop();

        if (page.hasClass('empty-home')) {
            $(loadingHtml).appendTo(currentPage).hide()
                .fadeIn(ANIM_DURATION, function() {
                    request(SITE_URL, function(data) {
                        currentPage.addClass('to-remove');

                        var tempCPage = currentPage;
                        currentPage = page;
                        page.append($(data)).removeClass('empty-home');
                        rkt_pageevents.get().load();
                        currentPage= tempCPage;

                        slideBackCb(index, page, callback);
                    });
                });
        }
        else {
            slideBackCb(index, page, callback);
        }
    }
    
    /**
     * Initializes the PageModule
     */
    function init() {
        currentPage = currentPage || $('.page:not(.empty-home):first');
	    $(window).resize(centerView); centerView(true);

        rkt_pageevents.get().load();
    }
    
    /**
     *  Sets up all links on the page depending on their classes
     */
    function setupLinks() {
        !currentPage && init();
        
        // Setup the "Back" link
        if($('.page:not(.to-remove)').length > 1) {
            $('<a href="#" class="backlink">LANG{main_back}</a>')
                .appendTo(currentPage).click(function() {
                    slideBack();
                    return false;
                });
        }

        // Setup sliders
        $('a.slider').unbind('click').click(function() {
            var link = $(this).attr('href');
            if (link != '#') slideTo(link);
            
            return false;
        });
    }
    
    // The interface of the Modulee
    return {
        /**
         *  Gets a the current page
         *  @return A jQuery object of the current .page
         */
        currentPage: function() {
            if (!currentPage) init();
            return currentPage;
        },
        
        setupLinks: setupLinks,
        centerView: centerView,
        slideTo:    slideTo,
        slideBack:  slideBack
    };
})();
