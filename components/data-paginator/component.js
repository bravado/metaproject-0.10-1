/*global define: true, ko: true */
define(['text!./view.html', 'i18n!./nls/messages'], function (template, messages) {
    "use strict";

    var ViewModel = function (params) {
        var self = this;

		self.messages = messages;
		
        params = $.extend({}, {query: undefined}, params);

        // TODO header: support templates like http://jsfiddle.net/rniemeyer/VZmsy/

        var query = params.query;
        self.css = params.class || 'pagination';
        //if (undefined === params.query.filter()._limit) {
        //    params.query.filter.set('_limit', undefined === params.limit ? 50 : params.limit );
        //}

        self.count = query.totalElements;
        
        //filter: jQuery.extend({ default_field: 'q', fields: null }, params.filter || {}),
        self.page = ko.computed(function() {
        	return query.number() + 1;
        });
        
        self.rows_per_page = query.size;

        self.page.next = function () {
            if(self.page() < self.pages())
                query.params.page(self.page());
        };
        
        self.page.prev = function () {
            if(self.page() > 1)
                query.params.page(query.number() - 1);
        };

        self.page.first = function() {
            if(self.page() > 1)
                query.params.page(0);
        };

        self.page.last = function () {
            if(self.page() < self.pages())
                query.params.page(self.pages() - 1);
        };


        self.pages = query.totalPages;

    };


    return {
        viewModel: ViewModel,
        template: template
    };

});
