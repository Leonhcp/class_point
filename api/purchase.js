module.exports = app => {
	const create = async (req, res) => {

		let purchaseFromReq = { ...req.body }


		let purchase = {
			coursesId: purchaseFromReq.coursesId,
			status: 'waiting...',
			invoice: `${Date.now()}-invoice-${req.user.id}`
		}

		purchase.userId = req.user.id

		try {
			var arrayPrices = []

			for (i = 0; i < purchase.coursesId.length; i++) {
				let forPrice = await app.db.knex('courses').where({ "id": purchase.coursesId[i] }).first()
				arrayPrices.push(forPrice.price)
			}

			let userPrice = arrayPrices.reduce(function (acc, cur) {
				acc += cur;
				if (acc < 0) { return 0 }
				else { return acc }
			});

			purchase.price = userPrice

			console.log(purchase)
		} catch (msg) {
			console.log(msg);
			return res.status(500).send(msg)
		}

		try {
			await app.model.purchase.create(purchase)
			return res.status(204).send()
		} catch (msg) {
			console.log(msg);
			return res.status(500).send(msg)
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