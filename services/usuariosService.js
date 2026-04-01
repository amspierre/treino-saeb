const pool = require("../database/db");

async function listarUsuarios() {

    const resultado = await pool.query(
        "SELECT * FROM usuarios ORDER BY id"
    );

    return resultado.rows;

}

async function buscarUsuarioPorId(id) {

    const resultado = await pool.query(
        "SELECT * FROM usuarios WHERE id = $1",
        [id]
    );

    return resultado.rows[0];

}

async function criarUsuario(nome, idade) {

    if (!nome || nome.trim() === "") {
        throw new Error("Nome é obrigatório");
    }

    const resultado = await pool.query(
        `
        INSERT INTO usuarios (nome, idade)
        VALUES ($1, $2)
        RETURNING *
        `,
        [nome, idade]
    );

    return resultado.rows[0];

}

async function atualizarUsuario(id, nome, idade) {

    const resultado = await pool.query(
        `
        UPDATE usuarios
        SET nome = COALESCE($1, nome),
            idade = COALESCE($2, idade)
        WHERE id = $3
        RETURNING *
        `,
        [nome, idade, id]
    );

    return resultado.rows[0];

}

async function deletarUsuario(id) {

    const resultado = await pool.query(
        "DELETE FROM usuarios WHERE id = $1",
        [id]
    );

    return resultado.rowCount > 0; // CORRIGIDO: havia um "0" solto nessa linha

}

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
};