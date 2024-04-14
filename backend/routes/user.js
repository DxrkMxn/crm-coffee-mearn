const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');

require('../middleware/passport')(passport);

router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    userController.updateProfile
);
router.delete('/:id', userController.deleteUser);

module.exports = router;