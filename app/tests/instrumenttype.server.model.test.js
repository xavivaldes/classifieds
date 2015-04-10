'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Instrumenttype = mongoose.model('Instrumenttype');

/**
 * Globals
 */
var user, instrumenttype;

/**
 * Unit tests
 */
describe('Instrumenttype Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			instrumenttype = new Instrumenttype({
				name: 'Instrumenttype Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return instrumenttype.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			instrumenttype.name = '';

			return instrumenttype.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Instrumenttype.remove().exec();
		User.remove().exec();

		done();
	});
});