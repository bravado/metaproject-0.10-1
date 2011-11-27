/**
 * This is your view model
 */

var viewModel = {
    myIcon: 'text'
};


(function($) {
    $(window).on('hashchange',
        function(e) {
            var path = window.location.hash.substr(1);
            
            if(path.length == 0) {
                // Hide other modules
                $('div[role=page]:visible').hide();

                // Show main
                $('div[role=main]:hidden').show();
            }
            else {
                // Hide main
                $('div[role=main]:visible').hide();
                var params = path.split('/');

                var me = $('#' + params[0]);

                if(me.length == 0) {
                    // Hide other modules
                    $('div[role=page]:visible').hide();
                    // Load and add the new module to the DOM
                    me = $('<div id="' + params[0] + '" role="page"></div>').include(params[0] + '.html').insertAfter('div[role=main]').show();
                }
                else {
                    if(me.is(':hidden')) {
                        $('div[role=page]:visible').hide();

                        me.show();
                    }
                }
            }

        }).trigger('hashchange');

    ko.applyBindings();
})(jQuery);