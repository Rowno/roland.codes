'use strict';
require('babel-core/polyfill');
require('./vendor/polyfills/smoothscroll');
require('./push-nav');
const THEME_NUM = 4;
const THEME_INTERVAL = 30;
let currentTheme = 1;


setInterval(() => {
    document.documentElement.classList.remove('theme--' + currentTheme);

    currentTheme += 1;
    if (currentTheme > THEME_NUM) {
        currentTheme = 1;
    }

    document.documentElement.classList.add('theme--' + currentTheme);
}, THEME_INTERVAL * 1000);



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
