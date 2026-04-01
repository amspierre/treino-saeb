const usuariosService = require('../services/usuariosService');

async function listarUsuarios(req, res) {

    const usuarios = await usuariosService.listarUsuarios();
    res.json(usuarios);
}

async function criarUsuario(req, res) {
    const { id, nome, email, senha } = req.body;
    const novoUsuario = await usuariosService.criarUsuario(id, nome, email, senha);
    res.json(novoUsuario);
}   

async function editarUsuario(req, res) {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    const usuarioAtualizado = await usuariosService.editarUsuario(id, nome, email, senha);
    res.json(usuarioAtualizado);
}   

async function deletarUsuario(req, res) {
    const { id } = req.params;
    await usuariosService.deletarUsuario(id);
    res.json({ message: "Usuário deletado com sucesso" });
}


module.exports = {
    listarUsuarios,
    criarUsuario,
    editarUsuario,
    deletarUsuario
};
