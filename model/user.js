module.exports = app => {
    const User = app.db.bookshelf.model('User', {
        tableName: 'users'
    });

    return User;
};