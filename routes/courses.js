module.exports = app => {
    app.route('/courses')
      .post(app.middlewares.user.getUserFromHeader, app.api.course.save)
  
  }