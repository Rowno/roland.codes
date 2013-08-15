rolandwarmerdam.co.nz
=====================

[![devDependency Status](https://david-dm.org/Rowno/rolandwarmerdam.co.nz/dev-status.png)](https://david-dm.org/Rowno/rolandwarmerdam.co.nz#info=devDependencies)

This is the source code of my personal website/blog, which is a static website generated using [Jekyll][].


Build
-----

### Setup ###

 * [Jekyll and Pygments][jekyll-install]. E.g: `gem install jekyll`
 * [Node.js][]
 * `npm install -g grunt-cli bower`
 * `npm install`
 * `bower install`

### Tasks ###

Available build tasks:

 * `grunt build` - build the website.
 * `grunt server` - build the website, start a server and watch for changes.
 * `grunt jshint` - lint the Javascript and JSON files.

#### Flags ####

The following command line flags can also be added to the `build` and `server` tasks:

 * `--prod` - do a production build.
 * `--drafts` - render draft posts.


License
-------
The contents of this repository is released under the [Creative Commons Attribution-ShareAlike 3.0 Unported License][license].

Copyright © 2013 Roland Warmerdam.


[jekyll]: https://github.com/mojombo/jekyll
[jekyll-install]: https://github.com/mojombo/jekyll/wiki/Install
[node.js]: http://nodejs.org/
[license]: http://creativecommons.org/licenses/by-sa/3.0/
