/*global jQuery: true, metaproject: true, ko: true */

// metaproject ui components
(function(window, $, metaproject, ko) {
    "use strict";

    metaproject.ui = metaproject.ui || {};

    metaproject.ui.Grid = function(data, params) {
        var self = this;

        params = $.extend({}, { columns: [], actions: []}, params);
        // data is an array
        self.data = data;
        self.columns = params.columns;
        self.actions = params.actions;


    };


    /* UI Alerts */
    $.fn.alert = function (kind, message) {
        var options = {
            level: kind,
            block: false,
            delay: 250
        };

        $('<div class="alert-message ' + options.level + (options.block ? ' block-message' : '') + '" style="display: none;"><a class="close" href="#">×</a>' + message + '</div>')
            .prependTo(this).fadeIn(options.delay);
    };

    // Bindings for the close alert button
    $(document).on('click', ".alert-message .close", function (e) {
        e.preventDefault();
        var $element = $(this).parent('.alert-message');

        $element.fadeOut(250, function () {
            $element.remove();
        });

    });

    // Alert helpers
    $.fn.info = function (message, options) {
        this.alert('info', message);
    };

    $.fn.success = function (message) {
        this.alert('success', message);
    };

    $.fn.warning = function (message) {
        this.alert('warning', message);
    };

    $.fn.error = function (message) {
        this.alert('error', message);
    };

    /* Custom Binding Handlers */

    ko.bindingHandlers.autocomplete = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {

            var $element = jQuery(element),
                params = valueAccessor();

            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $element.autocomplete("destroy");
            });

            // treat String, callback or Array as source
            if (typeof(params) === 'string' || typeof(params) === 'function' || params instanceof Array) {
                params = { source: params };
            }

            var $autocomplete = $element.autocomplete(params).data('autocomplete');

            // Custom render callback http://jqueryui.com/demos/autocomplete/#custom-data
            // TODO render as string => ko templates ?
            if (undefined !== params.renderItem) {
                $autocomplete._renderItem = params.renderItem;
            }

            if (undefined !== params.renderMenu) {
                $autocomplete._renderMenu = params.renderMenu;
            }
        }
    };

    ko.bindingHandlers.dialog = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = jQuery(element),
                params = valueAccessor();

            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $element.dialog("destroy");
            });

            jQuery.extend(params, { autoOpen: false });

            $element.dialog(params);
        }
    };


    ko.bindingHandlers.icon = {
        init: function (element, valueAccessor) {

            var icon = '<span class="ui-icon ui-icon-' + valueAccessor() + '"></span>';

            jQuery(element).prepend(icon);
        }
    };
})(window, jQuery, metaproject, ko);