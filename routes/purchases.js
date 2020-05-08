module.exports = app => {
    app.route('/purchases')
        .post(app.middlewares.user.getUserFromHeader, app.api.purchase.create)
    app.route('/purchases')
        .get(app.middlewares.user.getUserFromHeader, app.api.purchase.getByUser)

}