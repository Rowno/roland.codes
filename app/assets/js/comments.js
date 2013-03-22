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
            var $html = $('<div />');

            variables.avatarSize = AVATAR_SIZE * devicePixelRatio;

            // Prevent <img>'s from loading before being stripped
            result.forEach(function (comment, index) {
                /*jshint camelcase:false */
                result[index].body_html = comment.body_html.replace(
                    /(<img[^>]*)src=['"].*?['"]([^>]*>)/ig,
                    '$1$2'
                );
            });

            var renderedComments = Mustache.render(
                $('#comments-template').html(), {
                    variables: variables,
                    comments: result
                }
            );

            $html.html(renderedComments);
            $html.find('time').timeago();


            // Sanitise

            var $content = $html.find('.content');

            // Remove all images and empty containing elements
            $content.find('img').each(function () {
                var $next = $(this).parent();
                var $current = $next;

                while ($next.text().trim() === '') {
                    $current = $next;
                    $next = $current.parent();
                }

                $current.remove();
            });

            $content.find('a').attr('rel', 'nofollow');

            $content.find('.email-hidden-toggle, .email-hidden-reply').remove();


            output($html);
        },
        error: function () {
            output($('#comments-error').html());
        }
    });
});
