const express = require('express');
const passport = require("passport")
const router = express.Router();
const controller = require('../controllers/email');


router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)

router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.sendEmailToAll)

module.exports = router;
