module.exports = app => {
	const create = async (req, res) => {

		let purchaseFromReq = { ...req.body }


		try {
			const purchase = {
				coursesId: purchaseFromReq.coursesId,
				status: 'waiting...',
				invoice: `${Date.now()}-invoice-${req.user.id}`
			}

			purchase.userId = req.user.id

			let courseFromMongoDB = await app.model.purchase
				.where({ userId: purchase.userId })
				.distinct('coursesId')

			for (i = 0; i < purchaseFromReq.coursesId.length; i++) {
				let validator = courseFromMongoDB.indexOf(purchaseFromReq.coursesId[i])
				console.log(validator)
				if (validator !== -1) {
					res.send('Você está tentando comprar um curso que ja esta comprado ou em espera').status(400)
					purchase = [0]
				}
			}

			var arrayPrices = []

			for (i = 0; i < purchase.coursesId.length; i++) {
				let forPrice = await app.db.knex('courses').where({ "id": purchase.coursesId[i] }).first()
				arrayPrices.push(forPrice.price)
			}

			let userPrice = arrayPrices.reduce((acc, cur) => {
				acc += cur;
				if (acc < 0) { return 0 }
				else { return acc }
			});

			purchase.price = userPrice

			console.log(purchase)

			await app.model.purchase.create(purchase)
			return res.status(204).send()

		} catch (e) {
			console.log(e)
			res.send().status(500)
		}
	}

	const getByUser = async (req, res) => {
		const id = req.user.id;

		try {
			let purchases = await app.model.purchase
				.find({ 'userId': id })
				.lte('createdAt', new Date())
				.sort({ createdAt: -1 })
			return res.send(purchases)
		} catch (msg) {
			console.log(msg);
			return res.status(500).send(msg)
		}
	}

	return { create, getByUser }
}