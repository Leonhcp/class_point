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

	const coursePurchasesByDate = async (req, res) => {

		let courseId = req.params.id

		let data = []

		let label = []

		let date = new Date()

		let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

		try {
			switch (req.query.period) {

				case "today":
					datefirst = date.setDate(date.getDate() - 1)

					let purchaseFromDB = await app.model.purchase.find({
						'coursesId': courseId,
						"createdAt": {
							"$gte": date
						}
					})
					res.send(`Purchases in 24h: ${purchaseFromDB.length}`).status(200)
					break;

				case "week":

					for (i = 1; i < 8; i++) {
						datefirst = date - (86400000 * i)
						datelast = date - (86400000 * (i + 1))

						let purchaseFromDB = await app.model.purchase.where({ 'coursesId': courseId })
							.gte('createdAt', datelast)
							.lt('createdAt', datefirst)

						if (purchaseFromDB === [] || purchaseFromDB < 1) {
							purchaseFromDB = 0
						} else {
							purchaseFromDB = purchaseFromDB.length
						}

						data.push(purchaseFromDB)
						label.push(datefirst.getDate())
					}
					break;

				case "month":

					for (i = 0; i < 30; i++) {
						datefirst = date - (86400000 * i)
						datelast = date - (86400000 * (i + 1))

						let purchaseFromDB = await app.model.purchase.where({ 'coursesId': courseId })
							.gte('createdAt', datelast)
							.lt('createdAt', datefirst)

						if (purchaseFromDB === [] || purchaseFromDB < 1) {
							purchaseFromDB = 0
						} else {
							purchaseFromDB = purchaseFromDB.length
						}

						data.push(purchaseFromDB)
						label.push(new Date(datefirst).getDate())
					}

					break;

				case "year":

					for (i = 0; i < 12; i++) {
						datefirst = date - (2592000000 * i)
						datelast = date - (2592000000 * (i + 1))

						let purchaseFromDB = await app.model.purchase.where({ 'coursesId': courseId })
							.gte('createdAt', datelast)
							.lt('createdAt', datefirst)

						if (purchaseFromDB === [] || purchaseFromDB < 1) {
							purchaseFromDB = 0
						} else {
							purchaseFromDB = purchaseFromDB.length
						}

						data.push(purchaseFromDB)
						label.push(months[new Date(datefirst).getMonth()])
					}

					break;

				default: res.send('Entrada inválida de período').status(400)

			}
			let finalArray = [label.reverse(), data.reverse()]
			res.send(finalArray).status(200)

		} catch (e) {
			console.log(e)
			res.send().status(500)
		}
	}

	return { getUsersWhoAccess, numberOfQuery, averagePurchase, averageTime, coursePurchasesByDate }
}