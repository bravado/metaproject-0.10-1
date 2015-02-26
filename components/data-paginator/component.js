/*global define: true, ko: true */
define(['text!./view.html'], function (template) {
    "use strict";

    var ViewModel = function (params) {
        var self = this;

        params = $.extend({}, {query: undefined}, params);

        // TODO header: support templates like http://jsfiddle.net/rniemeyer/VZmsy/

        var query = params.query;

        //if (undefined === params.query.filter()._limit) {
        //    params.query.filter.set('_limit', undefined === params.limit ? 50 : params.limit );
        //}

        self.count = query.observable({_fields: 'COUNT(*)'}, function (result) {
            return parseInt(result[0]['COUNT(*)'], 10);
        });
        //filter: jQuery.extend({ default_field: 'q', fields: null }, params.filter || {}),
        self.page = ko.observable(1);
        self.rows_per_page = ko.computed({
            read: function() {
                return query.params()._limit;
            },
            write: function(limit) {
                var params = query.params();

                if(params._limit !== limit) {
                    params._limit = limit;
                    query.params.valueHasMutated();
                }

            }
        });

        self.page.next = function () {
            if(self.page() < self.pages())
                self.page(self.page() + 1);
        };
        self.page.prev = function () {
            if(self.page() > 1)
                self.page(self.page() - 1);
        };

        self.page.first = function() {
            if(self.page() > 1)
                self.page(1);
        };

        self.page.last = function () {
            if(self.page() < self.pages())
                self.page(self.pages());
        };

        //
        self.offset = ko.computed(function () {
            var params = query.params(),
                offset = (self.page() - 1) * self.rows_per_page();

            // bind to filter updates also
            query.filter();

            if(params._offset !== offset) {
                params._offset = offset;
                query.params.valueHasMutated();
            }

            return parseInt(offset, 10);
        }, self); //.extend({ throttle: 500 });

        //
        //
        self.pages = ko.computed(function () {
            return Math.ceil(this.count() / this.rows_per_page());
        }, self);




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

    };


    return {
        viewModel: ViewModel,
        template: template
    };

});
