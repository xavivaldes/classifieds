'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Subcategory Schema
 */
var SubcategorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Subcategory name',
		trim: true
	},
	category: {
		type: Schema.ObjectId,
		ref: 'Category'
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

mongoose.model('Subcategory', SubcategorySchema);
