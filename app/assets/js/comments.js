define(['variables', 'jquery', 'vendor/mustache', 'vendor/jquery.timeago'],
        function (variables, $, Mustache) {
    'use strict';

    var $comments = $('#comments');
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

            variables.avatarSize = AVATAR_SIZE * devicePixelRatio;

            renderedComments = Mustache.render(
                $('#comments-template').html(), {
                    variables: variables,
                    comments: result
                }
            );

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
