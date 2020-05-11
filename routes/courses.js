module.exports = app => {
  app.route('/courses')
    .post(app.middlewares.user.getUserFromHeader, app.api.course.save)
  app.route('/courses/get/:id')
    .get(app.middlewares.user.getUserFromHeader, app.api.course.getById)
  app.route('/date')
    .get(app.middlewares.user.getUserFromHeader, app.api.course.getByDate)
  app.route('/mostselled')
    .get(app.middlewares.user.getUserFromHeader, app.api.course.getMostSelled)
  app.route('/me')
    .get(app.middlewares.user.getUserFromHeader, app.api.course.getByUser)

}