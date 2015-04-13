metaproject
===========

Reference component library for javascript applications

Usage
-----

All library and css dependencies are bundled on the build root. Include
metaproject.css/js and you're good to go.

      <link rel="stylesheet" href="metaproject/dist/metaproject.css></script>
      <script type="text/javascript" src="metaproject/dist/metaproject.js"></script>

The [Compendium](http://www.bravado.com.br/metaproject/compendium) holds
documentation and examples for the ui components and general application structure.

Main libraries
--------------
http://twitter.github.com/bootstrap/ - Bootstrap is Twitter's toolkit
for kickstarting CSS for websites, apps, and more. It includes base CSS
styles for typography, forms, buttons, tables, grids, navigation,
alerts, and more.

http://jqueryui.com/ - jQuery UI is the official jQuery user interface
library. It provides interactions, widgets, effects, and theming for
creating Rich Internet Applications.

http://knockoutjs.com/ - Simplify dynamic JavaScript UIs by applying the
Model-View-View Model (MVVM) pattern.

http://fortawesome.github.io/Font-Awesome/ - The iconic font and CSS toolkit

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

Non-bower dependencies are located in the `lib/` folder

Versioning
----------

For transparency and insight into our release cycle, and for striving to maintain backwards compatibility,
Metaproject will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on SemVer, please visit http://semver.org/.


Bug tracker
-----------

Have a bug? Please create an issue here on GitHub!

https://github.com/bravado/metaproject/issues

Developers
----------

Dependencies are listed on `package.json` and `bower.json`. After cloning this repo, run

        npm install
        bower install

We have included a Gruntfile with convenience methods for building 
metaproject, which generates the following files

### metaproject.js

Full distribution. Includes the Metaproject core libraries and its dependencies

  * jQuery
  * jQuery UI
  * Modernizr
  * Knockout.js
  * Knockout Mapping Plugin
  * Knockout Punches
  * Knockout Postbox
  * Bootstrap Javascript

### metaproject.css

Full css distribution. Includes

  * Bootstrap
  * Font-Awesome
  * jQuery UI + Bootstrap theme

### metaproject.min.js

Minimal metaproject funcionality, no additional libraries.
Bundles  `metaproject`, `metaproject.app.js` and `metaproject.data.js`

### metaproject-ui.min.js

All UI Components, no additional libraries.

Authors
-------

**Guilherme Barile**

+ [http://github.com/guigouz](http://github.com/guigouz)

License
-------

Copyright 2011 (c) Bravado

Licensed under the MIT License, other components licenses are listed on the LICENSES file.