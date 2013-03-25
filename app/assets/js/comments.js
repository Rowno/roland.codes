define([
    'variables',
    'text!templates/comments.html',
    'jquery',
    'vendor/mustache',
    'vendor/jquery.timeago'
], function (variables, commentsTemplate, $, Mustache) {
    'use strict';

    var $comments = $('#comments');
    var devicePixelRatio = window.devicePixelRatio || 1;
    var AVATAR_SIZE = 25;

    variables.commentsIssueId = $comments.data('comments-issue-id');

    variables.avatarSize = AVATAR_SIZE * devicePixelRatio;

    variables.gravatarUrl = '//';
    variables.gravatarUrl += ('https:' === location.protocol ? 'secure':'www');
    variables.gravatarUrl += '.gravatar.com';


    function output(html) {
        $comments.attr('aria-busy', false);
        $comments.find('.loader').remove();
        $comments.append(html);
    }


    if (!Modernizr.cors) {
        output(Mustache.render(commentsTemplate, {
            variables: variables,
            unsupported: true
        }));

        return;
    }


    $.ajax('https://api.github.com/repos/' + variables.githubRepo + '/issues/' + variables.commentsIssueId + '/comments', {
        type: 'GET',
        dataType: 'json',
        cache: false,
        headers: {
            accept: 'application/vnd.github.beta.html+json'
        },
        success: function (result) {
            var $html = $('<div />');

            result.forEach(function (comment) {
                /*jshint camelcase:false */

                // Prevent <img>'s from loading before being stripped
                comment.body_html = comment.body_html.replace(
                    /(<img[^>]*)src=['"].*?['"]([^>]*>)/ig,
                    '$1$2'
                );
            });

            var view = {
                variables: variables
            };

            if (result.length === 0) {
                view.noComments = true;
            } else {
                view.comments = result;
            }

            $html.html(Mustache.render(commentsTemplate, view));
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
            output(Mustache.render(commentsTemplate, {
                variables: variables,
                error: true
            }));
        }
    });
});
