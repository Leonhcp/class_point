module.exports = app => {
	const start = async (req, res, next) => { 

		try {
			const time = {
				courseId: req.params.id,
				userId: req.user.id
			}

			await app.model.time.create(time)
			next()

		} catch (e) {
			console.log(e)
			res.send().status(500)
		}
    }
    const end = async (req, res, next) => {
			try {

				let courseId = req.params.id
				let userId = req.user.id
			
				await app.model.time.where({userId: userId, courseId: courseId, endedAt: ''}).updateOne({endedAt: Date.now()})
				res.send('ok').status(200)
	
			} catch (e) {
				console.log(e)
				res.send().status(500)
			}
    }
	return { start, end }
}