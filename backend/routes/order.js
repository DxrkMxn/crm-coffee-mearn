const express = require('express')
const passport = require("passport")
const router = express.Router()

const controller = require('../controllers/order')

router.get('/', passport.authenticate('jwt', { session: false }), controller.getAll)
router.get('/user/:id', passport.authenticate('jwt', { session: false }), controller.getUserOrders)
router.post('/', passport.authenticate('jwt', { session: false }), controller.create)
router.patch('/:id', passport.authenticate('jwt', { session: false }), controller.update);

module.exports = router
