module.exports = app => {

    const { existsOrError } = app.utils.validator
  
    const get = async (req, res) => {
      try {
        const id = req.user.id
        let users = await app.model.user.forge().where({"id": id}).fetch({ columns: user_columns })
        res.json(users.toJSON());
      } catch (e) {
        console.log(e);
        return res.status(500).send();
      }
    }
  
    const remove = async (req, res) => {
      try {
        const rowsUpdated = await app.db.knex('users')
          .update({ deleted_at: new Date() })
          .where({ id: req.params.id })
        existsOrError(rowsUpdated, "Usuário não encontrado")
  
        res.status(204).send()
      } catch (msg) {
        res.status(400).send(msg)
      }
    }
  
    const exclude = async (req, res) => {
      let id = req.params.id;
  
      try {
        let user_query = await app.model.user.forge({ id }).fetch({
          require: true,
        })
  
        await user_query.destroy();
  
        return res.status(204).send();
      } catch (e) {
        console.log(e);
        return res.status(500).send("");
      }
    }
  
    return { get, remove, exclude }
  }
  
  

