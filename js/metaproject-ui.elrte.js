/*global jQuery:true, ko:true, elRTE:true */
// ElRTE / ElFinder
if (undefined !== window.elRTE) {
    (function ($, ko, elRTE) {
        "use strict";

        // From underscore, will debounce elrte updates on window.focus
        var limit = function (func, wait, debounce) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var throttler = function () {
                    timeout = null;
                    func.apply(context, args);
                };
                if (debounce) {
                    clearTimeout(timeout);
                }
                if (debounce || !timeout) {
                    timeout = setTimeout(throttler, wait);
                }
            };
        };

        ko.bindingHandlers.elrte = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                var $element = $(element),
                    elrte = ko.utils.unwrapObservable(valueAccessor()),
                    value = allBindingsAccessor().value;

                if (value && value.subscribe) {
                    $element.val(ko.utils.unwrapObservable(value));

                    value.subscribe(function (newValue) {
                        if (!element._updating) {
                            $element.elrte('val', $element.val());
                        }
                    });
                }

                $element.elrte(elrte);

                // limit the update rate to every 200ms
                var updater = limit(function () {
                    element._updating = true;
                    //$element.val($element.elrte('val')).change();
                    $element.elrte('updateSource').change();
                    element._updating = false;
                }, 200, true);

                // elrte calls window.focus() when the ui is updated
                var _focus = element.elrte.iframe.contentWindow.window.focus;
                element.elrte.iframe.contentWindow.window.focus = function () {
                    updater();
                    _focus.apply(this, arguments);
                };

                // also update on editor keyups
                element.elrte.$doc.on('keyup', updater);


                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $element.elrte('destroy');
                });
            },
            update: function (element, valueAccessor, allBindingsAccessor, context) {
                //handle programmatic updates to the observable
//            var options = ko.utils.unwrapObservable(valueAccessor());
                //$(element).fileupload('option', options);

            }
        };

        ko.bindingHandlers.elfinder = {
            init: function (element, valueAccessor) {
                var $element = $(element),
                    options = ko.utils.unwrapObservable(valueAccessor());

                $element.elfinder(options);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $element.elfinder('destroy');
                });
            },
            update: function (element, valueAccessor, allBindingsAccessor, context) {
                //handle programmatic updates to the observable
//            var options = ko.utils.unwrapObservable(valueAccessor());
                //$(element).fileupload('option', options);

            }
        };
    })(jQuery, ko, elRTE);
}
// - end of ElRTE/ElFinder
