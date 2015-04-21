'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	InstrumentType = mongoose.model('InstrumentType'),
	_ = require('lodash');

/**
 * Create a InstrumentType
 */
exports.create = function(req, res) {
	var instrumentType = new InstrumentType(req.body);
	instrumentType.user = req.user;

	instrumentType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumentType);
		}
	});
};

/**
 * Show the current InstrumentType
 */
exports.read = function(req, res) {
	res.jsonp(req.instrumentType);
};

exports.readList = function(req, res) {
	res.jsonp(req.instrumentTypes);
};

/**
 * Update a InstrumentType
 */
exports.update = function(req, res) {
	var instrumentType = req.instrumentType ;

	instrumentType = _.extend(instrumentType , req.body);

	instrumentType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumentType);
		}
	});
};

/**
 * Delete an InstrumentType
 */
exports.delete = function(req, res) {
	var instrumentType = req.instrumentType ;

	instrumentType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumentType);
		}
	});
};

/**
 * List of InstrumentTypes
 */
exports.list = function(req, res) {
	InstrumentType.find(req.param('family') ? {family : req.param('family')} : null).sort('-created').populate('user', 'displayName').exec(function(err, instrumentTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumentTypes);
		}
	});
};

/**
 * InstrumentType middleware
 */
exports.instrumentTypeByID = function(req, res, next, id) {
	InstrumentType.findById(id).populate('user', 'displayName').exec(function(err, instrumentType) {
		if (err) return next(err);
		if (! instrumentType) return next(new Error('Failed to load InstrumentType ' + id));
		req.instrumentType = instrumentType ;
		next();
	});
};

exports.listByFamilyId = function(req, res, next, familyId) {
	InstrumentType.find({family: familyId}).exec(function(err, instrumentTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.instrumentTypes = instrumentTypes;
			next();
		}
	});
};

/**
 * InstrumentType authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.instrumentType.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
