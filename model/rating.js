module.exports = app => {
    const ratingSchema = new app.db.mongoose.Schema({
        userId: Number,
        courseId: Number,
        createdAt: {
            type: Date,
            default: Date.now
        },
        rate: Number
    });

    return app.db.mongoose.model('Rating', ratingSchema);
}