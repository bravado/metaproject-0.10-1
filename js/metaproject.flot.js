/*global jQuery: true, ko: true */
(function($, ko) {
    "use strict";
    ko.bindingHandlers.plot = {
        init:function (element, valueAccessor, allBindingsAccessor) {
            var data = ko.utils.unwrapObservable(valueAccessor()),
                options = allBindingsAccessor().plotOptions;

            $.plot($(element), data, options);
        },
        update:function (element, valueAccessor, allBindingsAccessor) {
            var data = ko.utils.unwrapObservable(valueAccessor()),
                plot = $(element).data('plot');

            plot.setData(data);
            plot.draw();
        }
    };

}(jQuery, ko));