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

	const compressArray = (original) => {

		let compressed = [];
		let copy = original.slice(0);

		for (i = 0; i < original.length; i++) {

			let myCount = 0;

			for ( w = 0; w < copy.length; w++) {
				if (original[i] === copy[w]) {
					myCount++;
					delete copy[w];
				}
			}

			if (myCount > 0) {
				const a = new Object();
				a.y = myCount;
				a.label = original[i];
				compressed.push(a);
			}
		}

		return compressed;
	};

	coursePurchasesByDate = async (req, res) => {

		let courseId = req.params.id

		let period

		try {
			switch (req.query.period) {
				case "today":
					period = 86400000
					break;
				case "week":
					period = 604800000
					break;
				case "month":
					period = 2629746000
					break;
				case "year":
					period = 31556952000
					break;
				default: res.send('Entrada inválida de período').status(400)

			}

			let date = new Date - period

			let purchaseFromDB = await app.model.purchase.find({ 
				'coursesId': courseId, 
				"createdAt": { 
						"$gte": date
				}
		})

		let finalArray = []

		switch (period) {
			case 86400000:
				res.send(`Purchases today: ${purchaseFromDB.length}`).status(200)
				break;
			case 604800000:
				for(i=0; i<purchaseFromDB.length; i++){
					index = purchaseFromDB[i].createdAt.getDate()
					finalArray.push(index)
				}
				break;
			case 2629746000:
				for(i=0; i<purchaseFromDB.length; i++){
					index = purchaseFromDB[i].createdAt.getMonth() + 1
					finalArray.push(index)
				}
				break;
			case 31556952000:
				for(i=0; i<purchaseFromDB.length; i++){
					index = purchaseFromDB[i].createdAt.getFullYear()
					finalArray.push(index)
				}
				break;
			default: res.send('Entrada inválida de período').status(400)
		}
			console.log(finalArray)
			res.send(compressArray(finalArray)).status(200)
		} catch (e) {
			console.log(e)
			res.send().status(500)
		}
	}


	return { create, getRateByCourse, bestRatedCourses, worstRatedCourses, coursePurchasesByDate }
}