'use strict';
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
