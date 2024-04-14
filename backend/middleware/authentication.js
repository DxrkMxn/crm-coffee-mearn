const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const User = require("../models/User");
const keys = require("../config/keys");

const passportOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt,
};

passport.use(
    new JwtStrategy(passportOptions, async (payload, done) => {
        try {
            const user = await User.findById(payload.userId).select("email id");
            if (user) {
                done(null, user);
            } else {
                done(null, false, { message: "Token no coincide con un usuario válido." });
            }
        } catch (error) {
            done(error, false);
        }
    })
);

const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        jwt.verify(authHeader.split(" ")[1], keys.jwt, (err, payload) => {
            if (err) {
                return res.status(403).json({ message: "Acceso prohibido." });
            }
            req.user = payload;
            next();
        });
    } else {
        res.status(401).json({ message: "No autorizado." });
    }
};

module.exports = {
    isAuthenticated,
    initializePassport: passport.initialize(),
};
