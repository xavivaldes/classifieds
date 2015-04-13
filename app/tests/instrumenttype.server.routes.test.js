'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	InstrumentType = mongoose.model('InstrumentType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, instrumentType;

/**
 * InstrumentType routes tests
 */
describe('InstrumentType CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new InstrumentType
		user.save(function() {
			instrumentType = {
				name: 'InstrumentType Name'
			};

			done();
		});
	});

	it('should be able to save InstrumentType instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new InstrumentType
				agent.post('/instrumentTypes')
					.send(instrumentType)
					.expect(200)
					.end(function(instrumentTypeSaveErr, instrumentTypeSaveRes) {
						// Handle InstrumentType save error
						if (instrumentTypeSaveErr) done(instrumentTypeSaveErr);

						// Get a list of InstrumentTypes
						agent.get('/instrumentTypes')
							.end(function(instrumentTypesGetErr, instrumentTypesGetRes) {
								// Handle InstrumentType save error
								if (instrumentTypesGetErr) done(instrumentTypesGetErr);

								// Get InstrumentTypes list
								var instrumentTypes = instrumentTypesGetRes.body;

								// Set assertions
								(instrumentTypes[0].user._id).should.equal(userId);
								(instrumentTypes[0].name).should.match('InstrumentType Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save InstrumentType instance if not logged in', function(done) {
		agent.post('/instrumentTypes')
			.send(instrumentType)
			.expect(401)
			.end(function(instrumentTypeSaveErr, instrumentTypeSaveRes) {
				// Call the assertion callback
				done(instrumentTypeSaveErr);
			});
	});

	it('should not be able to save InstrumentType instance if no name is provided', function(done) {
		// Invalidate name field
		instrumentType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new InstrumentType
				agent.post('/instrumentTypes')
					.send(instrumentType)
					.expect(400)
					.end(function(instrumentTypeSaveErr, instrumentTypeSaveRes) {
						// Set message assertion
						(instrumentTypeSaveRes.body.message).should.match('Please fill InstrumentType name');

						// Handle InstrumentType save error
						done(instrumentTypeSaveErr);
					});
			});
	});

	it('should be able to update InstrumentType instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new InstrumentType
				agent.post('/instrumentTypes')
					.send(instrumentType)
					.expect(200)
					.end(function(instrumentTypeSaveErr, instrumentTypeSaveRes) {
						// Handle InstrumentType save error
						if (instrumentTypeSaveErr) done(instrumentTypeSaveErr);

						// Update InstrumentType name
						instrumentType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing InstrumentType
						agent.put('/instrumentTypes/' + instrumentTypeSaveRes.body._id)
							.send(instrumentType)
							.expect(200)
							.end(function(instrumentTypeUpdateErr, instrumentTypeUpdateRes) {
								// Handle InstrumentType update error
								if (instrumentTypeUpdateErr) done(instrumentTypeUpdateErr);

								// Set assertions
								(instrumentTypeUpdateRes.body._id).should.equal(instrumentTypeSaveRes.body._id);
								(instrumentTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of InstrumentTypes if not signed in', function(done) {
		// Create new InstrumentType model instance
		var instrumentTypeObj = new InstrumentType(instrumentType);

		// Save the InstrumentType
		instrumentTypeObj.save(function() {
			// Request InstrumentTypes
			request(app).get('/instrumentTypes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single InstrumentType if not signed in', function(done) {
		// Create new InstrumentType model instance
		var instrumentTypeObj = new InstrumentType(instrumentType);

		// Save the InstrumentType
		instrumentTypeObj.save(function() {
			request(app).get('/instrumentTypes/' + instrumentTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', instrumentType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete InstrumentType instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new InstrumentType
				agent.post('/instrumentTypes')
					.send(instrumentType)
					.expect(200)
					.end(function(instrumentTypeSaveErr, instrumentTypeSaveRes) {
						// Handle InstrumentType save error
						if (instrumentTypeSaveErr) done(instrumentTypeSaveErr);

						// Delete existing InstrumentType
						agent.delete('/instrumentTypes/' + instrumentTypeSaveRes.body._id)
							.send(instrumentType)
							.expect(200)
							.end(function(instrumentTypeDeleteErr, instrumentTypeDeleteRes) {
								// Handle InstrumentType error error
								if (instrumentTypeDeleteErr) done(instrumentTypeDeleteErr);

								// Set assertions
								(instrumentTypeDeleteRes.body._id).should.equal(instrumentTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete InstrumentType instance if not signed in', function(done) {
		// Set InstrumentType user
		instrumentType.user = user;

		// Create new InstrumentType model instance
		var instrumentTypeObj = new InstrumentType(instrumentType);

		// Save the InstrumentType
		instrumentTypeObj.save(function() {
			// Try deleting InstrumentType
			request(app).delete('/instrumentTypes/' + instrumentTypeObj._id)
			.expect(401)
			.end(function(instrumentTypeDeleteErr, instrumentTypeDeleteRes) {
				// Set message assertion
				(instrumentTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle InstrumentType error error
				done(instrumentTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		InstrumentType.remove().exec();
		done();
	});
});
