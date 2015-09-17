'use strict';
require('picturefill');
require('fastclick')(document.body);
require('./vendor/polyfills/smoothscroll');
require('./theme');
require('./push-nav');


// Hash link smooth scrolling
document.body.addEventListener('click', e => {
    const node = e.target;

    // Only fire for hash links pointing at the current page
    if (!node.hash ||
        node.hostname !== window.location.hostname ||
        node.pathname !== window.location.pathname) {
        return;
    }

    const element = document.querySelector(node.hash);

    if (!element) {
        return;
    }

    window.scrollTo({top: element.offsetTop, behavior: 'smooth'});
    e.preventDefault(); // Prevent default scroll
    window.location.hash = node.hash; // Manually add hash to url to maintain history
}, false);
