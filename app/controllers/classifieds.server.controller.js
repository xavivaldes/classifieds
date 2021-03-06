'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Classified = mongoose.model('Classified'),
	_ = require('lodash'),
	fs = require('fs');

/**
 * Create a Classified
 */
exports.create = function (req, res) {
	var classified = new Classified(req.body);

	classified.user = req.user;

	classified.save(function (err) {
		if (err) {
			console.log(errorHandler.getErrorMessage(err));
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(classified);
		}
	});
};

/**
 * Show the current Classified
 */
exports.read = function (req, res) {
	res.jsonp(req.classified);
};

exports.readPic = function (req, res) {
	res.contentType('image/png');
	var buf = new Buffer(req.classified.pics.toString().split(';base64,')[1], 'base64');
	res.send(buf);
};

/**
 * Update a Classified
 */
exports.update = function (req, res) {
	var classified = req.classified;
	classified = _.extend(classified, req.body);

	classified.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(classified);
		}
	});
};

/**
 * Delete an Classified
 */
exports.delete = function (req, res) {
	var classified = req.classified;

	classified.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(classified);
		}
	});
};

/**
 * List of Classifieds
 */
exports.list = function (req, res) {
	var filter = req.query;

	if (filter) {
		if (filter.description && filter.description != '') filter.shortDescription = {$regex: new RegExp(filter.description)};
		delete filter.description;
		if (filter.minprice || filter.maxprice) {
			var priceFilter = {};
			if (filter.minprice) {
				priceFilter.$gte = filter.minprice;
				delete filter.minprice;
			}
			if (filter.maxprice) {
				priceFilter.$lte = filter.maxprice;
				delete filter.maxprice;
			}
			filter.price = priceFilter;
		}
	}
	console.log(filter);
	Classified.find(filter).sort('-created').populate('user', 'displayName').exec(function (err, classifieds) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				for (var i in classifieds) {
					classifieds[i].pics = [];
				}
				res.jsonp(classifieds);
			}
		});
};

/**
 * Classified middleware
 */
exports.classifiedByID = function (req, res, next, id) {
	Classified.findById(id).populate('user', 'displayName').populate('category', 'name').populate('instrumentType', 'name')
		.populate('family', 'name').exec(function (err, classified) {
		if (err) return next(err);
		if (!classified) return next(new Error('Failed to load Classified ' + id));
		req.classified = classified;
		next();
	});
};

/**
 * Classified authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
	if (req.classified.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
