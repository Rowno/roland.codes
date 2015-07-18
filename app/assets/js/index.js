'use strict';
require('./vendor/polyfills/smoothscroll');
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


document.body.addEventListener('click', function (event) {
    if (!event.target || !event.target.hash) {
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
