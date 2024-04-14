const errorHandler = require('../utils/errorHandler')
const Category = require('../models/Category')
const Option = require('../models/Option')

module.exports.getAll = async function (req, res) {
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const category = await Category.findById(req.params.id)
        res.status(200).json(category)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {

        const category = await new Category({
            name: req.body.name,
            user: req.user.id,
            image: req.body.image
        }).save()

        res.status(201).json(category)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {

        const updated = {
            name: req.body.name,
            image: req.body.image
        }

        const category = await Category.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(category)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Category.deleteOne({_id: req.params.id});
        await Option.deleteMany({category: req.params.id});
        res.status(200).json({
            message: 'La categoría ha sido eliminada.'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}
