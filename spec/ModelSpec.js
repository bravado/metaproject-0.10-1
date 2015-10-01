describe("metaproject.Model", function() {
    var datasource = window.datasource = new MockDataSource(), //new metaproject.DataSource("../lib/data.php"),
        Test = metaproject.Model({
            id: null,
            name: null,
            custom: 'default'
        }).bind(datasource);

	Test.on('error', function(e) { console.error(e); });
	
    it('creates new instances with the default parameters', function() {
        var test = new Test();

        expect(test.id()).toBe(null);
        expect(test.name()).toBe(null);
        expect(test.custom()).toBe('default');
    });

    it('creates new instances with custom parameters', function() {
        var test = new Test({ id: 3, custom: 'custom' });

        expect(test.id()).toBe(3);
        expect(test.custom()).toBe('custom');
    });

    // persistence specs

    var test_id = null;
    it('persists new entities to the datasource', function(done) {
        var test = new Test({ name: 'Testing' });

        test.save(function(response) {
            expect(response.id).toBe(1);
            test_id = response.id;
            done();
        });
    });

    var test_cache = null;
    it('retrieves entities', function(done) {
		var f = function(test) {
            expect(test.name()).toBe('Testing');
            test_cache = test;
            done();
        };
		
        Test.get(test_id, f);
    });

    it('updates entities', function(done) {
        test_cache.name('Update Testing');

        test_cache.save(function(response) {
            expect(response.id).toBe(test_id);
            Test.get(test_id, function(test) {
                expect(test.name()).toBe('Update Testing');
                done();
            });
        });
    });

    // create a new query (lists all Test objects)
    var query = Test.query();

    // retrieve data (queries are executed when first bound)
    query();

    it('queries entities', function() {
        var q = query();
        expect(q.length).toBe(1);
    });

    it('deletes entities', function(done) {
        datasource.one('error', function(err) {
            expect(err.code).toBe(404);
            done();
        });

        test_cache.destroy(function() {
            Test.get(test_id);
        });
    });


    it('updates queries when the datasource changes', function() {

        var q = query();
        expect(q.length).toBe(0);


    });
});