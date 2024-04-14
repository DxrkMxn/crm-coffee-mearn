const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')

const User = mongoose.model('users')
const keys = require('../config/keys')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'coffee_usc'
}

/**
 * Checking the user's token
 * @param passport
 */
module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).select('id')
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Token no coincide con un usuario válido.' });
                }
            } catch (error) {
                return done(error, false);
            }
        })
    )
}
