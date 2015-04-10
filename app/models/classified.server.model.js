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
	name: {
		type: String,
		default: '',
		required: 'Please fill Classified name',
		trim: true
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