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
        required: 'Pon una descripción corta',
        trim: true
    },
    longDescription: {
        type: String,
        default: '',
        required: 'Pon una descripción',
        trim: true
    },
    price: {
        type: Number,
        required: 'Indica un precio'
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category',
        required: 'Escoje una categoría'
    },
    family: {
        type: Schema.ObjectId,
        ref: 'Family',
        required: 'Escoje una familia',
    },
    instrumentType: {
        type: Schema.ObjectId,
        ref: 'InstrumentType',
        required: 'Escoje un tipo de instrumento'
    },
    pic: {
        data: {
            Type: String
        },
        contentType: {
            Type: String
        }
    },
    views: {
        type: Number,
        default: 0
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
