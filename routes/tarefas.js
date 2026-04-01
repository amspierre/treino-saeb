const express = require("express");
const router = express.Router();
const tarefasController = require("../controllers/tarefas");

router.get("/", tarefasController.listarTarefas);
router.post("/", tarefasController.criarTarefa);
router.put("/:id", tarefasController.editarTarefa);
router.delete("/:id", tarefasController.deletarTarefa);

module.exports = router;