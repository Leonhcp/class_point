module.exports = app => {
	const create = async (req, res) => {
		try {
			let ratingFromReq = { ...req.body }
			let userId = req.user.id
			let courseId = req.params.id

			let rating = {
				userId: userId,
				courseId: courseId,
				rate: ratingFromReq.rate
			}
			if (rating.rate >= 1 && rating.rate <= 5 && !ratingFromReq.rate) {
				let ratingFromDB = await app.model.rating.where({ userId: userId, courseId: courseId })
				console.log(ratingFromDB)
				if (ratingFromDB < 1) {
					await app.model.rating.create(rating)
				} else {
					await app.model.rating.where({ userId: userId, courseId: courseId }).updateOne({ rate: ratingFromReq.rate })
				}
			} else {
				res.send('Avaliação inválida').status(400)
			}
			res.send().status(200)
		} catch (e) {
			res.send().status(500)
		}
	}

	const getRateByCourse = async (req, res) => {

		try {
			let courseId = req.params.id

			let query = await app.model.rating.where({ courseId: courseId })

			let rateSum = await app.model.rating.aggregate([{ $match: {} },
			{ $group: { _id: courseId, total: { $sum: '$rate' } } }]).sort({ field: 'total', test: -1 })


			for (i = 0; i < rateSum.length; i++) {
				if (rateSum[i]._id = courseId) {
					rateSum = rateSum[i].total
				}
			}

			query = query.length

			let finalRate = rateSum / query

			res.send(`${finalRate}`).status(200)

		} catch (e) {
			console.log(e)
			res.send().status(500)

		}
	}

	const bestRatedCourses = async (req, res) => {
		try {

			let final = []

			let rateSum = await app.model.rating.aggregate([{ $match: {} },
			{ $group: { _id: '$courseId', total: { $sum: '$rate' } } }]).sort({ total: -1 })

			for (i = 0; i < rateSum.length; i++) {
				let courseFromSQL = await app.model.course.forge().where({ id: rateSum[i]._id }).fetch()
				let manyRates = await app.model.rating.where({ courseId: rateSum[i]._id })

				courseFromSQL = courseFromSQL.toJSON()

				let courses = {
					name: courseFromSQL.title,
					id: courseFromSQL.id
				}

				manyRates = manyRates.length

				courses.rate = rateSum[i].total / manyRates

				final.push(courses)
			}

			res.send(final).status(200)

		} catch (e) {
			console.log(e)
			res.send().status(500)

		}

	}

	const worstRatedCourses = async (req, res) => {
		try {

			let final = []

			let rateSum = await app.model.rating.aggregate([{ $match: {} },
			{ $group: { _id: '$courseId', total: { $sum: '$rate' } } }]).sort({ total: 1 })

			for (i = 0; i < rateSum.length; i++) {
				let courseFromSQL = await app.model.course.forge().where({ id: rateSum[i]._id }).fetch()
				let manyRates = await app.model.rating.where({ courseId: rateSum[i]._id })

				courseFromSQL = courseFromSQL.toJSON()

				let courses = {
					name: courseFromSQL.title,
					id: courseFromSQL.id
				}

				manyRates = manyRates.length

				courses.rate = rateSum[i].total / manyRates

				final.push(courses)
			}

			res.send(final).status(200)

		} catch (e) {
			console.log(e)
			res.send().status(500)

		}

	}

	// retorno de datas semana/week , mês/month , ano/year

	coursePurchasesByDate = async (req, res) => {

		let courseId = req.params.id

		let data = []

		let label = []

		let date = new Date ()

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

						let purchaseFromDB = await app.model.purchase.where({'coursesId': courseId})
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

						let purchaseFromDB = await app.model.purchase.where({'coursesId': courseId})
						.gte('createdAt', datelast)
						.lt('createdAt', datefirst)

						console.log(purchaseFromDB)

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

						let purchaseFromDB = await app.model.purchase.where({'coursesId': courseId})
						.gte('createdAt', datelast)
						.lt('createdAt', datefirst)

						console.log(new Date(datefirst), new Date(datelast))

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


	return { create, getRateByCourse, bestRatedCourses, worstRatedCourses, coursePurchasesByDate }
}