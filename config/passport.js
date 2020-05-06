const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy: LocalStrategy, ExtractJwt } = passportJwt;


module.exports = app => {

    const authParams = {
        secretOrKey: process.env.LOCAL_AUTH_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const localStrategy = new LocalStrategy(authParams, (payload, done) => {
        app.db.knex('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false))
            .catch(err => done(err, false))
    });

    passport.use(localStrategy);

    return { authenticate: () => passport.authenticate('jwt', { session: false }) }
}
