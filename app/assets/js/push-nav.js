'use strict';
const $ = require('jquery');

const path = window.location.pathname;
const $pushNav = $('.push-nav');
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


for (const link of $pushNav.find('.push-nav__link')) {
    if (link.pathname !== '/' && path.startsWith(link.pathname) ||
        link.pathname + link.hash === '/#projects' && path.startsWith('/projects/')) {
        link.classList.add('push-nav__link--active');
    }
}


$('.push-nav-toggle').on('click', togglePushNav);
$('.push-nav-overlay').on('click', togglePushNav);
$pushNav.on('click', 'a', linkClick);
