const passportJwt = require('passport-jwt')
const { ExtractJwt } = passportJwt
const { decode } = require('jwt-simple');

const params = {
    token: ExtractJwt.fromAuthHeaderAsBearerToken(),
    authSecret: process.env.LOCAL_AUTH_SECRET,
}

module.exports = app => {
    const getUserFromHeader = async (req, res, next) => {
        const token = params.token(req);
        try {
            const payload = decode(token, params.authSecret);
            console.log(payload)
            const userDB = await app.model.user.forge().where({ "id": payload.id }).fetch();
            req.user = userDB.toJSON();
            next();

        } catch (e) {
            console.log(e);
            res.send('Erro ao autenticar o usuário ou token expirado').status(400)

        }
    }

    return { getUserFromHeader }
}