'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	InstrumentType = mongoose.model('InstrumentType');

/**
 * Globals
 */
var user, instrumentType;

/**
 * Unit tests
 */
describe('InstrumentType Model Unit Tests:', function() {
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
			instrumentType = new InstrumentType({
				name: 'InstrumentType Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return instrumentType.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) {
			instrumentType.name = '';

			return instrumentType.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		InstrumentType.remove().exec();
		User.remove().exec();

		done();
	});
});
