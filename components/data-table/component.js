/*global define: true, ko: true */
define(['text!./view.html'], function(template) {
    "use strict";

    var ViewModel = function(params) {
        var self = this;

        params = $.extend({}, {
            header: undefined,
            data: [],
            columns: [],
            actions: []
        }, params);

        // TODO header: support templates like http://jsfiddle.net/rniemeyer/VZmsy/


        //if (undefined === params.query.filter()._limit) {
        //    params.query.filter.set('_limit', undefined === params.limit ? 50 : params.limit );
        //}


        var columns = ko.computed(function() {
            var columns = ko.unwrap(params.columns);

            if (columns.length === 0) {
                // if it's an observable, contents may change
                var rows = params.data(),
                    cols = [];

                if (rows.length > 0) {
                    var row = ko.mapping.toJS(rows[0]);

                    jQuery.each(row, function(i, e) {
                        cols.push({
                            label: i,
                            text: i
                        });
                    });
                }

                return cols;

            } else {
                var cols = [];

                jQuery.each(columns, function(i, e) {
                    if (typeof(e) === 'object') {
                        cols.push(e);
                    } else {
                        cols.push({
                            label: e,
                            text: e
                        });
                    }
                });

                return cols;

            }

        });


        var actions = [];

        jQuery.each(params.actions, function(i, e) {

            if (typeof(e) === 'function') {
                actions.push({
                    label: i,
                    fn: e
                });
            } else {
                actions.push({
                    label: i,
                    fn: e.fn,
                    css: e.css
                });
            }
        });

        self.header = params.header;

        self.grid = {
            data: params.data,
            columns: columns,
            actions: actions
        };

    };


    return {
        viewModel: ViewModel,
        template: template
    };

});