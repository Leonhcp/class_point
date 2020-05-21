module.exports = app => {
    app.route('/courses/rating/:id')
        .post(app.middlewares.user.getUserFromHeader, app.api.rating.create)
        .get(app.api.rating.coursePurchasesByDate)

}