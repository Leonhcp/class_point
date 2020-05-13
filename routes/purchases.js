module.exports = app => {
    app.route('/purchases')
        .post(app.middlewares.user.getUserFromHeader, app.api.purchase.create)
        .get(app.middlewares.user.getUserFromHeader, app.api.purchase.getByUser)
    app.route('/teste')
        .get(app.middlewares.user.getUserFromHeader, app.api.statistic.averageTime)

}