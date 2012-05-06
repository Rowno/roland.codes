/*jslint browser: true */
/*globals Site: false, jQuery: false, Hogan: false, Modernizr:false */

(function (Site, $, Hogan, Modernizr) {
    'use strict';

    if (!Site.variables.commentsIssueId) {
        return;
    }

    var $comments = $('#comments'),
        commentsTemplate = Hogan.compile($('#comments-template').html());

    function output(html) {
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
                renderedComments = commentsTemplate.render({
                    site: Site.variables,
                    comments: result
                });

            $html.html(renderedComments);
            $html.find('time').timeago();

            output($html);
        }
    });
}(Site, jQuery, Hogan, Modernizr));
