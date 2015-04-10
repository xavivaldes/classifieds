'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Family = mongoose.model('Family'),
	_ = require('lodash');

/**
 * Create a Family
 */
exports.create = function(req, res) {
	var family = new Family(req.body);
	family.user = req.user;

	family.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(family);
		}
	});
};

/**
 * Show the current Family
 */
exports.read = function(req, res) {
	res.jsonp(req.family);
};

/**
 * Update a Family
 */
exports.update = function(req, res) {
	var family = req.family ;

	family = _.extend(family , req.body);

	family.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(family);
		}
	});
};

/**
 * Delete an Family
 */
exports.delete = function(req, res) {
	var family = req.family ;

	family.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(family);
		}
	});
};

/**
 * List of Families
 */
exports.list = function(req, res) { 
	Family.find().sort('-created').populate('user', 'displayName').exec(function(err, families) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(families);
		}
	});
};

/**
 * Family middleware
 */
exports.familyByID = function(req, res, next, id) { 
	Family.findById(id).populate('user', 'displayName').exec(function(err, family) {
		if (err) return next(err);
		if (! family) return next(new Error('Failed to load Family ' + id));
		req.family = family ;
		next();
	});
};

/**
 * Family authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.family.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
