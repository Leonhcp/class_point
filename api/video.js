module.exports = app => {

	const { existsOrError } = app.utils.validator 

	const save = async (req, res) => {

		const videoFromReq = { ...req.body }

		if (!req.user) res.send('Erro ao reconhecer id do usuário').status(403)

		let video = {
			title: videoFromReq.title,
			url: videoFromReq.url,
		}

		let course_code = videoFromReq.course_code

		if (req.params.id) video.id = req.params.id

		try {
			if (!video.id) {
				existsOrError(video.title, 'Título não informado')
				existsOrError(video.url, 'Url não informado')
				existsOrError(course_code, 'Código do curso não informado')
			}
		}

		catch (msg) {
			console.log(msg);
			return res.status(400).send(msg)
		}

		try {
			const course = await app.db.knex('courses').where({ "code": course_code }).first()

			if (course.creator_id !== req.user.id) res.send().status(403)

			video.course_id = course.id
		} catch (msg) {
			console.log(msg);
			return res.status(500).send(msg)
		}

		try {
			Object.keys(video).forEach(key => video[key] === undefined ? delete video[key] : '');
			await app.model.video.forge(video).save()
			return res.status(204).send();
		}

		catch (err) {
			console.log(err);
			if (err === 1062) return res.status(400).send("E-mail já cadastrado.");
			return res.status(500).send();
		}
	}

	const getByCourse = async (req, res) => { 
		id = req.params.id;
		try {
				let videos = await app.model.video.forge({ "course_id": id }).fetch()
				res.json(videos.toJSON());
		} catch (e) {
				console.log(e);
				return res.status(500).send();
		}
	}

	const getById = async (req, res) => { 
		id = req.params.id;
		try {
				let video = await app.model.video.forge({ "id": id }).fetch()
				res.json(video.toJSON());
		} catch (e) {
				console.log(e);
				return res.status(500).send();
		}
	}

	return { save, getByCourse, getById }
}