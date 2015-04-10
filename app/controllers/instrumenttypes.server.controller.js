'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Instrumenttype = mongoose.model('Instrumenttype'),
	_ = require('lodash');

/**
 * Create a Instrumenttype
 */
exports.create = function(req, res) {
	var instrumenttype = new Instrumenttype(req.body);
	instrumenttype.user = req.user;

	instrumenttype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumenttype);
		}
	});
};

/**
 * Show the current Instrumenttype
 */
exports.read = function(req, res) {
	res.jsonp(req.instrumenttype);
};

/**
 * Update a Instrumenttype
 */
exports.update = function(req, res) {
	var instrumenttype = req.instrumenttype ;

	instrumenttype = _.extend(instrumenttype , req.body);

	instrumenttype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumenttype);
		}
	});
};

/**
 * Delete an Instrumenttype
 */
exports.delete = function(req, res) {
	var instrumenttype = req.instrumenttype ;

	instrumenttype.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumenttype);
		}
	});
};

/**
 * List of Instrumenttypes
 */
exports.list = function(req, res) { 
	Instrumenttype.find().sort('-created').populate('user', 'displayName').exec(function(err, instrumenttypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumenttypes);
		}
	});
};

/**
 * Instrumenttype middleware
 */
exports.instrumenttypeByID = function(req, res, next, id) { 
	Instrumenttype.findById(id).populate('user', 'displayName').exec(function(err, instrumenttype) {
		if (err) return next(err);
		if (! instrumenttype) return next(new Error('Failed to load Instrumenttype ' + id));
		req.instrumenttype = instrumenttype ;
		next();
	});
};

/**
 * Instrumenttype authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.instrumenttype.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
