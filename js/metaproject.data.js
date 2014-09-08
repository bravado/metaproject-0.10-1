/*global alert: true, jQuery: true, ko: true */
(function (window, $, ko) {
    "use strict";

    var metaproject = window.metaproject || {};

    /**
     * metaproject.DataSource
     *
     * Default REST datasource
     */
    metaproject.DataSource = function (base_url, options) {
        var self = this;

        options = $.extend({
            key: 'id'
        }, options);

        self.errorHandler = function(xhr, status, error) {
            self.trigger('error', { message: xhr.responseText, code: xhr.status });
        };

        self._id = function (model_or_id) {
            if (typeof(model_or_id) === 'object') {
                if(model_or_id.hasOwnProperty(options.key)) {
                    return model_or_id[options.key];
                }
                else {
                    throw "Model key " + options.key + " not set!";
                }
            }
            else {
                return model_or_id;
            }
        };

        // get(callback) - fetch all
        // get(callback, params) - with params
        // get(path || {model}, params);
        // get(path || {model}, params, callback);
        // get(path || {model}, callback);
        self.get = function (path, params, callback) {

            if(path === undefined || path === null) {
                path = '';
            }

            switch(typeof(path)) {
                // get(callback)
                case 'function':
                    callback = path;
                    path = '';
                    break;
                case 'string':
                    if(path === '/') {
                        path = '';
                    }
                    else if (path.length > 0 && path[0] !== '/') {
                        path = '/' + path;
                    }
                    break;
                default: // object
                    path = '/' + self._id(path);
                    break;
            }


            if (typeof(params) === 'function') {
                callback = params;
                params = {};
            }

            return $.ajax({
                    url: base_url + path,
                    data: params || {},
                    dataType: 'json',
                    type: 'GET',
                    error: self.errorHandler,
                    success: function (data) {
                        if (typeof(callback) === 'function') {
                            callback(data);
                        }
                    }
                }
            );
        };

        self.post = function (data, callback) {
            // TODO datasource.post(path, data, callback) ?
            return $.ajax({
                url: base_url,
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function (data) {
                    self.trigger('changed', { action: 'post', data: data});
                    if (typeof(callback) === 'function') {
                        callback(data);
                    }
                },
                error: self.errorHandler
            });
        };

        self.put = function (id, data, callback) {

            // datasource.put(model, callback)
            if(typeof(id) == "object") {
                if(typeof(data) == "function") {
                    callback = data;
                }

                data = id;
                id = self._id(data);
            }

            return $.ajax({
                url: base_url + '/' + self._id(id),
                dataType: 'json',
                type: 'PUT',
                data: data,
                success: function (data) {
                    self.trigger('changed', { action: 'put', data: data});
                    if (typeof(callback) === 'function') {
                        callback(data);
                    }
                },
                error: self.errorHandler
            });
        };

        self.destroy = function (model, callback) {
            return $.ajax({
                url: base_url + '/' + self._id(model),
                dataType: 'json',
                type: 'DELETE',
                success: function (data) {
                    self.trigger('changed', { action: 'destroy', data: data});

                    if (typeof(callback) === 'function') {
                        callback(data);
                    }
                },
                error: self.errorHandler
            });
        };

    };

    metaproject.DataSource.prototype = new metaproject.EventEmitter();

    /**
     * Model factory
     * Returns a Model class with default values and computed observables
     * @param defaults - default fields for a new model
     * @param mapping - ko.mapping parameters
     * @returns {Function}
     * @constructor
     */
    metaproject.Model = function (defaults, mapping) {

        var Model = function (data) {
            var instance = this;

            data = data || {};
            var computeds = {};
            $.each(defaults, function (i, e) {
                if (typeof(e) === 'function') {
                    computeds[i] = ko.computed({ read: e, deferEvaluation: true }, instance);
                }
                else {
                    if (undefined === data[i]) {
                        data[i] = defaults[i];
                    }
                }
            });

            ko.mapping.fromJS(data, mapping || {}, instance);

            // computeds always override other fields
            $.extend(instance, computeds);

        };


        // Predefined mapper for this model
        Model.mapper = {
            create: function (options) {
                return new Model(options.data);
            }
        };


        // Model instances will share this DataSource
        var _datasource = null;

        /**
         *
         * @returns {metaproject.DataSource}
         */
        Model.getDataSource = function () {
            if (_datasource) {
                return _datasource;
            }
            else {
                throw "Model not bound to any DataSource";
            }
        };

        /**
         * Binds this model to a datasource on url
         * @param base_url
         * @param options
         * @returns {Function}
         */
        Model.bind = function (base_url, options) {


            if (typeof(base_url) === 'string') {
                // When using the bind() method, always set the Model option
                if (undefined === options) {
                    options = { model: Model };
                }
                else {
                    options.model = Model;
                }

                _datasource = new metaproject.DataSource(base_url, options);
            }
            else {
                // custom datasource implementation
                // { _id: fn(..), get: fn(..), post: fn(..), put: fn(..), delete: fn(..) }
                _datasource = base_url;
            }

            return Model;
        };

        /**
         * Factory for this Model
         */
        Model.create = function (data) {
            return new Model(data);
        };

        Model.get = function(id, callback) {

            return Model.getDataSource().get(id, function(data) {
                if (data instanceof Array) {
                    callback($.map(data, function (e, i) {
                        return new Model(e);
                    }));
                }
                else {
                    callback(new Model(data));
                }
            });
        };

        Model.on = function(event, callback) {
            return Model.getDataSource().on(event, callback);
        };


        /**
         * Trigger a changed event on the underlying DataSource
         */
        Model.changed = function() {
            return Model.getDataSource().trigger('changed');
        };

        /**
         * Queries this model's datasource
         * Results are fetched when the returned observable is first bound
         *
         * @param params query parameters
         * @param live boolean If true (default), update this query results when the datasource changes
         * @returns ko.observable The Query results
         */
        Model.query = function (params, live) {
            params = params || {};

            var datasource = Model.getDataSource(),
                _value = ko.observable([]), // current value
                _params = ko.observable(params), // query parameters
                _filter = ko.observable({}), // the filter
                _hash = ko.observable(null);

            // an observable that retrieves its value when first bound
            // From http://www.knockmeout.net/2011/06/lazy-loading-observable-in-knockoutjs.html
            var result = ko.computed({
                read: function () {

                    var params = $.extend({}, _params(), _filter());

                    var newhash = ko.toJSON(params);
                    if (_hash() !== newhash) {
                        result.loading(true);
                        datasource.get('/', params, function (newData) {
                            _hash(newhash);
                            _value($.map(newData, Model.create));

                            result.loading(false);
                        });
                    }

                    //always return the current value
                    return _value();
                },
                write: _value,
                deferEvaluation: true  //do not evaluate immediately when created
            });

            // indicates an ajax request is in progress
            result.loading = ko.observable(false);

            // update when datasource changes (default true)
            result._live = (typeof(live) == "boolean" ? live : true);

            // observable
            // base query parameters
            result.params = _params;

            /**
             * results filter
             *
             * the filter is an observable, when it changes, a new request is made
             *  filter({ params }) resets the filter
             *  filter.set(field, value) only changes "field"
             */
            result.filter = _filter;

            /**
             * Set the filter parameter
             * @param param - object or string
             * @param value
             */
            result.filter.set = function (param, value) {

                if(typeof(param) == "object") {
                    var filter = result.filter();
                    for(var p in param) {
                        filter[p] = param[p];
                    }
                }
                else {
                    result.filter()[param] = value;
                }

                result.filter.valueHasMutated();
            };

            /**
             * Resets filter, leaving _* parameters unchanged
             * @param notify Notify the change (default false)
             */
            result.filter.reset = function (notify) {

                if(notify) {
                    result.filter({});
                }
                else {
                    var f = result.filter();

                    for (var member in f) delete f[member];

                }

            };

            /**
             * Return an observable that auto updates when the DataSource changes
             * @param params filter params, passed as GET variables
             * @param transform optional transform function
             *                      which receives the backend response and returns the observable value
             * @returns ko.observable
             */
            result.observable = function (params, transform) {
                var me = ko.observable(null),
                    datasource = Model.getDataSource();

                // Loading flag, triggered when the request starts
                me.loading = ko.observable(false);

                // Reload this observable
                me.reload = function () {
                    me.loading(true);

                    datasource.get('/', params, function (newData) {
                        if (typeof(transform) === 'function') {
                            me(transform(newData));
                        }
                        else {
                            me(newData);
                        }
                        me.loading(false);
                    });
                };

                // update this observable when the query hash changes
                _hash.subscribe(function(newValue) {
                    if(newValue !== null) {
                        me.reload();
                    }
                });

                return me;
            };

            result.reload = function () {
                _hash(null);
            };

            // Reload when datasource is updated
            datasource.on('changed', function () {
                if (result._live) {
                    result.reload();
                }
            });

            return result;
        };



        /**
         * Query this Model and publish results to channel
         * @param channel The channel string
         * @param params Navigator params
         * @see Model.query
         */
        Model.publish = function (channel, params) {
            return Model.query(params).publishOn(channel);
        };


        // For instantiated models
        Model.prototype.destroy = function(callback) {
            var data = ko.mapping.toJSON(this),
                datasource = Model.getDataSource();

            return datasource.destroy(datasource._id(data), callback);
        };

        Model.prototype.save = function (callback) {
            var data = ko.mapping.toJSON(this),
                datasource = Model.getDataSource(),
                id = datasource._id(data);

            if (id) {
                return datasource.put(id, data, callback);
            }
            else {
                return datasource.post(data, callback);
            }
        };

        return Model;

    };


    /**
     * The model binding
     */

    ko.bindingHandlers.model = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var model = ko.unwrap(valueAccessor());

            $(element).find('input[name]', function (i, e) {
                console.log(e);
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {

        }
    }
})(window, jQuery, ko);