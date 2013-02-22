define(['app/variables', 'jquery', 'hogan', 'jquery.timeago'], function (variables, $, Hogan) {
    'use strict';

    var $comments = $('#comments');
    var commentsTemplate = Hogan.compile($('#comments-template').html());
    var devicePixelRatio = window.devicePixelRatio || 1;
    var AVATAR_SIZE = 25;

    variables.commentsIssueId = $comments.data('comments-issue-id');


    function output(html) {
        $comments.attr('aria-busy', false);
        $comments.find('.loader').remove();
        $comments.append(html);
    }


    if (!Modernizr.cors) {
        output($('#comments-unsupported').html());
        return;
    }


    $.ajax('https://api.github.com/repos/Rowno/rolandwarmerdam.co.nz/issues/' + variables.commentsIssueId + '/comments', {
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
                variables: variables,
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
