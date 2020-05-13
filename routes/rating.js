module.exports = app => {
    app.route('/courses/rating')
        .post(app.middlewares.user.getUserFromHeader, app.api.rating.create)
        .get(app.middlewares.user.getUserFromHeader, app.api.rating.worstRatedCourses)

}