module.exports = app => {
    const Video = app.db.bookshelf.model('Video', {
        tableName: 'videos',
        course() {
            return this.belongsTo('Course', 'course_id')
        }
        
    });

    return Video;
};