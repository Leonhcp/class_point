module.exports = app => {
	const { existsOrError } = app.utils.validator

	const save = async (req, res) => {
		const contentFromBody = { ...req.body }
		
		try {
			const content = {
				title: contentFromBody.title,
				module_id: contentFromBody.module_id
			}

			if (req.params.id) content.id = req.params.id
		
			if (!content.id) {
				existsOrError(content.title, "Título não informado")
				existsOrError(content.course_id, "Id do módulo não informado")
			}

		} catch (e) {
			console.log(e)
			res.status(400).send(e)
		}
		try {

			await app.model.content.forge(content).save()

			res.status(200).send('ok')
		} catch (e) {
			console.log(e)
			res.status(500).send('Erro')
		}
	}
	return { save }
}