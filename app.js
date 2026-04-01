const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const tarefasRoutes = require("./routes/tarefas");
const usuariosRoutes = require("./routes/usuarios");

app.use("/api/tarefas", tarefasRoutes);
app.use("/api/usuarios", usuariosRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
