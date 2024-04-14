require('dotenv').config();
const express = require('express')
const controller = require('../controllers/analytics')
const passport = require('passport');
const router = express.Router()

router.get('/overview', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: 'No autorizado.' });
    }
    controller.overview(req, res, next);
});
router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analytics)
router.get('/analytics/check', controller.checkService)

module.exports = router
