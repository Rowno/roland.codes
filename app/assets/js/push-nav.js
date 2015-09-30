'use strict';
const $ = require('jquery');

const path = window.location.pathname;
const $pushNav = $('.push-nav');
const $pushNavToggle = $('.push-nav-toggle');
let pushNavActive = false;


function togglePushNav() {
    if (pushNavActive) {
        document.body.classList.remove('push-nav-active');
        $pushNavToggle.attr('aria-expanded', false);
    } else {
        document.body.classList.add('push-nav-active');
        $pushNavToggle.attr('aria-expanded', true);
    }

    pushNavActive = !pushNavActive;
}

function linkClick(e) {
    const node = e.currentTarget;

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


$pushNavToggle.on('click', togglePushNav);
$('.push-nav-overlay').on('click', togglePushNav);
$pushNav.on('click', 'a', linkClick);
