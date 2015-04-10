'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Instrumenttype = mongoose.model('Instrumenttype'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, instrumenttype;

/**
 * Instrumenttype routes tests
 */
describe('Instrumenttype CRUD tests', function() {
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

		// Save a user to the test db and create new Instrumenttype
		user.save(function() {
			instrumenttype = {
				name: 'Instrumenttype Name'
			};

			done();
		});
	});

	it('should be able to save Instrumenttype instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrumenttype
				agent.post('/instrumenttypes')
					.send(instrumenttype)
					.expect(200)
					.end(function(instrumenttypeSaveErr, instrumenttypeSaveRes) {
						// Handle Instrumenttype save error
						if (instrumenttypeSaveErr) done(instrumenttypeSaveErr);

						// Get a list of Instrumenttypes
						agent.get('/instrumenttypes')
							.end(function(instrumenttypesGetErr, instrumenttypesGetRes) {
								// Handle Instrumenttype save error
								if (instrumenttypesGetErr) done(instrumenttypesGetErr);

								// Get Instrumenttypes list
								var instrumenttypes = instrumenttypesGetRes.body;

								// Set assertions
								(instrumenttypes[0].user._id).should.equal(userId);
								(instrumenttypes[0].name).should.match('Instrumenttype Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Instrumenttype instance if not logged in', function(done) {
		agent.post('/instrumenttypes')
			.send(instrumenttype)
			.expect(401)
			.end(function(instrumenttypeSaveErr, instrumenttypeSaveRes) {
				// Call the assertion callback
				done(instrumenttypeSaveErr);
			});
	});

	it('should not be able to save Instrumenttype instance if no name is provided', function(done) {
		// Invalidate name field
		instrumenttype.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrumenttype
				agent.post('/instrumenttypes')
					.send(instrumenttype)
					.expect(400)
					.end(function(instrumenttypeSaveErr, instrumenttypeSaveRes) {
						// Set message assertion
						(instrumenttypeSaveRes.body.message).should.match('Please fill Instrumenttype name');
						
						// Handle Instrumenttype save error
						done(instrumenttypeSaveErr);
					});
			});
	});

	it('should be able to update Instrumenttype instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrumenttype
				agent.post('/instrumenttypes')
					.send(instrumenttype)
					.expect(200)
					.end(function(instrumenttypeSaveErr, instrumenttypeSaveRes) {
						// Handle Instrumenttype save error
						if (instrumenttypeSaveErr) done(instrumenttypeSaveErr);

						// Update Instrumenttype name
						instrumenttype.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Instrumenttype
						agent.put('/instrumenttypes/' + instrumenttypeSaveRes.body._id)
							.send(instrumenttype)
							.expect(200)
							.end(function(instrumenttypeUpdateErr, instrumenttypeUpdateRes) {
								// Handle Instrumenttype update error
								if (instrumenttypeUpdateErr) done(instrumenttypeUpdateErr);

								// Set assertions
								(instrumenttypeUpdateRes.body._id).should.equal(instrumenttypeSaveRes.body._id);
								(instrumenttypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Instrumenttypes if not signed in', function(done) {
		// Create new Instrumenttype model instance
		var instrumenttypeObj = new Instrumenttype(instrumenttype);

		// Save the Instrumenttype
		instrumenttypeObj.save(function() {
			// Request Instrumenttypes
			request(app).get('/instrumenttypes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Instrumenttype if not signed in', function(done) {
		// Create new Instrumenttype model instance
		var instrumenttypeObj = new Instrumenttype(instrumenttype);

		// Save the Instrumenttype
		instrumenttypeObj.save(function() {
			request(app).get('/instrumenttypes/' + instrumenttypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', instrumenttype.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Instrumenttype instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrumenttype
				agent.post('/instrumenttypes')
					.send(instrumenttype)
					.expect(200)
					.end(function(instrumenttypeSaveErr, instrumenttypeSaveRes) {
						// Handle Instrumenttype save error
						if (instrumenttypeSaveErr) done(instrumenttypeSaveErr);

						// Delete existing Instrumenttype
						agent.delete('/instrumenttypes/' + instrumenttypeSaveRes.body._id)
							.send(instrumenttype)
							.expect(200)
							.end(function(instrumenttypeDeleteErr, instrumenttypeDeleteRes) {
								// Handle Instrumenttype error error
								if (instrumenttypeDeleteErr) done(instrumenttypeDeleteErr);

								// Set assertions
								(instrumenttypeDeleteRes.body._id).should.equal(instrumenttypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Instrumenttype instance if not signed in', function(done) {
		// Set Instrumenttype user 
		instrumenttype.user = user;

		// Create new Instrumenttype model instance
		var instrumenttypeObj = new Instrumenttype(instrumenttype);

		// Save the Instrumenttype
		instrumenttypeObj.save(function() {
			// Try deleting Instrumenttype
			request(app).delete('/instrumenttypes/' + instrumenttypeObj._id)
			.expect(401)
			.end(function(instrumenttypeDeleteErr, instrumenttypeDeleteRes) {
				// Set message assertion
				(instrumenttypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Instrumenttype error error
				done(instrumenttypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Instrumenttype.remove().exec();
		done();
	});
});