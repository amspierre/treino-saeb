const express = require("express");
const router = express.Router();

router.get("/", tarefasController.listarTarefas);

module.exports = router;