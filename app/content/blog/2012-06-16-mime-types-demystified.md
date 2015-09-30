---
layout: blog-post.html
title: MIME types demystified
commentsIssueId: 12
---

Most programmers know what a <abbr title="Multipurpose Internet Mail Extensions">MIME</abbr> type (or Media Type) is. It's the two-part identifier used by programs to determine the format of a file or data. In web development, MIME types are most commonly seen in HTTP requests as the value of the `Content-Type` header. But what do the two different parts mean and what are their valid values?

The first part of a MIME type is called the top-level media type and it specifies the general type of the data. The top-level media type can be one of the 7 standard defined types, which consist of:

 * _text_ - textual information.
 * _image_ - image data.
 * _audio_ - audio data.
 * _video_ - video data.
 * _application_ - some other kind of data, typically either uninterpreted binary
                   data or information to be processed by an application.
 * _multipart_ - data consisting of multiple entities of independent data types.
 * _message_ - an encapsulated message.

The second part is called the sub-type and it specifies the specific format of the data. There are thousands of registered sub-types, far too many to list here. However there's a [list of registered MIME types][list] on the <abbr title="Internet Assigned Numbers Authority">IANA</abbr> website.

The sub-type can also have one of the following optional prefixes to give it special meaning:

 * `x-` - Unregistered or experimental. Example: `image/x-icon`
 * `vnd.` - Vendor-specific. Example: `application/vnd.ms-powerpoint`
 * `prs.` - Personal or vanity. Example: `application/prs.roland`

For more information, see the MIME type [standard][] and [registration][] documents.


[list]: http://www.iana.org/assignments/media-types/index.html
[standard]: http://tools.ietf.org/html/rfc2046
[registration]: http://tools.ietf.org/html/rfc4288
