module.exports = app => {
    const Content = app.db.bookshelf.model('Content', {
        tableName: 'contents',
        module() {
            return this.belongsTo('Module', 'module_id')
        }
        
    });

    return Content;
};