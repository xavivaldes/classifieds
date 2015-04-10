'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var classifieds = require('../../app/controllers/classifieds.server.controller');

	// Classifieds Routes
	app.route('/classifieds')
		.get(classifieds.list)
		.post(users.requiresLogin, classifieds.create);

	app.route('/classifieds/:classifiedId')
		.get(classifieds.read)
		.put(users.requiresLogin, classifieds.hasAuthorization, classifieds.update)
		.delete(users.requiresLogin, classifieds.hasAuthorization, classifieds.delete);

	// Finish by binding the Classified middleware
	app.param('classifiedId', classifieds.classifiedByID);
};
