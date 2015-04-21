'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var instrumentTypes = require('../../app/controllers/instrumentTypes.server.controller');

	// InstrumentTypes Routes
	app.route('/instrumentTypes')
		.get(instrumentTypes.list)
		.post(users.requiresLogin, instrumentTypes.create);

	app.route('/instrumentTypes/family/:familyId')
		.get(instrumentTypes.readList);

	app.param('familyId', instrumentTypes.listByFamilyId);

	app.route('/instrumentTypes/:instrumentTypeId')
		.get(instrumentTypes.read)
		.put(users.requiresLogin, instrumentTypes.hasAuthorization, instrumentTypes.update)
		.delete(users.requiresLogin, instrumentTypes.hasAuthorization, instrumentTypes.delete);

	// Finish by binding the InstrumentType middleware
	app.param('instrumentTypeId', instrumentTypes.instrumentTypeByID);
};
