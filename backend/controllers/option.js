const Option = require('../models/Option')
const errorHandler = require('../utils/errorHandler')

module.exports.getByCategoryId = async function (req, res) {
    try {

        const options = await Option.find({
            category: req.params.categoryId
        })

        res.status(200).json(options)

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {

        const option = await new Option({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id
        }).save()

        res.status(201).json(option)

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {

        const option = await Option.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )

        res.status(200).json(option)

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res) {
    try {
        
        const response =  await Option.findOneAndDelete({
            _id: req.params.id
        })

        res.status(200).json(response)

    } catch (e) {
        errorHandler(res, e)
    }
}
