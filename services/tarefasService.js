async function listarTarefas() {

    const resultado = await pool.query(
        "SELECT * FROM tarefas ORDER BY id"
    );

    return resultado.rows;

}