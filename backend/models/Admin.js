const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    user:
        {
            ref: 'users',
            type: Schema.Types.ObjectId
        }
})

module.exports = mongoose.model('admins', adminSchema)
