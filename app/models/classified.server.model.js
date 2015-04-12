'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Classified Schema
 */
var ClassifiedSchema = new Schema({
	shortDescription: {
		type: String,
		default: '',
		required: 'Please fill Classified name',
		trim: true
	},
    longDescription: {
		type: String,
		default: '',
		trim: true
	},
    price: {
		type: Number,
		required: 'Please fill Classified name'
	},
    subcategory: {
		type: Schema.ObjectId,
		ref: 'Subcategory'
	},
    family: {
		type: Schema.ObjectId,
		ref: 'Family'
	},
    instrumentType: {
		type: Schema.ObjectId,
		ref: 'Instrumenttype'
	},
    views: {
		type: Number,
		required: 'Please fill Classified name'
	},
    lastUpdate: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Classified', ClassifiedSchema);
