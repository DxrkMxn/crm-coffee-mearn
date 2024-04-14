const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchemaSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    sendDate: {
        type: Date,
        required: true
    },
    templateUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('EmailSchema', emailSchemaSchema);