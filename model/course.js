module.exports = app => {
    const Course = app.db.bookshelf.model('Course', {
        tableName: 'courses',
        creator() {
            return this.belongsTo('User', 'creator_id')
        }
        
    });

    return Course;
};