'use strict';
let pushNavActive = false;


function togglePushNav() {
    if (pushNavActive) {
        document.body.classList.remove('push-nav-active');
    } else {
        document.body.classList.add('push-nav-active');
    }

    pushNavActive = !pushNavActive;
}


document.querySelector('.push-nav-toggle').addEventListener('click', togglePushNav, false);
document.querySelector('.push-nav-overlay').addEventListener('click', togglePushNav, false);
for (let a of document.querySelectorAll('.push-nav a')) {
    a.addEventListener('click', togglePushNav, false);
}
