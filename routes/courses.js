module.exports = app => {
  app.route('/courses')
    .post(app.middlewares.user.getUserFromHeader, app.api.course.save)
  app.route('/courses/:id')
    .get(app.middlewares.user.getUserFromHeader, app.api.course.getById)
  app.route('/date')
    .get(app.middlewares.user.getUserFromHeader, app.api.course.getByDate)

}