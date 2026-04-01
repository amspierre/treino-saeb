const pool = require('../config/db');

async function listarTarefas() {

    const resultado = await pool.query(
        "SELECT * FROM tarefas ORDER BY id"
    );

    return resultado.rows;

}

async function criarTarefa(id, id_usuario, descricao, setor, prioridade, data_cadastro, status) {

    const resultado = await pool.query(
        "INSERT INTO tarefas (id, id_usuario, descricao, setor, prioridade, data_cadastro, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [id, id_usuario, descricao, setor, prioridade, data_cadastro, status]
    );

    return resultado.rows[0];
}

async function editarTarefa(id, id_usuario, descricao, setor, prioridade, data_cadastro, status) {

    const resultado = await pool.query(
        "UPDATE tarefas SET id_usuario = $2, descricao = $3, setor = $4, prioridade = $5, data_cadastro = $6, status = $7 WHERE id = $1 RETURNING *",
        [id, id_usuario, descricao, setor, prioridade, data_cadastro, status]
    );

    return resultado.rows[0];
}

async function deletarTarefa(id) {

    await pool.query(
        "DELETE FROM tarefas WHERE id = $1",
        [id]
    );

}

module.exports = {
    listarTarefas,
    criarTarefa,
    editarTarefa,
    deletarTarefa
};