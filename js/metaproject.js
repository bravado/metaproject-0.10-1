/*global alert: true, jQuery: true, ko: true */
(function (window, $, ko) {
    "use strict";

    var metaproject = window.metaproject = {};

	// Enable enhanced bindings
	ko.punches.enableAll();

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


})(window, jQuery, ko);
