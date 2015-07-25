'use strict';
require('babel-core/polyfill');
require('smoothscroll');
require('fastclick')(document.body);
require('./theme');
require('./push-nav');


function isHashLink(node) {
    return node &&
        node.hash &&
        node.attributes.href &&
        node.hash === node.attributes.href.value;
}

// Hash link smooth scrolling
document.body.addEventListener('click', event => {
    if (!isHashLink(event.target)) {
        return;
    }

    let element = document.querySelector(event.target.hash);

    if (!element) {
        return;
    }

    window.scrollTo({top: element.offsetTop, behavior: 'smooth'});
    event.preventDefault(); // Prevent default scroll
    window.location.hash = event.target.hash; // Manually add hash to url to maintain history
}, false);
