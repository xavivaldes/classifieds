'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var classifieds = require('../../app/controllers/classifieds.server.controller');
	var multiparty = require('connect-multiparty');

	var multipartyMiddleware = multiparty();

	// Classifieds Routes
	app.route('/classifieds')
		.get(classifieds.list)
		.post(users.requiresLogin, multipartyMiddleware, classifieds.create);

	app.route('/classifieds/:classifiedId/pic')
		.get(classifieds.readPic);

	app.route('/classifieds/:classifiedId')
		.get(classifieds.read)
		.put(users.requiresLogin, classifieds.hasAuthorization, classifieds.update)
		.delete(users.requiresLogin, classifieds.hasAuthorization, classifieds.delete);

	// Finish by binding the Classified middleware
	app.param('classifiedId', classifieds.classifiedByID);
};
