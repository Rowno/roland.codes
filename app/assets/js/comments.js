/* eslint-disable no-sync */
'use strict';
const Fs = require('fs');
require('whatwg-fetch');
const $ = require('jquery');
const Swig = require('swig');
const Timeago = require('simple-timeago');

const template = Fs.readFileSync('app/templates/partials/comments.html', 'utf8');
const $commentsList = $('.blog-post__comments__list');

Swig.setFilter('fuzzydate', (input) => Timeago(new Date(input)));

if ($commentsList.length > 0) {
    const commentsIssueId = $commentsList.data('commentsIssueId');

    window.fetch(`https://api.github.com/repos/Rowno/roland.codes/issues/${commentsIssueId}/comments`, {
        headers: {
            Accept: 'application/vnd.github.v3.html+json'
        }
    })
    .then((response) => {
        if (response.status === 200) {
            return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw new Error(response.statusText);
    })
    .then((response) => response.json())
    .then((comments) => {
        if (comments.length === 0) {
            $commentsList.html('No comments yet. ☹');
            return;
        }

        const $comments = $(Swig.render(template, {
            locals: {
                commentsIssueId,
                comments
            }
        }));

        // Sanitise
        const $content = $comments.find('.blog-post__comment__content');
        $content.find('a').attr('rel', 'nofollow');
        $content.find('.email-hidden-toggle, .email-hidden-reply').remove();

        $commentsList.html($comments);
    }).catch((error) => {
        $commentsList.html(`
            Oops, something broke while loading the comments.
            Please try again later or
            <a href="https://github.com/Rowno/roland.codes/issues/">report the problem</a>.
        `);
        console.error(error);
    });
}
