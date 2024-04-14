const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { 
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean
    },
})

module.exports = mongoose.model('users', userSchema)
