'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Classified = mongoose.model('Classified'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, classified;

/**
 * Classified routes tests
 */
describe('Classified CRUD tests', function() {
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

		// Save a user to the test db and create new Classified
		user.save(function() {
			classified = {
				name: 'Classified Name'
			};

			done();
		});
	});

	it('should be able to save Classified instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Classified
				agent.post('/classifieds')
					.send(classified)
					.expect(200)
					.end(function(classifiedSaveErr, classifiedSaveRes) {
						// Handle Classified save error
						if (classifiedSaveErr) done(classifiedSaveErr);

						// Get a list of Classifieds
						agent.get('/classifieds')
							.end(function(classifiedsGetErr, classifiedsGetRes) {
								// Handle Classified save error
								if (classifiedsGetErr) done(classifiedsGetErr);

								// Get Classifieds list
								var classifieds = classifiedsGetRes.body;

								// Set assertions
								(classifieds[0].user._id).should.equal(userId);
								(classifieds[0].name).should.match('Classified Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Classified instance if not logged in', function(done) {
		agent.post('/classifieds')
			.send(classified)
			.expect(401)
			.end(function(classifiedSaveErr, classifiedSaveRes) {
				// Call the assertion callback
				done(classifiedSaveErr);
			});
	});

	it('should not be able to save Classified instance if no name is provided', function(done) {
		// Invalidate name field
		classified.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Classified
				agent.post('/classifieds')
					.send(classified)
					.expect(400)
					.end(function(classifiedSaveErr, classifiedSaveRes) {
						// Set message assertion
						(classifiedSaveRes.body.message).should.match('Please fill Classified name');
						
						// Handle Classified save error
						done(classifiedSaveErr);
					});
			});
	});

	it('should be able to update Classified instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Classified
				agent.post('/classifieds')
					.send(classified)
					.expect(200)
					.end(function(classifiedSaveErr, classifiedSaveRes) {
						// Handle Classified save error
						if (classifiedSaveErr) done(classifiedSaveErr);

						// Update Classified name
						classified.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Classified
						agent.put('/classifieds/' + classifiedSaveRes.body._id)
							.send(classified)
							.expect(200)
							.end(function(classifiedUpdateErr, classifiedUpdateRes) {
								// Handle Classified update error
								if (classifiedUpdateErr) done(classifiedUpdateErr);

								// Set assertions
								(classifiedUpdateRes.body._id).should.equal(classifiedSaveRes.body._id);
								(classifiedUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Classifieds if not signed in', function(done) {
		// Create new Classified model instance
		var classifiedObj = new Classified(classified);

		// Save the Classified
		classifiedObj.save(function() {
			// Request Classifieds
			request(app).get('/classifieds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Classified if not signed in', function(done) {
		// Create new Classified model instance
		var classifiedObj = new Classified(classified);

		// Save the Classified
		classifiedObj.save(function() {
			request(app).get('/classifieds/' + classifiedObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', classified.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Classified instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Classified
				agent.post('/classifieds')
					.send(classified)
					.expect(200)
					.end(function(classifiedSaveErr, classifiedSaveRes) {
						// Handle Classified save error
						if (classifiedSaveErr) done(classifiedSaveErr);

						// Delete existing Classified
						agent.delete('/classifieds/' + classifiedSaveRes.body._id)
							.send(classified)
							.expect(200)
							.end(function(classifiedDeleteErr, classifiedDeleteRes) {
								// Handle Classified error error
								if (classifiedDeleteErr) done(classifiedDeleteErr);

								// Set assertions
								(classifiedDeleteRes.body._id).should.equal(classifiedSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Classified instance if not signed in', function(done) {
		// Set Classified user 
		classified.user = user;

		// Create new Classified model instance
		var classifiedObj = new Classified(classified);

		// Save the Classified
		classifiedObj.save(function() {
			// Try deleting Classified
			request(app).delete('/classifieds/' + classifiedObj._id)
			.expect(401)
			.end(function(classifiedDeleteErr, classifiedDeleteRes) {
				// Set message assertion
				(classifiedDeleteRes.body.message).should.match('User is not logged in');

				// Handle Classified error error
				done(classifiedDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Classified.remove().exec();
		done();
	});
});