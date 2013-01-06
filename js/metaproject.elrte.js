

// ElRTE / ElFinder
(function ($, ko) {
    ko.bindingHandlers.elrte = {
        init:function (element, valueAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor());
            // TODO pass options to the customFileInput
            $(element).elrte(options);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).elrte('destroy');
            });
        },
        update:function (element, valueAccessor, allBindingsAccessor, context) {
            //handle programmatic updates to the observable
            var options = ko.utils.unwrapObservable(valueAccessor());
            //$(element).fileupload('option', options);

        }
    };


    ko.bindingHandlers.elfinder = {
        init:function (element, valueAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor());
            // TODO pass options to the customFileInput
            $(element).elfinder(options);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).elfinder('destroy');
            });
        },
        update:function (element, valueAccessor, allBindingsAccessor, context) {
            //handle programmatic updates to the observable
            var options = ko.utils.unwrapObservable(valueAccessor());
            //$(element).fileupload('option', options);

        }
    }
})(jQuery, ko);
// - end of ElRTE/ElFinder