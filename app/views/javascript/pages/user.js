//=============================================================================
// user.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Fri Dec 23 09:48:19 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

(function() {

function submitForm(form) {
    
}

$(document).on('submit', '.login-form, .register-form', function() {
    submitForm($(this));
})
.on('mousedown', '.v-login :checkbox', function() {
    var checkbox = $(this);
    if (checkbox.attr('checked')) checkbox.removeAttr('checked');
    else                          checkbox.attr('checked', 'checked');
    return false;
})
.on('focus', '.v-login :checkbox', function() {
    var _this = $(this);
    _this.blur();
    Navigation.setCurrentItem(_this.parent('.nav-menu-item').focus());
})
.on('focus', '.submit-button', function() {
    Navigation.setCurrentItem($(this));
});

Pages['v-login'] = {
    init: function () {
        Pagination.setupLinks();
    },

    onEnter: function(cItem) {
        if (cItem.hasClass('submit-button')) {
            submitForm($('.login-form'));
        }
        else if(cItem.hasClass('check-input')) {
            var checkbox = cItem.find(':checkbox');
            if (checkbox.attr('checked')) checkbox.removeAttr('checked');
            else                          checkbox.attr('checked', 'checked');
        }
        else {
            cItem.find('input').focus();
        }
    }
};

Pages['v-register'] = {
    init: function () {
        Pagination.setupLinks();
    },

    onEnter: function(cItem) {
        if (cItem.hasClass('submit-button')) {
            submitForm($('.register-form'));
        }
        else {
            cItem.find('input').focus();
        }
    }
};

})();

