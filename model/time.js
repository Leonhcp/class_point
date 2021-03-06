module.exports = app => {
    const timeSchema = new app.db.mongoose.Schema({
        userId: Number,
        courseId: Number,
        createdAt: {
            type: Date,
            default: Date.now
        },
        endedAt: Date,
        });

    return app.db.mongoose.model('Time', timeSchema);
}