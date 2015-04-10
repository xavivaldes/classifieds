'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var instrumenttypes = require('../../app/controllers/instrumenttypes.server.controller');

	// Instrumenttypes Routes
	app.route('/instrumenttypes')
		.get(instrumenttypes.list)
		.post(users.requiresLogin, instrumenttypes.create);

	app.route('/instrumenttypes/:instrumenttypeId')
		.get(instrumenttypes.read)
		.put(users.requiresLogin, instrumenttypes.hasAuthorization, instrumenttypes.update)
		.delete(users.requiresLogin, instrumenttypes.hasAuthorization, instrumenttypes.delete);

	// Finish by binding the Instrumenttype middleware
	app.param('instrumenttypeId', instrumenttypes.instrumenttypeByID);
};
