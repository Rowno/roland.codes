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


document.querySelector('.push-nav-toggle').addEventListener('click', togglePushNav, false);
document.querySelector('.push-nav-overlay').addEventListener('click', togglePushNav, false);
for (const a of document.querySelectorAll('.push-nav a')) {
    a.addEventListener('click', linkClick, false);
}
