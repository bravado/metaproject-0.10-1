
function MockDataSource() {
    var self = this,
        seq = 1,
        _data = {};

    self._id = function (model_or_id) {
        if (typeof(model_or_id) == 'object') {
            return model_or_id.id;
        }
        else {
            return model_or_id;
        }
    };

    // get(callback) / get(params, callback) - fetch all
    // get(id, callback); - fetch one
    self.get = function (id, cb) {

        var params;

        switch (typeof(id)) {
            case 'function': // get(callback)
                cb = id;
                id = undefined;
                break;
            case 'object': // get(params, callback)
                params = id;
                id = undefined;
                break;
            default:
                // get(id, callback)
                break;
        }

        if(undefined === id) {
            // TODO support params
            typeof(cb) == 'function' && cb.call(self,
                Object.keys(_data).map(function(k) {
                    return _data[k];
                }));
        }
        else {
            if (_data.hasOwnProperty(id)) {
                typeof(cb) == 'function' && cb.call(self, _data[id])
            }
            else {
                self.trigger('error', { id: id, code: 404, message: 'Not found' });
            }
        }


    };

    self.post = function (data, cb) {
        // id check
        if (undefined !== data.id) {
            if (undefined !== data[data.id]) {
                throw "[post] ID already exists!";
            }
            else {
                if (typeof data.id === 'number' && isFinite(data.id) && data.id >= seq) {
                    seq = data.id + 1;
                }
            }
        }
        else {
            data.id = seq++;
        }

        // create data
        _data[data.id] = data;

        typeof(cb) == 'function' && cb.call(self, { id: data.id });
    };

    self.put = function (id, data, cb) {
        self.get(id, function(original_data) {
            for(k in data) {
                original_data[k] = data[k];
            }

            typeof(cb) == 'function' && cb.call(self, { id: original_data.id })
        });
    };

    self.destroy = function (id, cb) {
        if(_data.hasOwnProperty(id)) {
            delete _data[id];
            cb.call(self);
        }
        else {
            self.trigger('error', { code: 404, message: 'Resource not found'});
        }
    };

    self.reset = function () {
        seq = 1;
        _data = {};
    }
}

MockDataSource.prototype = new metaproject.EventEmitter();