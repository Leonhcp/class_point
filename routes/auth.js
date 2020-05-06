module.exports = app => {   
    app.post('/signup', app.api.auth.signup)
    app.post('/signin', app.api.auth.signin)
}