/*global metaproject: true, ko: true */
(function($) {
    "use strict";

    metaproject.ui = metaproject.ui || {};

    metaproject.ui.Grid = function(data, params) {
        var self = this;

        params = $.extend({}, { columns: [], actions: []}, params);
        // data is an array
        self.data = data;

        if(params.columns.length == 0) {

            if(ko.unwrap(self.data).length == 0) {
                if(self.data instanceof ko.observable) {
                    // may update
                    self.columns = ko.computed(function() {
                        var data = ko.unwrap(self.data);
                        var columns = [];

                        if(data.length > 0) {
                            $.each(data[0], function(i, e) {

                            });


                        }


                    }, self);


                }
                else {

                }
            }
            // TODO if columns.length = 0, fill values with properties from data

        }
        else {
            self.columns = params.columns;
        }


        self.actions = params.actions;

    };

    metaproject.ui.Grid.html =
        '<table class="table table-striped table-condensed"> \
        <thead> \
        <tr> \
            <!-- ko foreach: columns --> \
            <th data-bind="html: label"></th> \
            <!-- /ko --> \
            <!-- ko if: actions.length > 0 --> \
            <th></th> \
            <!-- /ko --> \
        </tr> \
        </thead> \
        <tbody data-bind="foreach: data"> \
            <tr data-bind=""> \
        <!-- ko foreach: $parent.columns --> \
                <td data-bind="html: typeof value == \'function\' ? value($parent) : $parent[value]"></td> \
        <!-- /ko --> \
                <td data-bind="foreach: $parent.actions"> \
                    <button class="btn" data-bind="click: function() { fn($parent); }, html: label, css: $data.css || {}"></button> \
                </td> \
            </tr> \
        </tbody> \
    </table>';

    ko.bindingHandlers.grid = {

        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            element.innerHTML = metaproject.ui.Grid.html;

            var childContext = bindingContext.createChildContext(
                valueAccessor(),
                null, // Optionally, pass a string here as an alias for the data item in descendant contexts
                function(context) {
                    ko.utils.extend(context, valueAccessor());
                });

            ko.applyBindingsToDescendants(childContext, element);

            return { controlsDescendantBindings: true };

        },

        update: function(element, valueAccessor, allBindings, viewModel, context) {
//            return ko.bindingHandlers.with.update(element, valueAccessor,
//                allBindings, viewModel, context);
        }

    };
})(jQuery);