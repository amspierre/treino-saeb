const usuariosService = require("../services/tarefasService");

async function listarTarefas(req, res) {

    const tarefas = await tarefasService.listartarefas();

    res.json(tarefas);

}

module.exports = {
    listarTarefas
};