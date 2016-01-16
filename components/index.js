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

    ko.components.register('data-table', { require: 'metaproject/data-table/component' });
    ko.components.register('data-paginator', { require: 'metaproject/data-paginator/component' });
    ko.components.register('data-filter', { require: 'metaproject/data-filter/component' });
    //var dataView = require();
    //console.log(dataView);




});