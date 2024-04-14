const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date
    },
    order: {
        type: Number,
        required: true,
        unique: true
    },
    list: [
        {
            name: {
                type: String
            },
            quantity: {
                type: Number
            },
            cost: {
                type: Number
            }
        }
    ],
    client: {
        ref: 'clients',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    comment: {
        type: String
    },
    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('orders', orderSchema)
