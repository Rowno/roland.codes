'use strict';
const THEME_NUM = 4;
const THEME_INTERVAL = 7;
const SECOND = 1000;
let currentTheme = 1;


function changeTheme() {
    document.documentElement.classList.remove(`theme--${currentTheme}`);

    currentTheme += 1;
    if (currentTheme > THEME_NUM) {
        currentTheme = 1;
    }

    document.documentElement.classList.add(`theme--${currentTheme}`);
}

setTimeout(() => {
    changeTheme();
    setInterval(changeTheme, THEME_INTERVAL * SECOND);
}, SECOND);
