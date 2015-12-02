//=============================================================================
// playlists.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Wed Dec 21 20:38:38 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

(function() {
    var classPre = '.v-playlists ';
    var openedPlaylist = undefined;
    var loadingElem = '<div class="loading">Loading, please wait...</div>';

    function loadMore(elem, url) {
        var ld = $(loadingElem);
        var page = Pages.getElem();

        elem.slideUp({
            duration: 300,
            complete: function() {elem.remove() }
        }).after(ld);
        ld.hide().slideDown({
            duration: 300
        });

        Ajax(url, function(data) {
            var data = $(data).wrap('<div class="temp-wrapper"></div>').parent();
            ld.after(data);
            data.first().addClass('current-item').end().hide().slideDown({
                duration: 300, 
                queue: false,
                step: function() {
                    if (data.position().top > 0)
                        page.scrollTop(data.position().top + 50);
                },
                complete: function() {
                    if (data.position().top > 0) 
                        page.scrollTop(data.position().top + 50);
                    data.children().first().unwrap();
                }
            });

            ld.slideUp({
                duration: 300,
                complete: function() {
                    ld.remove();
                }
            });
        }, 'nofilters=1');
    }

    function expandRecent(elem) {
        // TO DO
    }

    function collapsePlaylist(elem) {
        if (!openedPlaylist) return;

        var filters = openedPlaylist.find('.pl-filters ul');
        openedPlaylist.find('.pl-content').slideUp({
            duration:300, 
            queue: false,
            complete: function() {
                filters.remove();
            }
        });

        openedPlaylist = undefined;
    }

    function expandPlaylist(elem, url) {
        if (openedPlaylist && openedPlaylist.is(elem)) {
            return collapsePlaylist();
        }
        
        collapsePlaylist();
        if (url == '#') return expandRecent(elem);

        openedPlaylist = elem;
        var content = elem.find('.pl-content');
        var ld = $(loadingElem);

        content.before(ld);
        ld.hide().slideDown({
            duration: 300
        });

        Ajax(url, function(data) {
            content.html(data);
            content.hide().slideDown({
                duration: 300, 
                queue: false
            });

            ld.slideUp({
                duration: 300,
                complete: function() {
                    ld.remove();
                }
            });
        });
    }

    function toggleFilterBlock() {
        if (!openedPlaylist) return;

        var elems = openedPlaylist.find('.pl-filters');
        var filters = elems.find('ul');
        if (filters.hasClass('closed')) {
            filters.slideDown({
                duration:300, 
                queue: false
            }).removeClass('closed');
            return;
        }

        filters.slideUp({
            duration:300, 
            queue: false,
            complete: function() {
                filters.addClass('closed');
            }
        });
        return;
    }

    Pages['v-playlists'] = {
        init: function() {
            Pagination.setupLinks();
        },

        onOtherKey: function(c) {
            // To do
        },

        onEnter: function(cItem) {
            if (cItem.hasClass('pl-title')) {
                expandPlaylist(cItem.parent().parent(), cItem.attr('href'));
            }
            else if (cItem.hasClass('filter-toggle')) {
                toggleFilterBlock();
            }
            else if (cItem.hasClass('pl-more')) {
                loadMore(cItem, cItem.attr('href'));
            }
            else if (cItem.hasClass('vimeo-demo')) {
                window.vdProvider = 'vm';
            }
            else if (cItem.hasClass('youtube-demo')) {
                window.vdProvider = 'yt';
            }
            else if (cItem.hasClass('dailymotion-demo')) {
                window.vdProvider = 'dm';
            }
        }
    };
})();

