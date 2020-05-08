module.exports = app => {

	const {existsOrError} = app.utils.validator
    const save = async (req, res) => {

        const courseFromReq = { ...req.body }

        if(!req.user) res.send('Erro ao reconhecer id do usuário').status(403)

        let course = {
            title: courseFromReq.title,
            creator_id: req.user.id,
            price: courseFromReq.price,
            description: courseFromReq.description,
						tumbnail_url: courseFromReq.tumbnail_url,
						code: `${Math.floor(Date.now() - 1588000000000)}-${1000 + req.user.id}`
						
        }

        if (req.params.id){
					try{
						const isValid = await app.model.course.forge().where({"id": req.params.id, "creator_id": req.user.id})
						course.id = req.params.id
            }catch(e){
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

		const getByUser = async (req, res) => {}
		
		const getMostSelled = async (req, res) => {}

		const getByDate = async (req, res) => {}

		const getById = async (req, res) => {}

		const search = async (req, res) => {}

    return{save, getByUser, getMostSelled, getByDate,  getById, search}
}