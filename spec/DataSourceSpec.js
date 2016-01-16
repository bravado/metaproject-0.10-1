

describe("MockDataSource", DataSourceSpec(new MockDataSource()));


describe("metaproject.DataSource", function() {
    // data.php stores data on the http session
    var ds = new metaproject.DataSource('../lib/data.php');

    // data.php specific - reset session data
    ds.get('reset');

    return DataSourceSpec(ds).call(this);
});




function DataSourceSpec(datasource) {


    return function() {

        it('is an event emitter', function(done) {

            var count = 0, one = 0;

            datasource.on('test', function(param) {
                expect(param).toBe('test ' + count);

                if(count++ == 2) {
                    expect(one).toBe(1);
                    done();
                }
            });

            datasource.one('test', function() {
                one++;
            });


            datasource.trigger('test', 'test 0');
            datasource.trigger('test', 'test 1');
            datasource.trigger('test', 'test 2');

        });

        it('stores data', function(done) {
            datasource.post({ id: 'something', name: 'test 1' }, function(response) {
                expect(response.id).not.toBe(undefined);

                // test without id
                datasource.post({ name: 'test 2'}, function(response) {
                    expect(response.id).not.toBe(undefined);
                    expect(response.id).not.toBeNull();

                    datasource.post({ name: 'test 3'}, function(response) {
                        expect(response.id).not.toBe(undefined);
                        expect(response.id).not.toBeNull();
                        done();
                    });
                });



            })
        });

        it('lists stored data', function(done) {
            datasource.get(function(response) {
                expect(response.length).toBe(3);
                done();
            });
        });

        it('reads data', function(done) {
            datasource.get('something', function(data) {
                expect(data.name).toBe('test 1');

                datasource.get(1, function(data) {
                    expect(data.name).toBe('test 2');
                    done();
                });
            });
        });

        it('triggers an error when a record does not exist', function(done) {

            datasource.one('error', function(err) {
                expect(err.code).toBe(404);
                done();
            });

            datasource.get('notfound');
        });

        it('updates data', function(done) {
            datasource.put('something', { age: '34' }, function(response) {
                expect(response.id).toBe('something');

                datasource.get('something', function(response) {
                    expect(response.name).toBe('test 1');
                    expect(response.age).toBe('34');
                    done();
                })
            });
        });

        it('triggers an error when the updated record does not exist', function(done) {
            datasource.one('error', function(err) {
                expect(err.code).toBe(404);
                done();
            });

            datasource.put('notfound', { test: 'data' });
        });

        it('deletes data', function(done) {
            datasource.destroy('something', function() {
                datasource.get(function(response) {
                    expect(response.length).toBe(2);
                    done();
                });
            });
        });

        it('triggers an error when the deleted record does not exist', function(done) {
            datasource.one('error', function(err) {
                expect(err.code).toBe(404);
                done();
            });

            datasource.destroy('notfound');
        });
    }
}

