const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    orders: [
        {
            ref: 'orders',
            type: Schema.Types.ObjectId
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Number,
        unique: true,
        required: true
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('clients', clientSchema)
