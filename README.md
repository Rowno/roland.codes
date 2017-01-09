roland.codes
=====================

[![Dev Dependency Status](https://david-dm.org/Rowno/roland.codes/dev-status.svg)](https://david-dm.org/Rowno/roland.codes#info=devDependencies)
[![Dependency Status](https://david-dm.org/Rowno/roland.codes/status.svg)](https://david-dm.org/Rowno/roland.codes#info=dependencies)

This is the source code of my personal website/blog, which is a static website generated using [Metalsmith][].


Build
-----

### Setup ###

 * Install [Node.js][] v4
 * Install Gulp: `npm install -g gulp`
 * Install dependencies: `npm install`

### Tasks ###

Available build tasks:

 * `gulp` - build the website, start a server and watch for changes (implicit --watch flag).
 * `gulp build` - build the website.
 * `gulp server` - build the website and start a server.
 * `gulp alex` - run [Alex][] over all the content.

#### Flags ####

The following command line flags can also be added to tasks:

 * `--prod` - production build (minified).
 * `--watch` - watch for changes.


License
-------

This repository isn't licensed because I want my personal website/brand to be unique. However feel free to play around with the code and learn from it.

And of course pull requests are always welcome. :sparkling_heart:

Copyright © 2013 Roland Warmerdam.


[Metalsmith]: http://www.metalsmith.io/
[Node.js]: http://nodejs.org/
[Alex]: http://alexjs.com/
