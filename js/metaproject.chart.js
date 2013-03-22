/*global jQuery: true, ko: true, Chart: true */
(undefined !== window.Chart) && (function($, ko, Chart) {
    "use strict";

    // TODO queue rendering, limit to 1 chart at a time ?

    ko.bindingHandlers.chart = {
        init:function (element, valueAccessor, allBindingsAccessor) {
            var
                ctx = element.getContext('2d'),
                chart = new Chart(ctx);

            chart._type = element.dataset.chart || 'line';

            $(element).data('chart', chart);

            ko.bindingHandlers.chart.update(element, valueAccessor, allBindingsAccessor);
        },
        update:function (element, valueAccessor, allBindingsAccessor) {
            var data = ko.utils.unwrapObservable(valueAccessor()),
                options = allBindingsAccessor().chartOptions,
                chart = $(element).data('chart');

            switch(chart._type) {
                case 'line':
                    chart.Line(data,options);
                    break;
                case 'bar':
                    chart.Bar(data,options);
                    break;
                case 'radar':
                    chart.Radar(data, options);
                    break;
                case 'polar':
                    chart.PolarArea(data,options);
                    break;
                case 'pie':
                    chart.Pie(data, options);
                    break;
                case 'doughnut':
                    chart.Doughnut(data, options);
                    break;
                default:
                    throw 'invalid chart type';

            }
        }
    };

}(jQuery, ko, Chart));
