module.exports = app => {
    app.route('/statistics/purchases/:id')
        .get(app.middlewares.user.getUserFromHeader, app.api.statistic.coursePurchasesByDate)

}