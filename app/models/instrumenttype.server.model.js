'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Instrumenttype Schema
 */
var InstrumenttypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Instrumenttype name',
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

mongoose.model('Instrumenttype', InstrumenttypeSchema);