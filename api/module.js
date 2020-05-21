module.exports = app => {
	const { existsOrError } = app.utils.validator

	const save = async (req, res) => {
		const moduleFromBody = { ...req.body }
		
		try {
			const moduledb = {
				title: moduleFromBody.title,
				course_id: moduleFromBody.course_id
			}

			if (req.params.id) moduledb.id = req.params.id
		
			if (!moduledb.id) {
				existsOrError(moduledb.title, "Título não informado")
				existsOrError(moduledb.course_id, "Id do curso não informado")
			}

		} catch (e) {
			console.log(e)
			res.status(400).send(e)
		}
		try {
			Object.keys(moduledb).forEach(key => moduledb[key] === undefined ? delete moduledb[key] : '');

			await app.model.module.forge(moduledb).save()

			res.status(200).send('ok')
		} catch (e) {
			console.log(e)
			res.status(500).send('Erro')
		}
	}

	const get = async (req, res) => {
		let id = req.user.id
		await app.model.module.forge().where({})
		await app.model.module.forge().where({})
	}
	return { save }
}