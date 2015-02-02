/**
 * metaproject Component Index
 *
 * Registers all core components in a AMD application
 *
 * -- IMPORTANT --
 *
 * You must define a metaproject path on your require config
 *
 * require.config({
 *     paths: {
 *         ...
 *         metaproject: '../assets/metaproject/components'
 *     }
 * });
 *
 */
define(function() {

    ko.components.register('data-view', { require: 'metaproject/data-view/component' });

    //var dataView = require();
    //console.log(dataView);




});