'use strict';
const $ = require('jquery');
let pushNavActive = false;


function togglePushNav() {
    if (pushNavActive) {
        document.body.classList.remove('push-nav-active');
    } else {
        document.body.classList.add('push-nav-active');
    }

    pushNavActive = !pushNavActive;
}

function linkClick(e) {
    const node = e.target;

    // Only fire for hash links pointing at the current page
    if (!node.hash ||
        node.hostname !== window.location.hostname ||
        node.pathname !== window.location.pathname) {
        return;
    }

    // Close nav when scrolling to a hash link target
    togglePushNav();
}


$('.push-nav-toggle').on('click', togglePushNav);
$('.push-nav-overlay').on('click', togglePushNav);
$('.push-nav').on('click', 'a', linkClick);
