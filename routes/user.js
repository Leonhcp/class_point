module.exports = app => {
  app.route('/profile')
    .get(app.middlewares.user.getUserFromHeader, app.api.user.get)

}