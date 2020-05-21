module.exports = app => {
    const Module = app.db.bookshelf.model('Module', {
        tableName: 'modules',
        course() {
            return this.belongsTo('Course', 'course_id')
        }
        
    });

    return Module;
};