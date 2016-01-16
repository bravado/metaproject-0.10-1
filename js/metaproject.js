/*global alert: true, jQuery: true, ko: true */
(function (window, $, ko) {
    "use strict";

    var metaproject = window.metaproject = {};

	// Enable enhanced bindings
	ko.punches.enableAll();

    /**
     * EventEmitter
     * Based on https://github.com/moot/riotjs
     */
    metaproject.EventEmitter = function() {
        this.callbacks = {};
    };

    metaproject.EventEmitter.prototype = {
        on: function(events, fn) {
            if (typeof fn == "function") {
                events = events.split(/\s+/);

                for (var i = 0, len = events.length, type; i < len; i++) {
                    type = events[i];
                    (this.callbacks[type] = this.callbacks[type] || []).push(fn);
                    if (len > 1) fn.typed = true;
                }
            }
            return this;
        },
        one: function(type, fn) {
            if (fn) fn.one = true;
            return this.on(type, fn);

        },
        off: function(events) {
            events = events.split(/\s+/);

            for (var i = 0; i < events.length; i++) {
                this.callbacks[events[i]] = [];
            }

            return this;
        },
        trigger: function(type) {

            var slice = [].slice,
                args = slice.call(arguments, 1),
                fns = this.callbacks[type] || [];

            for (var i = 0, fn; i < fns.length; ++i) {
                fn = fns[i];

                if (fn.one && fn.done) continue;

                // add event argument when multiple listeners
                fn.apply(this, fn.typed ? [type].concat(args) : args);

                fn.done = true;
            }

            return this;
        }
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

        return this;
    };


})(window, jQuery, ko);
