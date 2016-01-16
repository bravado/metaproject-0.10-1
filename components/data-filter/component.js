/*global define: true, ko: true */
define(['text!./view.html'], function (template) {
    "use strict";

    var ViewModel = function (params) {
        var self = this;

        params = $.extend({}, {query: null, filter: '', field: null, placeholder: 'Search...'}, params);

        var _query = params.query;

        self.css = params.class || 'form-control';

        self.placeholder = params.placeholder;

        self.field = params.field;

        self.filter = ko.observable(params.filter);

        self.filter.parse = function(str) {
            var re = /([^ :]+):?([^ ]*)/g,
                q = null,
                query = {};

            while(str !== undefined && (q = re.exec(str)) !== null) {
                if(q[2].length > 0) {
                    query[q[1]] = q[2]; // TODO check if query[q[1]] already exists
                }
                else {
                    // TODO default_field may be an array [ 'OR', 'field1', 'field2' ] or object ?
                    query[params.field] = q[1] + '%';
                }
            }

            return query;
        };


        self.filter.subscribe(function (newValue) {

            var q = self.filter.parse(newValue);

            _query.filter(q);

            return newValue;
        });


    };


    return {
        viewModel: ViewModel,
        template: template
    };

});
