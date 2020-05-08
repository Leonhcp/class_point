module.exports = app => {
  app.route('/me')
    .get(app.middlewares.user.getUserFromHeader, app.api.user.get)

}