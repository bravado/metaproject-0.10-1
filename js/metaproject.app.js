/**
 * These functions handle single page applications
 */
(function(window) {
    "use strict";

    var metaproject = window.metaproject || {};

    /**
     * Main Application Class
     *
     * Application bind itself to the dom, calls init()
     *  and triggers the first hashchange when run
     */
    metaproject.Application = function (params) {
        var self = this;

        self.debug = 0;
		self.root = '#/';
		self.notFound = function() { };
		
        if (typeof(params) === 'function') {
            self.init = params;
        }
        else {
            self.init = function () {
            };
            $.extend(self, params);
        }

		Path.root(self.root);
		Path.rescue(self.notFound);
		
        self.run = function (element) {
            ko.applyBindings(self, element);
            self.init.call(self);
            Path.listen();
        };

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
	// The element will be automatically shown/hidden and 
	// will receive activate and deactivate events when the url hash changes
    ko.bindingHandlers.url = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var $window = $(window),
                $element = $(element),
                url = valueAccessor();

			if(typeof(url) !== 'string') {
				throw "url must be a string";
			}
			
            $element.css({ visibility: 'hidden', position: 'absolute', height: 0, overflow: 'hidden' });
			
			var path = Path.map('#' + url).to(function() {
				if ($element.css('visibility') !== 'visible') {
					
					var event = {
						type: 'activate',
						url: url,
						params: this.params };
					
					$element.css({
						visibility: 'visible',
						position: 'inherit',
						height: 'auto',
						overflow: 'inherit' }).trigger(event);
					
				}

				$window.scrollTop($element.data('scroll-top') || 0);
			}).exit(function() {
				if ($element.css('visibility') === 'visible') {
					$element.data('scroll-top', $window.scrollTop());

					var event = { type: 'deactivate' };
					
					$element.css({
						visibility: 'hidden',
						position: 'absolute',
						height: 0,
						overflow: 'hidden' }).trigger(event);
				}
			});
			
			$element.data('path', path);
        }
    };
})(window);

