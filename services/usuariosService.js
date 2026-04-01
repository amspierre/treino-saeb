const pool = require("../database/db");

async function listarUsuarios() {
    const resultado = await pool.query("SELECT id, nome, email, criado_em FROM usuarios ORDER BY nome");
    return resultado.rows;
}

async function buscarUsuarioPorId(id) {
    const resultado = await pool.query("SELECT id, nome, email, criado_em FROM usuarios WHERE id = $1", [id]);
    return resultado.rows[0] || null;
}

async function criarUsuario(nome, email, senha) {
    if (!nome || nome.trim() === "") throw new Error("Nome é obrigatório");
    if (!email || email.trim() === "") throw new Error("Email é obrigatório");
    if (!senha || senha.trim() === "") throw new Error("Senha é obrigatória");

    const resultado = await pool.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, criado_em",
        [nome.trim(), email.trim(), senha]
    );
    return resultado.rows[0];
}

async function editarUsuario(id, nome, email, senha) {
    const resultado = await pool.query(
        "UPDATE usuarios SET nome = $2, email = $3, senha = $4 WHERE id = $1 RETURNING id, nome, email, criado_em",
        [id, nome, email, senha]
    );
    if (!resultado.rows[0]) throw new Error("Usuário não encontrado");
    return resultado.rows[0];
}

async function deletarUsuario(id) {
    const resultado = await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    if (resultado.rowCount === 0) throw new Error("Usuário não encontrado");
    return true;
}

module.exports = { listarUsuarios, buscarUsuarioPorId, criarUsuario, editarUsuario, deletarUsuario };