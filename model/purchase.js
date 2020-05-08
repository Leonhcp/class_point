module.exports = app => {
    const purchaseSchema = new app.db.mongoose.Schema({
        userId: Number,
        coursesId: [Number],
        createdAt: {
            type: Date,
            default: Date.now
        },
        price: Number,
        status: String,
        invoice: String
    });

    return app.db.mongoose.model('Purchase', purchaseSchema);
}