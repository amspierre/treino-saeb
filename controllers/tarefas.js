const tarefasService = require("../services/tarefasService");

async function criarTarefa(req, res) {
  const {
    id_usuario,
    descricao,
    setor,
    prioridade,
    data_cadastro,
    status,
  } = req.body;

  const novaTarefa = await tarefasService.criarTarefa(
    id_usuario,
    descricao,
    setor,
    prioridade,
    data_cadastro,
    status,
  );

  res.json(novaTarefa);
}

async function editarTarefa(req, res) {
  const { id } = req.params;
  const { id_usuario, descricao, setor, prioridade, data_cadastro, status } =
    req.body;
  const tarefaAtualizada = await tarefasService.editarTarefa(
    id,
    id_usuario,
    descricao,
    setor,
    prioridade,
    data_cadastro,
    status,
  );
  res.json(tarefaAtualizada);
}

async function listarTarefas(req, res) {
  const tarefas = await tarefasService.listarTarefas();
  res.json(tarefas);
}

async function deletarTarefa(req, res) {
  const { id } = req.params;
  await tarefasService.deletarTarefa(id);
  res.json({ message: "Tarefa deletada com sucesso" });
}

module.exports = {
  criarTarefa,
  editarTarefa,
  listarTarefas,
  deletarTarefa,
};
