define('app/comments', ['jquery', 'hogan', 'jquery.timeago'], function ($, Hogan) {
    'use strict';

    if (!Site.variables.commentsIssueId) {
        return;
    }

    var $comments = $('#comments'),
        commentsTemplate = Hogan.compile($('#comments-template').html()),
        devicePixelRatio = window.devicePixelRatio || 1,
        AVATAR_SIZE = 25;

    function output(html) {
        $comments.attr('aria-busy', false);
        $comments.find('.loader').remove();
        $comments.append(html);
    }


    if (!Modernizr.cors) {
        output($('#comments-unsupported').html());
        return;
    }


    $.ajax('https://api.github.com/repos/Rowno/rolandwarmerdam.co.nz/issues/' + Site.variables.commentsIssueId + '/comments', {
        type: 'GET',
        dataType: 'json',
        cache: false,
        headers: {
            accept: 'application/vnd.github.beta.html+json'
        },
        success: function (result) {
            var $html = $('<div />'),
                renderedComments;

            result.avatarSize = AVATAR_SIZE * devicePixelRatio;

            renderedComments = commentsTemplate.render({
                site: Site.variables,
                comments: result
            });

            $html.html(renderedComments);
            $html.find('time').timeago();
            $html.find('.content a').attr('rel', 'nofollow');

            output($html);
        },
        error: function () {
            output($('#comments-error').html());
        }
    });
});
