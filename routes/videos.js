module.exports = app => {
  app.route('/videos')
    .post(app.middlewares.user.getUserFromHeader, app.api.video.save)
  app.route('/course/videos/:id')//aqui vai o id de curso
    .get(app.middlewares.user.getUserFromHeader, app.api.video.getByCourse)
  app.route('/videos/:id')//e aqui o id de um video só
    .get(app.middlewares.user.getUserFromHeader, app.api.video.getById)
}