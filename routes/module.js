module.exports = app => {
    app.route('/modules')
    .post(app.middlewares.user.getUserFromHeader, app.api.module.save)
}