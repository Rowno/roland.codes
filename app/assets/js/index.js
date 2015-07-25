'use strict';
require('babel-core/polyfill');
require('./vendor/polyfills/smoothscroll');
require('fastclick')(document.body);
require('./theme');
require('./push-nav');


// Hash link smooth scrolling
document.body.addEventListener('click', event => {
    const node = event.target;

    if (!node.hash ||
        node.hostname !== window.location.hostname ||
        node.pathname !== window.location.pathname)
    {
        return;
    }

    const element = document.querySelector(node.hash);

    if (!element) {
        return;
    }

    window.scrollTo({top: element.offsetTop, behavior: 'smooth'});
    event.preventDefault(); // Prevent default scroll
    window.location.hash = node.hash; // Manually add hash to url to maintain history
}, false);
