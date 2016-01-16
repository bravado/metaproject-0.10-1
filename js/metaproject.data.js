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

        $.extend(this, new metaproject.EventEmitter());

        self.errorHandler = function (xhr, status, error) {
            self.trigger('error', {message: xhr.responseText, code: xhr.status});
        };

        self._id = function (model_or_id) {
            if (typeof(model_or_id) === 'object') {
                if (model_or_id.hasOwnProperty(options.key)) {
                    return ko.unwrap(model_or_id[options.key]);
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
        // get(params, callback) - with params
        // get(id, callback); - fetch single
        // get(id, params, callback); - with params
        self.get = function (path, params, callback) {

            if (path === undefined || path === null) {
                path = '';
            }

            switch (typeof(path)) {
                // get(callback)
                case 'function':
                    callback = path;
                    path = '';
                    break;
                case 'string': // get(id, callback)
                    if (path === '/') {
                        path = '';
                    }
                    else if (path.length > 0 && path[0] !== '/') {
                        path = '/' + path;
                    }
                    break;
                case 'number':
                    path = '/' + path;
                    break;
                default: // get (object, callback)
                    callback = params;
                    params = path;
                    path = '';
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
            });
        };

        self.post = function (data, callback) {
            // TODO datasource.post(path, data, callback) ?
            return $.ajax({
                url: base_url,
                dataType: 'text',
                contentType: 'application/json',
                type: 'POST',
                data: ko.toJSON(data),
                success: function (data) {
                    self.trigger('changed', {action: 'post', data: data});
                    if (typeof(callback) === 'function') {
                        callback(data);
                    }
                },
                error: function (xhr, textStatus, ex) {
                    if (xhr.status == 201) {
                        this.success(null, "Created", xhr);
                    }
                    else {
                        self.errorHandler.apply(this, arguments);
                    }
                }
            });
        };

        self.put = function (id, data, callback) {

            // datasource.put(model, callback)
            if (typeof(id) == "object") {
                if (typeof(data) == "function") {
                    callback = data;
                }

                data = id;
                id = self._id(data);
            }

            return $.ajax({
                url: base_url + '/' + self._id(id),
                dataType: 'json',
                type: 'PUT',
                contentType: 'application/json',
                data: ko.toJSON(data),
                success: function (data) {
                    self.trigger('changed', {action: 'put', data: data});
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
                dataType: 'text',
                type: 'DELETE',
                success: function (data) {
                    self.trigger('changed', {action: 'destroy', data: data});

                    if (typeof(callback) === 'function') {
                        callback(data);
                    }
                },
                error: self.errorHandler
            });
        };

    };

    /**
     * Model factory Returns a Model class with default values and computed
     * observables
     *
     * @param defaults -
     *            default fields for a new model
     * @param mapping -
     *            ko.mapping parameters
     * @returns {Function}
     * @constructor
     */
    metaproject.Model = function (defaults, mapping) {
        // default defaults
        defaults = defaults || {};

        var Model = function (data) {
            var instance = this,
                computeds = {};

            // prepare mapping
            mapping = mapping || {};
            mapping.include = mapping.include || [];
            mapping.ignore = mapping.ignore || [];
            mapping.ignore.push('_links');
            mapping.ignore.push('_embedded');


            // prepare data
            data = data || {};

            $.each(defaults, function (i, e) {
                if (typeof(e) === 'function') {
                    switch (e) {
                        case Date:
                            if (undefined !== data[i]) {
                                data[i] = new Date(data[i]);
                            }
                            else {
                                data[i] = null;
                            }

                            break;
                        default:
                            computeds[i] = ko.computed({read: e, write: e, deferEvaluation: true}, instance);
                    }

                }
                else {
                    if (undefined === data[i]) {
                        data[i] = defaults[i];
                    }
                }
            });

            data._embedded = data._embedded || defaults._embedded;

            if (data._embedded) {

                var _embedded = instance._embedded = {};

                $.each(data._embedded, function (i, e) {

                    if (e instanceof Array) {
                        if (defaults._links && typeof(defaults._links[i]) === 'function') {
                            _embedded[i] = ko.observableArray($.map(e, function (data) {
                                return new defaults._links[i](data);
                            }));


                        }
                        else {
                            _embedded[i] = ko.mapping.fromJS(e, {copy: ['_links']});
                        }
                    }


                });

            }

            /**
             * _links mapper
             *
             * instance._links.relation_name() returns the relation entity (full content will be loaded asynchronously)
             * instance.relation_name() returns the relation entity's url
             * instance.relation_name('http://server/new_url') relates another entity to the current instance
             *  instance.links will be updated automatically
             */
            if (data._links) {
                instance._links = {};
                instance._links.self = data._links.self || {href: null};

                $.each(data._links, function (i, e) {

                    if (i !== 'self' && undefined === data[i]
                        && (undefined === instance._embedded || undefined === instance._embedded[i])) {
                        var _value = ko.observable(null),
                            href, link;

                        // include the rel when serializing the model
                        mapping.include.push(i);

                        // this is the url to the related entity
                        href = computeds[i] = ko.computed({
                            read: function () {
                                if (_value() && typeof(_value()._links) == 'object' && _value()._links.self) {
                                    return _value()._links.self.href;
                                }
                                else {
                                    return null;
                                }
                            },
                            write: function (url) {

                                if (url === '') {
                                    _value(null);
                                    return;
                                }

                                // check if entity is already loaded
                                if (url && (!_value() || url !== _value()._links.self.href)) {
                                    $.ajax({
                                        url: url,
                                        dataType: 'json',
                                        type: 'GET',
                                        global: false,
                                        success: function (data) {
                                            link(data);
                                        },
                                        error: function () {
                                            link(null);
                                        }
                                    });
                                }
                            },
                            deferEvaluation: true

                        }).extend({rateLimit: 500});

                        // entity contents
                        link = instance._links[i] = ko.computed({
                            read: _value,
                            write: function (data) {
                                if (data) {

                                    if (defaults._links && typeof(defaults._links[i]) === 'function') {
                                        _value(new defaults._links[i](data));
                                    }
                                    else {
                                        _value(ko.mapping.fromJS(data, {copy: ['_links']}));
                                    }

                                    if (data._links && data._links.self) {
                                        href(data._links.self.href);
                                    }
                                    else {
                                        href(null);
                                    }

                                }
                                else {
                                    _value(null);
                                    href(null);
                                }
                            },
                            deferEvaluation: true
                        });

                        // load initial data
                        if (data._embedded && data._embedded[i]) {
                            link(data._embedded[i]);
                        }
                        else {
                            if (e) {
                                href(e.href);
                            }
                        }
                    }
                });
            }

            // http://knockoutjs.com/documentation/plugins-mapping.html
            ko.mapping.fromJS(data, mapping, instance);

            // computeds always override other fields
            $.extend(instance, computeds);


            // track changes
            instance._changes = ko.computed({
                read: function () {
                    var me = ko.toJS(this);

                    return $.map(data, function (val, key) {
                        if (key != '_links' && key != '_embedded' && val != me[key]) {
                            return key;
                        }
                    });
                }
            }, instance);

            // returns true when the model has changed
            instance._changed = ko.computed({
                read: function () {
                    return this._changes().length > 0;
                }
            }, instance);

            instance._reset = function () {
                $.each(data, function (i, e) {
                    if (ko.isObservable(instance[i])) {
                        instance[i](e);
                    }
                });
            };
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
         *
         * @param base_url
         * @param options
         * @returns {Function}
         */
        Model.bind = function (base_url, options) {


            if (typeof(base_url) === 'string') {
                // When using the bind() method, always set the Model option
                if (undefined === options) {
                    options = {model: Model};
                }
                else {
                    options.model = Model;
                }

                _datasource = new metaproject.DataSource(base_url, options);
            }
            else {
                // custom datasource implementation
                // { _id: fn(..), get: fn(..), post: fn(..), put: fn(..),
                // delete: fn(..) }
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

        Model.get = function (id, params, callback) {

            if (typeof(params) === 'function') {
                callback = params;
                params = {};
            }

            return Model.getDataSource().get(id, params, function (data) {
            	callback(new Model(data));
            });
        };

        Model.on = function (event, callback) {
            return Model.getDataSource().on(event, callback);
        };


        /**
         * Trigger a changed event on the underlying DataSource
         */
        Model.changed = function () {
            return Model.getDataSource().trigger('changed');
        };

        /**
         * Queries this model's datasource
         * Results are fetched when the returned observable is first bound
         *
         * @param params
         *            query parameters
         * @param transform
         *            optional transform function which receives the backend
         *            response and returns the observable value
         * @returns ko.observable The Query results
         */
        Model.query = function (params, transform) {
            params = params || {};

            var datasource = Model.getDataSource(),
                _search = ko.observable(params.search),
                _hash = ko.observable(null),
                _results = ko.observable([]),
                _query = {
                    page: ko.observable(),
                    size: ko.observable(),
                    sort: ko.observable()
                };

            delete params.search;

            $.each(params, function (i, e) {
                if (undefined === _query[i]) {
                    _query[i] = ko.observable(e).extend({rateLimit: 500});
                }
                else {
                    _query[i](e);
                }
            });

            var _loading = false;

            // an observable that retrieves its value when first bound
            // From http://www.knockmeout.net/2011/06/lazy-loading-observable-in-knockoutjs.html
            var result = ko.computed({
                read: function () {
                    var newhash = ko.toJSON(_query);

                    if (_hash() !== newhash) {

                        var url = _search() ? "/search/" + _search() : "",
                            params = ko.toJS(_query);

                        result.loading(true);
                        datasource.get(url, params, function (data) {
                            _hash(newhash);
                            if (typeof(transform) === 'function') {
                                _results($.map(transform.call(result, data), Model.create));
                            } else {
                                if (typeof(data.page) == "object" && undefined !== data.page.size) {

                                    if (undefined !== data._embedded) {
                                        _results($.map(
                                            data._embedded[Object.keys(data._embedded)[0]],
                                            Model.create));
                                        if (data.page !== undefined) {
                                            result.totalPages(data.page.totalPages);
                                            result.totalElements(data.page.totalElements);
                                            result.number(data.page.number);
                                        }
                                    }
                                    else {
                                        _results([]);
                                    }

                                }
                                else {
                                    _results($.map(data, Model.create));
                                }

                            }

                            result.loading(false);
                        });
                    }

                    // always return the current value
                    return _results();
                },
                write: _results,
                deferEvaluation: true  // do not evaluate immediately when created
            });

            result.totalElements = ko.observable(0);
            result.totalPages = ko.observable(0);
            result.number = ko.observable(0);

            result.loading = ko.observable(false);
            result.search = _search;
            result.params = _query;
            result.live = true;

            result.reload = function () {
                _hash(null);
            };

            result.filter = function (field, value) {
                if (undefined === _query[field]) {
                    _query[field] = ko.observable(value).extend({rateLimit: 500});
                    result.reload();
                }
                else {
                    _query[field](value);
                }
            };

            // Reload when datasource is updated
            datasource.on('changed', function () {
                if (result.live) {
                    result.reload();
                }
            });

            return result;

        };


        /**
         * Query this Model and publish results to channel
         *
         * @param channel
         *            The channel string
         * @param params
         *            The Query parameters
         * @see Model.query
         */
        Model.publish = function (channel, params) {
            return Model.query(params).publishOn(channel);
        };

        // For instantiated models
        Model.prototype.destroy = function (callback) {
            var data = this.toJS(),
                datasource = Model.getDataSource();

            return datasource.destroy(datasource._id(data), callback);
        };

        Model.prototype.save = function (callback) {
            var data = this.toJS(),
                datasource = Model.getDataSource(),
                id = datasource._id(data);

            if (id) {
                return datasource.put(id, data, callback);
            }
            else {
                return datasource.post(data, callback);
            }
        };

        Model.prototype.toJS = function () {
            return ko.mapping.toJS(this);
        };

        Model.prototype.toJSON = function () {
        	return ko.mapping.toJSON(this);
        };
        
        // POST this model data to an arbitrary url
        Model.prototype.post = function (url, callback) {
        	return $.ajax({
    			url: url,
    			type: 'POST',
                contentType: 'application/json',
    			dataType: 'json',
    			data: this.toJSON(),
    			success: callback,
    			complete: this.changed
    		});
        };
        
        return Model;

    };

    // custom bindings

    // like, startsLike, endsLike
    function likeHandler(pos) {

        function likeStr(str) {
            if (undefined === pos) {
                return '%' + str + '%';
            }
            else if ('start' === pos) {
                return str + '%';
            }
            else if ('end' === pos) {
                return '%' + str;
            }
            else {
                throw 'invalid position';
            }
        }

        return {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

                var strValue = ko.observable(),
                    originalValue = valueAccessor(),
                    bindings = allBindings();

                // bind the input to a computed observable
                var value = ko.computed({
                    read: strValue,
                    write: function (val) {
                        originalValue(likeStr(val));
                        strValue(val);
                    }
                });

                return ko.bindingHandlers.textInput.init(element, function () {
                    return value;
                }, allBindings, viewModel, bindingContext);
            },
            update: ko.bindingHandlers.textInput.update
        };
    }

    ko.bindingHandlers.like = likeHandler();

    ko.bindingHandlers.startsLike = likeHandler('start');

    ko.bindingHandlers.endsLike = likeHandler('end');

})(window, jQuery, ko);