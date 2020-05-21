module.exports = app => {

	const { existsOrError } = app.utils.validator
	
	const save = async (req, res) => {

		const courseFromReq = { ...req.body }

		if (!req.user) res.send('Erro ao reconhecer id do usuário').status(403)

		let course = {
			title: courseFromReq.title,
			creator_id: req.user.id,
			price: courseFromReq.price,
			description: courseFromReq.description,
			tumbnail_url: courseFromReq.tumbnail_url,
			code: `${Math.floor(Date.now() - 1588000000000)}-${1000 + req.user.id}`

		}

		if (req.params.id) {
			try {
				const isValid = await app.model.course.forge().where({ "id": req.params.id, "creator_id": req.user.id })
				course.id = req.params.id
			} catch (e) {
				console.log(e)
				res.send("Tentativa de edição inválida tente editar um curso seu").status(403)
			}
		}

		try {
			if (!course.id) {
				existsOrError(course.title, 'Título não informado')
				existsOrError(course.price, 'Preço não informado')
				existsOrError(course.description, 'Descrição não informada')
				existsOrError(course.tumbnail_url, 'Url da tumbnail informada')
			}
		}

		catch (msg) {
			console.log(msg);
			return res.status(400).send(msg)
		}

		try {
			Object.keys(course).forEach(key => course[key] === undefined ? delete course[key] : '');
			await app.model.course.forge(course).save()
			return res.status(204).send();
		}

		catch (err) {
			console.log(err);
			if (err === 1062) return res.status(400).send("E-mail já cadastrado.");
			return res.status(500).send();
		}
	}

	const getByUser = async (req, res) => {
		let { id } = req.user
		try {
			let final = []
			let courseFromMongoDB = await app.model.purchase
				.where({ userId: id })
				.distinct('coursesId')

			for (i = 0; i < courseFromMongoDB.length; i++) {
				let courseFromSQL = await app.db.knex('courses').select().where({ id: courseFromMongoDB[i] })
				final.push(courseFromSQL[0])
			}

			res.send(final).status(200)
		} catch (e) {
			res.send().status(500)
		}

	}

	const getMostSelled = async (req, res) => {
		try {
			let courseFromMongoDB = await app.model.purchase.distinct('coursesId')

			let arrayOfMode = []

			let final = []

			for (i = 0; i < courseFromMongoDB.length; i++) {
				let count = await app.model.purchase.where({ 'coursesId': courseFromMongoDB[i] }).countDocuments()

				let idToArray = {
					id: courseFromMongoDB[i],
					mode: count
				}

				arrayOfMode.push(idToArray)

			}

			function randomInt(min, max) {
				return min + 0.3 + Math.floor((max - min) * Math.random());
			}

			arrayOfMode = arrayOfMode.sort(function (a, b) {
				if (a.mode < b.mode) {
					return 1;
				}
				if (a.mode > b.mode) {
					return -1;
				}
				return randomInt(-1, 1)
			});

			console.log(arrayOfMode)

			for (i = 0; i < arrayOfMode.length; i++) {
				let courseFromSQL = await app.db.knex('courses').select().where({ id: arrayOfMode[i].id })
				final.push(courseFromSQL[0])
			}

			res.send(final).status(200)
		}
		catch (e) {
			res.send().status(500)
		}
	}

	const getByDate = async (req, res) => {
		try {
			let courseFromDB = await app.db.knex('courses')
				.select()
				.orderBy('created_at', 'desc')
			res.json(courseFromDB);
		} catch (e) {
			console.log(e);
			return res.status(500).send();
		}
	}

	const getById = async (req, res) => {
		let id = req.params.id;
		try {
			let usersFromMongoDB = await app.model.purchase.where({ coursesId: id }).distinct('userId')

			let courseFromSQLDB = await app.model.course.forge({ "id": id }).fetch()

			let course = {
				profile: courseFromSQLDB,
				students: []
			}
			for (i = 0; i < usersFromMongoDB; i++) {
				let user = await app.db.knex('users').where({ 'id': usersFromMongoDB[i]}).select('id', 'name')
				course.students.push(user[0])
			}

			res.send(course);
		} catch (e) {
			console.log(e);
			return res.status(500).send();
		}
	}

	const search = async (req, res) => {

	}

	return { save, getByUser, getMostSelled, getByDate, getById, search }
}