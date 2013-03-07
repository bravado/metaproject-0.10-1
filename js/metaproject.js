/*global alert: true, jQuery: true, ko: true */
(function (window, $, ko) {
    "use strict";

    var metaproject = window.metaproject = {};

    metaproject.Application = function (params) {
        var self = this;

        self.debug = 0;

        if(typeof(params) === 'function') {
            self.init = params;
        }
        else {
            self.init = function () {};
            $.extend(this, params);
        }

        self.run = function (element) {
            ko.applyBindings(self, element);
            self.init.call(self);
            $(window).trigger('hashchange');
        };

    };

    metaproject.Loader = function (routes, params) {
        var options = {
            'default': '/',
            error: function (e) {
                alert(e.responseText);
            }
        };

        $.extend(options, params);

        var _content = ko.observable(null);

        _content.id = ko.observable(null);

        _content.load = function (id, callback) {

            // default = /
            if (undefined === id || id === '') {
                id = '/';
            }

            if (id === _content.id()) {
                return;
            }

            var path = routes[id];

            if (undefined === routes[id]) {
                _content.id(null);
                _content('Route ' + id + ' not found');
                return;
            }

            if (typeof(path) === 'string') {

                if (path[0] === '#') {
                    var src = $(path);

                    if (src.length > 0) { // If its an element, get the relative DOM node
                        _content(null);
                        _content.id(id);
                        _content(src.html());
                        if (typeof(callback) === 'function') {
                            callback();
                        }

                    }
                    else {
                        _content.id(null);
                        _content('Element ' + path + ' not found');
                    }
                }
                else {
                    var params = {};

                    if (metaproject.debug) {
                        params.ts = new Date().getTime();
                    }

                    $.ajax({
                        url: path,
                        type: 'GET',
                        data: params,
                        dataType: 'html',
                        success: function (data) {
                            _content(null);
                            _content.id(id);
                            _content(data);

                            if (typeof(callback) === 'function') {
                                callback();
                            }

                        },
                        error: function (e) {
                            _content.id(null);
                            _content(null);
                            options.error(e);
                        }
                    });
                }
            }
        };

        _content.load(options['default']);
        return _content;
    };

    /* jQuery plugs */

    $.fn.applyBindings = function (viewModel) {
        this.data('viewModel', viewModel).each(function (idx, element) {
            ko.applyBindings(viewModel, element);
        });
    };

    /* Includes and initializes another file on the element */
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
            if(!url) {
                $element.children().trigger('activate', $element);
            }
        }
    };

    // Attach an url controller to this node
    // The node will receive activate and deactivate events when the url changes
    ko.bindingHandlers.url = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            var $element = $(element),
                url = valueAccessor();

            $element.css({ visibility: 'hidden', position: 'absolute', height: 0, overflow: 'hidden' });

            $(window).on('hashchange', function(e) {
                var hash = window.location.hash.substr(1) || '/';

                if(hash === url) {
                    if($element.css('visibility') !== 'visible') {
                        $element.css({ visibility: 'visible', position: 'inherit', height: 'auto', overflow: 'inherit' }).children().trigger('activate', [ element, hash ]);
                    }
                }
                else {
                    if($element.css('visibility') === 'visible') {
                        $element.css({ visibility: 'hidden', position: 'absolute', height: 0, overflow: 'hidden' }).children().trigger('deactivate', [$element, hash]);
                    }
                }
            });


            // TODO dispose callback
        }
    };

})(window, jQuery, ko);


