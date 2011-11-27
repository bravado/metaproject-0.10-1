// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function() {
    log.history = log.history || [];   // store logs to an array for reference
    log.history.push(arguments);
    if (this.console) {
        arguments.callee = arguments.callee.caller;
        var newarr = [].slice.call(arguments);
        (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
    }
};

// make it safe to use console.log always
(function(b) {
    function c() {
    }

    for (var d = "assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a; a = d.pop();) {
        b[a] = b[a] || c
    }
})((function() {
    try {
        console.log();
        return window.console;
    } catch(err) {
        return window.console = {};
    }
})());

// JSON implementation for browsers that do not support it
Modernizr.load({
    test: window.JSON,
    nope: 'js/json2.js'
});

ko.bindingHandlers.icon = {
    update: function(element, valueAccessor) {

        var icon = '<span class="ui-icon ui-icon-' + valueAccessor() + '"></span>';

        jQuery(element).prepend(icon);
    }
};

ko.bindingHandlers.include = {
    update: function(element, valueAccessor) {
        jQuery(element).include(valueAccessor());
    }
};

(function($) {
    window.metaproject = {
        init: function(target) {

            console.log(target);
            if(typeof(target) == 'string') {
                target = $(target);
            }

            // Default UI element behaviour
            console.log(target.find('.tabs').tabs());
            console.log(target.find('.pills').pills());
            console.log(target.find('.dropdown').dropdown());
        }
    };

    /* Includes an initializes another file on the element */
    $.fn.include = function(url) {
        var me = this;
        return this.load(url, function() {
            metaproject.init(me);
        });
    };

    /* UI Alerts */
    $.fn.alert = function(kind, message) {
        var options = {
            level: kind,
            block: false,
            delay: 250
        };

        $('<div class="alert-message ' + options.level + (options.block ? ' block-message' : '') + '" style="display: none;"><a class="close" href="#">×</a>' + message + '</div>')
            .prependTo(this).fadeIn(options.delay);
    };

    // Bindings for the close alert button
    $(document).on('click', ".alert-message .close", function(e) {
        e.preventDefault();
        var $element = $(this).parent('.alert-message');

        $element.fadeOut(250, function() {
            $element.remove();
        });

    });

    // Alert helpers
    $.fn.info = function(message, options) {
        this.alert('info', message);
    };

    $.fn.success = function(message) {
        this.alert('success', message);
    };

    $.fn.warning = function(message) {
        this.alert('warning', message);
    };

    $.fn.error = function(message) {
        this.alert('error', message);
    };

    // This initializes all dynamic elements on the main document
    metaproject.init($(document));
})(jQuery);


