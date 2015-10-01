'use strict';
require('picturefill');
require('fastclick')(document.body);
const $ = require('jquery');

require('./vendor/polyfills/smoothscroll');
require('./theme');
require('./push-nav');
require('./comments');
require('./codepen');
require('./vendor/ga');


// Hash link smooth scrolling
$(document.body).on('click', 'a', e => {
    const node = e.currentTarget;

    // Only fire for hash links pointing at the current page
    if (!node.hash ||
        node.hostname !== window.location.hostname ||
        node.pathname !== window.location.pathname) {
        return;
    }

    const $element = $(node.hash);

    if ($element.length === 0) {
        return;
    }

    window.scrollTo({top: $element.offset().top, behavior: 'smooth'});
    e.preventDefault(); // Prevent default scroll
    window.location.hash = node.hash; // Manually add hash to url to maintain history
});
