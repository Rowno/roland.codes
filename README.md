roland.codes
=====================

[![Dev Dependency Status](https://david-dm.org/Rowno/roland.codes/dev-status.svg)](https://david-dm.org/Rowno/roland.codes#info=devDependencies)
[![Dependency Status](https://david-dm.org/Rowno/roland.codes/status.svg)](https://david-dm.org/Rowno/roland.codes#info=dependencies)

This is the source code of my personal website/blog, which is a static website generated using [Metalsmith][].


Build
-----

### Setup ###

 * Install [Node.js][] v0.12
 * Install Gulp: `npm install -g gulp`
 * Install dependencies: `npm install`

### Tasks ###

Available build tasks:

 * `gulp --harmony` - build the website, start a server and watch for changes (implicit --watch flag).
 * `gulp build --harmony` - build the website.
 * `gulp server --harmony` - build the website and start a server.

#### Flags ####

The following command line flags can also be added to tasks:

 * `--prod` - production build (minified).
 * `--watch` - watch for changes.


License
-------

Copyright © 2013 Roland Warmerdam.


[metalsmith]: http://www.metalsmith.io/
[node.js]: http://nodejs.org/
