const pool = require("../database/db");

async function listarTarefas() {
    const resultado = await pool.query(`
        SELECT t.*, u.nome AS nome_usuario
        FROM tarefas t
        LEFT JOIN usuarios u ON t.id_usuario = u.id
        ORDER BY t.id
    `);
    return resultado.rows;
}

async function buscarTarefaPorId(id) {
    const resultado = await pool.query("SELECT * FROM tarefas WHERE id = $1", [id]);
    return resultado.rows[0] || null;
}

async function criarTarefa(id_usuario, descricao, setor, prioridade, data_cadastro, status) {
    if (!descricao || descricao.trim() === "") throw new Error("Descrição é obrigatória");
    if (!id_usuario) throw new Error("Usuário é obrigatório");

    const resultado = await pool.query(
        `INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, data_cadastro, status)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [id_usuario, descricao.trim(), setor, prioridade, data_cadastro, status]
    );
    return resultado.rows[0];
}

async function editarTarefa(id, id_usuario, descricao, setor, prioridade, data_cadastro, status) {
    const resultado = await pool.query(
        `UPDATE tarefas
         SET id_usuario = $2, descricao = $3, setor = $4, prioridade = $5, data_cadastro = $6, status = $7
         WHERE id = $1 RETURNING *`,
        [id, id_usuario, descricao, setor, prioridade, data_cadastro, status]
    );
    if (!resultado.rows[0]) throw new Error("Tarefa não encontrada");
    return resultado.rows[0];
}

async function deletarTarefa(id) {
    const resultado = await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);
    if (resultado.rowCount === 0) throw new Error("Tarefa não encontrada");
    return true;
}

module.exports = { listarTarefas, buscarTarefaPorId, criarTarefa, editarTarefa, deletarTarefa };