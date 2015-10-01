
function MockDataSource() {
    var self = this,
        seq = 1,
        _data = self._data = {};

    $.extend(this, new metaproject.EventEmitter());

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
            if(typeof(cb) == 'function') 
				cb.call(self, Object.keys(_data).map(function(k) {
                    return _data[k];
                }));
        }
        else {
            console.log('[MockDataSource] get ' + id);
            if (undefined !== _data[id]) {
                if(typeof(cb) == 'function') cb.call(self, _data[id]);
            }
            else {
                self.trigger('error', { id: id, code: 404, message: 'Not found' });
            }
        }


    };

    self.post = function (data, cb) {

        console.log('[MockDataSource] post');

        setTimeout(function() {

            // id check
            if (undefined !== data.id && null !== data.id) {
                if (undefined !== _data[data.id]) {
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
            self.trigger('changed', { action: 'post', data: data});
            typeof(cb) == 'function' && cb.call(self, { id: data.id });
        }, 1);

    };

    self.put = function (id, data, cb) {
        console.log('[MockDataSource] put ' + id);
        self.get(id, function(original_data) {
            for(k in data) {
                original_data[k] = data[k];
            }
            self.trigger('changed', { action: 'put', data: data});
            typeof(cb) == 'function' && cb.call(self, { id: original_data.id })
        });
    };

    self.destroy = function (id, cb) {
        console.log('[MockDataSource] destroy ' + id);

        setTimeout(function() {
            if(_data.hasOwnProperty(id)) {
                delete _data[id];
                self.trigger('changed', { action: 'destroy', data: id});
                cb.call(self);
            }
            else {
                self.trigger('error', { code: 404, message: 'Resource not found'});
            }
        },1);
    };

    self.reset = function () {
        seq = 1;
        _data = {};
    }
}
