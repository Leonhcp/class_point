module.exports = app => {
    const getUsersWhoAccess = async (req, res) => {
        try {
            let id = req.param.id
            try {
                let final = []
                let courseFromMongoDB = await app.model.time
                    .where({ 'courseId': id })
                    .distinct('userId')

                for (i = 0; i < courseFromMongoDB.length; i++) {
                    let user = await app.db.knex('users').where({ 'id': courseFromMongoDB[i] }).select('id', 'name')
                    final.push(user[0])
                }

                res.send(final).status(200)
            } catch (e) {
                res.send().status(500)
            }
        } catch (e) {
            console.log(e)
            res.send().status(500)
        }
    }

    const numberOfQuery = async (req, res) => {
        try {
            let courseFromMongoDB = await app.model.time.distinct('courseId')
            let final = [courseFromMongoDB.length]
            res.send(final).status(200)
        } catch (msg) {
            console.log(msg);
            return res.status(500).send(msg)
        }
    }


    const averagePurchase = async (req, res) => {
        try {
            let many = await app.model.purchase.find()

            many = many.length

            let averagePrice = await app.model.purchase.aggregate([{ $match: {} },
            { $group: { _id: null, total: { $sum: '$price' } } }])

            averagePrice = `Preço médio de compra é: R$${averagePrice[0].total / many}`

            res.send(averagePrice).status(200)
        } catch (msg) {
            console.log(msg);
            return res.status(500).send(msg)
        }
    }

    const averageTime = async (req, res) => {
        try {
            let many = await app.model.time.find()

            many = many.length

            let averageTime = await app.model.time.aggregate([
                {
                    $project: { total: { $subtract: ['$endedAt', '$createdAt'] } }
                }
            ])
            
            let finalTime = [averageTime.reduce((acc, cur) => {
                acc.total += cur.total;
                if (acc < 0) { return 0 }
                else { return acc }
            })];

            finalTime = Math.ceil(finalTime[0].total / (60000 * many))

            res.send(`O tempo médio de acesso aos cursos é ${finalTime} minutos`).status(200)
        } catch (msg) {
            console.log(msg);
            return res.status(500).send(msg)
        }
    }

    const laestRated = async (req, res) => {
        try {
            let many = await app.model.purchase.find()

            many = many.length

            let averagePrice = await app.model.purchase.aggregate([{ $match: {} },
            { $group: { _id: null, total: { $sum: '$price' } } }])

            averagePrice = `Preço médio de compra é: R$${averagePrice[0].total / many}`

            res.send(averagePrice).status(200)
        } catch (msg) {
            console.log(msg);
            return res.status(500).send(msg)
        }
    }

    return { getUsersWhoAccess, numberOfQuery, averagePurchase, averageTime }
}