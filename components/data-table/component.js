/*global define: true, ko: true */
define(['text!./view.html'], function(template) {
    "use strict";

    var ViewModel = function (params) {
        var self = this;

        params = $.extend({}, { header: undefined, data: [], columns: [], actions: []}, params);

        // TODO header: support templates like http://jsfiddle.net/rniemeyer/VZmsy/


        //if (undefined === params.query.filter()._limit) {
        //    params.query.filter.set('_limit', undefined === params.limit ? 50 : params.limit );
        //}

        var columns = [];

        // TODO if empty cols, montar grid a partir do model
        if(params.columns.length === 0) {
            // if it's an observable, contents may change
            if(ko.isObservable(params.data)) {
                columns = ko.computed(function() {
                    var rows = params.data(),
                        cols = [];

                    if(rows.length > 0) {
                        var row = ko.mapping.toJS(rows[0]);

                        jQuery.each(row, function(i, e) {
                            cols.push({ label: i, text: i});
                        });
                    }

                    return cols;

                });
            }
            else {
                jQuery.each(params.data[0], function(i, e) {
                    columns.push({ label: i, text: i});
                });
            }
        }
        else {
            jQuery.each(params.columns, function (i, e) {
                if(typeof(e) === 'object') {
                    columns.push(e);
                }
                else {
                    columns.push({ label: e, text: e});
                }
            });
        }

        var actions = [];

        jQuery.each(params.actions, function(i, e) {

            if(typeof(e) === 'function') {
                actions.push({ label: i, fn: e });
            }
            else {
                actions.push({ label: i, fn: e.fn, css: e.css });
            }
        });

        self.header = params.header;

        self.grid = {
            data: params.data,
            columns: columns,
            actions: actions
        };

        //self.paginator = {
        //    count: nav.observable({ _fields: 'COUNT(*)' }, function (result) {
        //        return result[0]['COUNT(*)']();
        //    }),
        //    filter: jQuery.extend({ default_field: 'q', fields: null }, params.filter || {}),
        //    page: ko.observable(1),
        //    rows_per_page: ko.observable(nav.filter()._limit),
        //    query: ko.observable(),
        //    next: function () {
        //        self.paginator.page(self.paginator.page() + 1);
        //    },
        //    prev: function () {
        //        self.paginator.page(self.paginator.page() - 1);
        //    }
        //};
        //
        //self.paginator.offset = ko.computed(function () {
        //    var offset = (self.paginator.page() - 1) * self.paginator.rows_per_page();
        //    nav.filter.set('_offset', offset);
        //    return offset;
        //}, this.paginator).extend({ throttle: 500 });
        //
        //self.paginator.query.parse = function(str) {
        //    var re = /([^ :]+):?([^ ]*)/g,
        //        q = null,
        //        query = {};
        //
        //    while(str !== undefined && (q = re.exec(str)) !== null) {
        //        if(q[2].length > 0) {
        //            query[q[1]] = q[2]; // TODO check if query[q[1]] already exists
        //        }
        //        else {
        //            // TODO default_field may be an array [ 'OR', 'field1', 'field2' ] or object ?
        //            query[self.paginator.filter.default_field] = q[1] + '%';
        //        }
        //    }
        //
        //    return query;
        //};
        //
        //self.paginator.query.subscribe(function (newValue) {
        //
        //    var page = self.paginator.page(),
        //        query = self.paginator.query.parse(newValue);
        //
        //    nav.filter.reset(query);
        //
        //    if (page !== 1) {
        //        self.paginator.page(1);
        //    }
        //    else {
        //        self.paginator.page.valueHasMutated();
        //    }
        //
        //    return query;
        //});
        //
        //self.paginator.rows_per_page.subscribe(function (newValue) {
        //    nav.filter.set('_limit', newValue);
        //});
        //
        //
        //this.paginator.pages = ko.computed(function () {
        //    return Math.ceil(this.count() / this.rows_per_page());
        //}, this.paginator);
        //
        //
        //this.paginator.last = ko.computed(function () {
        //    return(this.offset() + this.rows_per_page() > this.count() ? this.count() : this.offset() + this.rows_per_page());
        //}, this.paginator);
    };


    return {
        viewModel: ViewModel,
        template: template
    };

});
