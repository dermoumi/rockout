//=============================================================================
// settings.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Mon Dec 19 10:13:50 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

(function() {
    /*
     * Setups a slider ui on the given element
     */
    function setupSlider(elem, key) {
        var val      = Settings.getVal(key);
        var interval = Settings.getInterval(key);
        var min      = interval[0];
        var max      = interval[1];
        var percent  = (val - min) / (max - min);

        elem.addClass('ui-slider')
            .append($('<a href="#" class="ui-slider-handle"><span>'
            + val + '</span></a>'))
            .data('min', min)
            .data('max', max)
            .find('a').css({left: (percent * 100) + '%'});
    }

    /*
     * Moves a slider to a relative value
     */
    function sliderMove(slider, val, notRelative) {
        var handle  = slider.find('.ui-slider-handle');
        var value   = notRelative ? val : parseInt(handle.text()) + val;
        var min     = slider.data('min');
        var max     = slider.data('max');

        value = Math.min(max, Math.max(min, value));

        var percent = (value - min) / (max - min);
        if (percent < 0)      percent = 0;
        else if (percent > 1) percent = 1;

        handle.css({left: (percent * 100) + '%'});
        handle.find('span').html(value);
    }

    /*
     * Sets a specific keyboard layout
     */
    function setKbdLayout(index, init) {
        var choices = $('.kb-choice');

        Pages.getElem().find('#kb-layout-op .number-input').val(index);

        choices.each(function(i) {
            var _this = $(this);

            if (index == i) {
                if (_this.hasClass('current')) return;

                _this.addClass('current');
                if (!init) kbdHMove(_this.css({left: 604}), 0);
                return;
            }

            if (init) {
                _this.css('left', -9999);
                return;
            }
            
            if (!_this.hasClass('current')) return;
            
            kbdHMove(_this.removeClass('current'), -604);
        });
    }

    /*
     * Moves horizontally the keyboard layouts with an animation
     */
    function kbdHMove(elems, distance) {
        elems.animate({
            left: distance
        }, {
            duration: 300,
            queue: false
        });
    }

    /*
     * Changes the current selected keyboard with an animation
     */
    function kbdMove(isLeft) {
        var elems = $('.kb-choice');
        var count = elems.length;

        elems.each(function(i, e) {
            var _this = $(this);
            var index = 0;

            if(_this.hasClass('current')) {
                if (isLeft) {
                    index = (i == 0 ? count : i) - 1;
                    kbdHMove(_this.removeClass('current'), 604);
                    kbdHMove(elems.eq(index).css({left: -604})
                        .addClass('current'), 0);
                }
                else {
                    index = (i == count-1 ? 0 : i + 1);

                    kbdHMove(_this.removeClass('current'), -604);
                    kbdHMove(elems.eq(index).css({left: 604})
                        .addClass('current'), 0);
                }

                Pages.getElem().find('#kb-layout-op .number-input').val(index);
                return false;
            }
        });
    }

    /*
     * Toggles yes/no on an element
     */
    function toggleYesNo(elem) {
        elem.find('a').toggleClass('current');
        var input = elem.find('.number-input');
        input.val(parseInt(input.val())?0:1);
    }

    function setYesNo(elem, value) {
        elem.find('a').removeClass('current');
        elem.find(value?'.yes':'.no').addClass('current');

        elem.find('.number-input').val(value?1:0);
    }

    /*
     * Saves settings currently set in the form
     */
    function saveSettings() {
        var page = Pages.getElem();

        var data = {
            'KbLayout':
                page.find('#kb-layout-op .number-input').val(),
            'IgnoreInput':
                page.find('#ignore-input-op .number-input').val(),
            
            'AvDelay':
                page.find('#vdelay-op .ui-slider-handle span').html(),
            'GlobalVolume':
                page.find('#global-volume-op .ui-slider-handle span').html(),
            'SfxVolume':
                page.find('#sfx-volume-op .ui-slider-handle span').html(),
            
            'FPS':
                page.find('#fps-op .ui-slider-handle span').html()
        }
        
        Settings.update(data);

        alert('Saved!');
    }

    function setToDefault() {
        var page = Pages.getElem();

        sliderMove(page.find('#vdelay-op'),
            Settings.defaults('AvDelay'), true);
        sliderMove(page.find('#sfx-volume-op'),
            Settings.defaults('GlobalVolume'), true);
        sliderMove(page.find('#global-volume-op'),
            Settings.defaults('SfxVolume'), true);
        sliderMove(page.find('#fps-op'),
            Settings.defaults('FPS'), true);

        setKbdLayout(Settings.defaults('KbLayout'));
        setYesNo($('#ignore-input-op'), Settings.defaults('IgnoreInput'));
    }

    /*
     * Events
     */
    // Slider 
    var heldSlider = undefined;
    $(document).on('mousedown', '.ui-slider-handle', function(e) {
        heldSlider = {elem: $(this), startX: e.pageX};
        return false;
    })
    .on('mouseup', function() {
        heldSlider = undefined;
        return false;
    })
    .on('mousemove', function(e) {
        if (!heldSlider) return;

        var elem     = heldSlider.elem;
        var parent   = elem.parent();
        var min      = parent.data('min');
        var max      = parent.data('max');
        var interval = max - min;
        
        var percent  = (e.pageX - parent.offset().left) / parent.width();
        if (percent < 0)      percent = 0;
        else if (percent > 1) percent = 1;
        
        var val      = (percent * interval + min)|0;

        elem.css({left: (percent * 100) + '%'});
        elem.find('span').html(val);
    })

    // Yes/No togglig
    .on('click', '.yesno a', function() {
        toggleYesNo($(this).parent().parent());

        return false;
    })

    // Keyboard navigation Prev/Next
    .on('click', '.kb-nav .p', function() {
        kbdMove(true);
        return false;
    })
    .on('click', '.kb-nav .n', function() {
        kbdMove(false);
        return false;
    });


    Pages['v-settings'] = {
        init: function() {
            setupSlider($('#fps-op'), 'FPS');
            setupSlider($('#vdelay-op'), 'AvDelay');
            setupSlider($('#global-volume-op'), 'GlobalVolume');
            setupSlider($('#sfx-volume-op'), 'SfxVolume');

            setKbdLayout(Settings.getVal('KbLayout'), true);

            setYesNo($('#ignore-input-op'), Settings.getVal('IgnoreInput'));

            Pagination.setupLinks();
        },

        onOtherKey: function(c) {
            var cItem = Pages.getElem().find('.current-item');

            if (cItem.hasClass('kblayout-option')) {
                if (c == KEY_LEFT)       kbdMove(true);
                else if (c == KEY_RIGHT) kbdMove(false);
                return;
            }
            else if (cItem.hasClass('yesno-option')) {
                if (c == KEY_LEFT || c == KEY_RIGHT) {
                    toggleYesNo(cItem);
                }
                return;
            }

            var slider = cItem.find('.ui-slider');
            if (c == KEY_LEFT)       sliderMove(slider, -1);
            else if (c == KEY_RIGHT) sliderMove(slider, 1);
        },

        onEnter: function(cItem) {
            if      (cItem.hasClass('settings-save')) saveSettings();
            else if (cItem.hasClass('settings-reset')) setToDefault();
        }
    };
})();

