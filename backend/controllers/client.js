const Client = require('../models/Client')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')
const User = require("../models/User");

/**
 * Obtener todos los clientes
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.getAll = async function (req, res) {

    const query = {}

    if (req.query.start) {
        query.date = {
            $gte: req.query.start
        }
    }

    if (req.query.order) {
        query.order = +req.query.order
    }

    if (req.query.name) {
        query.name = req.query.name
    }

    try {

        const clients = await Client
            .find(query)
            .sort({date: -1})
            .skip(+req.query.offset)
            .limit(+req.query.limit)

        const user = clients.map(async client => {
            client.user = await User.findById(client.user)
        })

        const clientsOrders = clients.map(async client => {
            client.orders = await Order.find({'client': client._id})
        })

        await Promise.all(user)
        await Promise.all(clientsOrders)

        res.status(200).json(clients)

    } catch (e) {
        errorHandler(res, e)
    }
}

/**
 * Obtener cliente por ID
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.getById = async function (req, res) {
    try {
        const client = await Client.findById(req.params.id)

        const promise = client.orders.map(async (orderId, index) => {
            client.orders[index] = await Order.findById(orderId)
        })

        await Promise.all(promise)

        res.status(200).json(client)

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        const lastClient = await Client
            .findOne()
            .sort({date: -1})
        const maxClient = lastClient ? lastClient.order : 0

        const client = await new Client({
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            email: req.body.email,
            user: req.user._id,
            order: maxClient + 1
        }).save()

        res.status(201).json(client)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {

        const client = await Client.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )

        res.status(201).json(client)
    } catch (e) {
        errorHandler(res, e)
    }
}
