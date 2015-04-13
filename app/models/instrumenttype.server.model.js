'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * InstrumentType Schema
 */
var InstrumentTypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill InstrumentType name',
		trim: true
	},
	family: {
		type: Schema.ObjectId,
		ref: 'Family'
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

mongoose.model('InstrumentType', InstrumentTypeSchema);
