/*global alert: true, jQuery: true, ko: true */
(function (window, $, ko) {
    "use strict";

    var metaproject = window.metaproject = {};


    /**
     * Events
     * From https://github.com/moot/riotjs
     */
     
    var callbacks = {},
      slice = [].slice;

    metaproject.on = function(events, fn) {

      if (typeof fn == "function") {
        events = events.split(/\s+/);

        for (var i = 0, len = events.length, type; i < len; i++) {
          type = events[i];
          (callbacks[type] = callbacks[type] || []).push(fn);
          if (len > 1) fn.typed = true;
        }
      }
      return metaproject;
    };

    metaproject.off = function(events) {
      events = events.split(/\s+/);

      for (var i = 0; i < events.length; i++) {
        callbacks[events[i]] = [];
      }

      return metaproject;
    };

    // only single event supported
    metaproject.one = function(type, fn) {
      if (fn) fn.one = true;
      return metaproject.on(type, fn);

    };

    metaproject.trigger = function(type) {

      var args = slice.call(arguments, 1),
        fns = callbacks[type] || [];

      for (var i = 0, fn; i < fns.length; ++i) {
        fn = fns[i];

        if (fn.one && fn.done) continue;

        // add event argument when multiple listeners
        fn.apply(metaproject, fn.typed ? [type].concat(args) : args);

        fn.done = true;
      }

      return metaproject;
    };


    /**
     * Main Application Class
     * 
     * Application bind itself to the dom, calls init()
     *  and triggers the first hashchange when run
     */
    metaproject.Application = function (params) {
        var self = this;

        self.debug = 0;

        if (typeof(params) === 'function') {
            self.init = params;
        }
        else {
            self.init = function () {
            };
            $.extend(this, params);
        }

        self.run = function (element) {
            ko.applyBindings(self, element);
            self.init.call(self);
            $(window).trigger('hashchange');
        };

    };

    /* jQuery plugs */

    /**
     * Shortcut to ko.applyBindings, save the viewModel on data-viewModel
     * @param viewModel
     */
    $.fn.applyBindings = function (viewModel) {
        this.data('viewModel', viewModel).each(function (idx, element) {
            ko.applyBindings(viewModel, element);
        });
    };

    /**
     * Includes and initializes another file on the element
     * @param url
     * @param callback optional, runs after the url is loaded
     * @return {*}
     */
    $.fn.include = function (url, callback) {
        var self = this,
            params = metaproject.debug ? '?ts=' + new Date().getTime() : '';

        if (self.data('loaded') === url) {
            return this;
        }
        else {
            return this.addClass('loading').load(url + params, function () {

                self.data('loaded', url).removeClass('loading');
                //metaproject.init(self.removeClass('loading'));

                if (undefined !== callback) {
                    callback();
                }
            });
        }

    };

    /* Custom Binding handlers */

    // Includes an external file on the DOM element
    ko.bindingHandlers.include = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var $element = $(element),
                params = valueAccessor(),
                url = allBindingsAccessor().url;

            if (params instanceof Array) {
                $element.include(params[0], params[1]);
            }
            else {
                $element.include(params);
            }

            // If there's no url assigned to this node, activate it
            // (Otherwise it will be activated according to the hash)
            if (!url) {
                $element.children().trigger('activate', $element);
            }
        }
    };

    // Attach an url controller to this node
    // The node will receive activate and deactivate events when the url changes
    ko.bindingHandlers.url = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var $element = $(element),
                url = valueAccessor();

            $element.css({ visibility: 'hidden', position: 'absolute', height: 0, overflow: 'hidden' });

            $(window).on('hashchange', function (e) {
                var hash = window.location.hash.substr(1) || '/';

                if (hash === url) {
                    if ($element.css('visibility') !== 'visible') {
                        $element.css({ visibility: 'visible', position: 'inherit', height: 'auto', overflow: 'inherit' }).children().trigger('activate', [ element, hash ]);
                    }

                    $(window).scrollTop(0);
                }
                else {
                    if ($element.css('visibility') === 'visible') {
                        $element.css({ visibility: 'hidden', position: 'absolute', height: 0, overflow: 'hidden' }).children().trigger('deactivate', [$element, hash]);
                    }
                }
            });


            // TODO dispose callback
        }
    };

})(window, jQuery, ko);
