/*global alert: true, jQuery: true, ko: true */
(function (window, $, ko) {
    "use strict";

    var metaproject = window.metaproject || {};

    metaproject.DataSource = function (base_url, options) {
        var self = this,
            $self = $(this),
            _navs = [];

        options = $.extend({
            key: 'id',
            model: function (data) {
                $.extend(this, data);
            }
        }, options);

        // Events
        self.on = function () {
            $self.on.apply($self, arguments);
        };

        self._id = function (model_or_id) {
            if (typeof(model_or_id) === 'object') {
                return ko.utils.unwrapObservable(model_or_id[options.key]);
            }
            else {
                return model_or_id;
            }
        };

        self.create = function (data) {
            return new options.model(data);
        };

        self.save = function (model, callback) {
            var id = ko.utils.unwrapObservable(model[options.key]);
            if (id) {
                return self.put(id, ko.mapping.toJSON(model), callback);
            }
            else {
                return self.post(ko.mapping.toJSON(model), callback);
            }
        };

        // get(path || {model}, params);
        // get(path || {model}, params, callback);
        // get(path || {model}, callback);
        self.get = function (path, params, callback) {

            // get({model})
            if (typeof(path) !== 'string') {
                // TODO existe path[key] ?
                path = '/' + ko.utils.unwrapObservable(path[options.key]);
            }
            else if (path[0] !== '/') {
                path = '/' + path;
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
                            if (data instanceof Array) {
                                callback($.map(data, function (e, i) {
                                    return new options.model(e);
                                }));
                            }
                            else {
                                callback(new options.model(data));
                            }
                        }
                    }
                }
            );
        };

        self.post = function (data, callback) {
            return $.ajax({
                url: base_url,
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function (data) {
                    $self.trigger('changed', { action: 'post', data: data});
                    if (typeof(callback) === 'function') {
                        callback(data);
                    }
                },
                error: self.errorHandler
            });
        };

        self.put = function (id, data, callback) {
            return $.ajax({
                url: base_url + '/' + id,
                dataType: 'json',
                type: 'PUT',
                data: data,
                success: function (data) {
                    $self.trigger('changed', { action: 'put', data: data});
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
                    $self.trigger('changed', { action: 'destroy', data: data});
                    if (typeof(callback) === 'function') {
                        callback(data);
                    }
                },
                error: self.errorHandler
            });
        };

        // Editor for this DataSource
        self.Editor = function (callbacks) {
            var ds = self,
                editor = this;

            callbacks = $.extend({
                save: function () {
                    //ds.data.reload();
                }
            }, callbacks);

            editor.current = ko.observable(null);

            editor.create = function (values) {
                editor.current(ds.create(values));
            };

            editor.destroy = function () {

                self.destroy(editor.current());

                if (typeof(callbacks.destroy) === 'function') {
                    callbacks.destroy();
                }
            };

            editor.load = function (model) {
                self.get(model, editor.current);
            };

            editor.close = function () {
                editor.current(null);

                if (typeof(callbacks.close) === 'function') {
                    callbacks.close();
                }
            };

            editor.save = function () {
                return self.save(editor.current(), callbacks.save);
            };
        };


        // an observable that retrieves its value when first bound
        // From http://www.knockmeout.net/2011/06/lazy-loading-observable-in-knockoutjs.html
        self.Nav = function (filter) {

            var _value = ko.observable(), // current value
                _observables = [], // list of instantiated observables
                _hash = ko.observable(null);

            var result = ko.computed({
                read: function () {
                    var newhash = ko.toJSON(result.filter());
                    if (_hash() !== newhash) {
                        result.loading(true);
                        self.get('/', result.filter(), function (newData) {
                            _hash(newhash);
                            _value(newData);

                            // TODO generic trigger/on for objects
                            $.each(_observables, function (i, o) {
                                o.reload();
                            });
                            result.loading(false);
                        });
                    }

                    //always return the current value
                    return _value();
                },
                write: _value,
                deferEvaluation: true  //do not evaluate immediately when created
            });
            result.loading = ko.observable(false);
            result._live = true; // update this navigato

            result.filter = ko.observable(filter || {});
            result.filter.set = function (param, value) {
                result.filter()[param] = value;
                result.filter.valueHasMutated();
            };

            /**
             * Resets filter, leaving _* parameters unchanged
             * @param data
             */
            result.filter.reset = function (data, notify) {
                data = data || {};

                data._offset = 0;
                var filter = result.filter();

                _.keys(filter).forEach(function (key) {
                    if (key[0] !== '_') {
                        delete filter[key];
                    }
                });

                _.extend(filter, data);

                if (notify) {
                    result.filter.valueHasMutated();
                }
            };

            result.observable = function (params, transform) {
                var me = ko.observable(null);
                me.loading = ko.observable(false);
                me.reload = function () {
                    me.loading(true);
                    var x = _.filter(_.keys(result.filter()), function (value, index, list) {
                        return value[0] !== '_';
                    });
                    var local_params = _.extend(_.pick(result.filter(), x), params);

                    self.get('/', local_params, function (newData) {
                        if (typeof(transform) === 'function') {
                            me(transform(newData));
                        }
                        else {
                            me(newData);
                        }
                        me.loading(false);
                    });
                };


                _observables.push(me);

                return me;
            };

            result.reload = function () {
                _hash(null);
            };

            // Reload when datasource is updated
            self.on('changed', function () {
                if (result._live) {
                    result.reload();
                }
            });

            return result;
        };

    };

    metaproject.Model = function (defaults, mapping) {

        return function (data) {
            var instance = this;

            data = data || {};

            $.each(defaults, function (i, e) {
                if (typeof(e) === 'function') {
                    instance[i] = ko.computed({ read: e, deferEvaluation: true }, instance);
                }
                else {
                    if (undefined === data[i]) {
                        data[i] = defaults[i];
                    }
                }
            });

            // data = $.extend({}, defaults, data);

            ko.mapping.fromJS(data, mapping || {}, instance);

        };

    };

})(window, jQuery, ko);