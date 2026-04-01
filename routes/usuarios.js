const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios");

router.get("/", usuariosController.listarUsuarios);
router.post("/", usuariosController.criarUsuario);
router.put("/:id", usuariosController.editarUsuario);
router.delete("/:id", usuariosController.deletarUsuario);

module.exports = router;