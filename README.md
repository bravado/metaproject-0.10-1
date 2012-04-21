<<<<<<< HEAD
metaproject
===========
Main libraries
--------------
http://twitter.github.com/bootstrap/ - Bootstrap is Twitter's toolkit for kickstarting CSS for websites, apps, and more. It includes base CSS styles for typography, forms, buttons, tables, grids, navigation, alerts, and more.

http://jqueryui.com/ - jQuery UI is the official jQuery user interface library. It provides interactions, widgets, effects, and theming for creating Rich Internet Applications.

http://amplifyjs.com/ - AmplifyJS is a set of components designed to solve common web application problems (Request, Store, Pub/Sub) with a simplistic API.
=======
[Twitter Bootstrap](http://twitter.github.com/bootstrap)
=================

Bootstrap provides simple and flexible HTML, CSS, and Javascript for popular user interface components and interactions. In other words, it's a front-end toolkit for faster, more beautiful web development. It's created and maintained by [Mark Otto](http://twitter.com/mdo) and [Jacob Thornton](http://twitter.com/fat) at Twitter.

To get started, checkout http://twitter.github.com/bootstrap!
>>>>>>> 6e7a5cd13303264215554159f1805d81858147cf

http://knockoutjs.com/ - Simplify dynamic JavaScript UIs by applying the Model-View-View Model (MVVM) pattern.

http://p.yusukekamiyamane.com/ - Fugue icons, provided under a These icons a Creative Commons Attribution 3.0 License. If you can’t or don’t want to provide attribution, please purchase a royalty-free license from the site.

http://www.sitepoint.com/pure-css3-paper-curl/ - Pure CSS3 Paper Curls Without Images, used on the paper class

Additional Libraries
--------------------

These mostly maintain backwards-compatibility with older browsers

http://www.modernizr.com - Modernizr is an open-source JavaScript library that helps you build the next generation of HTML5 and CSS3-powered websites.

json2.js from https://github.com/douglascrockford/JSON-js - This file creates a JSON property in the global object, if there
isn't already one, setting its value to an object containing a stringify
method and a parse method. The parse method uses the eval method to do the
parsing, guarding it with several regular expressions to defend against
accidental code execution hazards. On current browsers, this file does nothing,
prefering the built-in JSON object.

There are also some snippets from the excellent http://html5boilerplate.com/


Quick start
-----------

Clone the repo, `git clone git@github.com:twitter/bootstrap.git`, or [download the latest release](https://github.com/twitter/bootstrap/zipball/master).



Versioning
----------

For transparency and insight into our release cycle, and for striving to maintain backward compatibility, Bootstrap will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major
* New additions without breaking backward compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on SemVer, please visit http://semver.org/.



Bug tracker
-----------

Have a bug? Please create an issue here on GitHub!

https://github.com/twitter/bootstrap/issues



Twitter account
---------------

Keep up to date on announcements and more by following Bootstrap on Twitter, [@TwBootstrap](http://twitter.com/TwBootstrap).



Mailing list
------------

Have a question? Ask on our mailing list!

twitter-bootstrap@googlegroups.com

http://groups.google.com/group/twitter-bootstrap



IRC
---

Server: irc.freenode.net

Channel: ##twitter-bootstrap (the double ## is not a typo)



Developers
----------

We have included a makefile with convenience methods for working with the Bootstrap library.

+ **build** - `make`
Runs the LESS compiler to rebuild the `/less` files and compiles the docs pages. Requires lessc and uglify-js. <a href="http://twitter.github.com/bootstrap/less.html#compiling">Read more in our docs &raquo;</a>

+ **watch** - `make watch`
This is a convenience method for watching just Less files and automatically building them whenever you save. Requires the Watchr gem.



Authors
-------

**Mark Otto**

+ http://twitter.com/mdo
+ http://github.com/markdotto

**Jacob Thornton**

+ http://twitter.com/fat
+ http://github.com/fat



Copyright and license
---------------------

Copyright 2012 Twitter, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
