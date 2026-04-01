let editingId = null;
const COLS = { "À fazer": "a-fazer", Fazendo: "fazendo", Feito: "feito" };
const PRIO_LABEL = { baixa: "Baixa", media: "Média", alta: "Alta" };

async function loadTarefas() {
  try {
    const res = await fetch("/api/tarefas");
    const tarefas = await res.json();

    Object.values(COLS).forEach((col) => {
      document.getElementById("col-" + col).innerHTML = "";
      document.getElementById("count-" + col).textContent = "0";
    });

    const counts = { "À fazer": 0, Fazendo: 0, Feito: 0 };

    tarefas.forEach((t) => {
      const colKey = t.status;
      const colId = COLS[colKey];
      if (!colId) return;
      counts[colKey]++;

      const card = document.createElement("div");
      card.className = "task-card";
      card.innerHTML = `
        <div class="task-card-desc">${t.descricao}</div>
        <div class="task-card-meta">
          ${t.setor ? `<span class="tag tag-setor">${t.setor}</span>` : ""}
          <span class="tag tag-${t.prioridade}">${PRIO_LABEL[t.prioridade] || t.prioridade}</span>
          ${t.nome_usuario ? `<span class="task-user">${t.nome_usuario}</span>` : ""}
        </div>
        <div class="task-card-actions">
          <button class="btn btn-ghost btn-sm" onclick='editarTarefa(${JSON.stringify(t)})'>Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deletarTarefa(${t.id})">Excluir</button>
        </div>`;
      document.getElementById("col-" + colId).appendChild(card);
    });

    Object.entries(counts).forEach(([status, n]) => {
      document.getElementById("count-" + COLS[status]).textContent = n;
      if (n === 0) {
        document.getElementById("col-" + COLS[status]).innerHTML =
          '<div class="empty">Nenhuma tarefa</div>';
      }
    });
  } catch (e) {
    showToast("Erro ao carregar tarefas", true);
  }
}

async function loadUsuariosNoSelect() {
  try {
    const res = await fetch("/api/usuarios");
    const lista = await res.json();
    const sel = document.getElementById("f-usuario");
    sel.innerHTML = lista
      .map((u) => `<option value="${u.id}">${u.nome}</option>`)
      .join("");
  } catch (e) {
    console.error(e);
  }
}

function openModal(id = null) {
  editingId = id;
  document.getElementById("modal-title").textContent = id
    ? "Editar tarefa"
    : "Nova tarefa";
  if (!id) {
    document.getElementById("f-descricao").value = "";
    document.getElementById("f-setor").value = "";
    document.getElementById("f-prioridade").value = "media";
    document.getElementById("f-data").value = new Date()
      .toISOString()
      .split("T")[0];
    document.getElementById("f-status").value = "À fazer";
  }
  loadUsuariosNoSelect();
  document.getElementById("overlay").classList.add("open");
}

function closeModal(e) {
  if (!e || e.target === document.getElementById("overlay")) {
    document.getElementById("overlay").classList.remove("open");
  }
}

function editarTarefa(t) {
  openModal(t.id);
  setTimeout(() => {
    document.getElementById("f-descricao").value = t.descricao;
    document.getElementById("f-setor").value = t.setor || "";
    document.getElementById("f-prioridade").value = t.prioridade;
    document.getElementById("f-data").value = t.data_cadastro
      ? t.data_cadastro.split("T")[0]
      : "";
    document.getElementById("f-status").value = t.status;
    document.getElementById("f-usuario").value = t.id_usuario;
  }, 80);
}

async function salvarTarefa() {
  const descricao = document.getElementById("f-descricao").value.trim();
  const setor = document.getElementById("f-setor").value.trim();
  const prioridade = document.getElementById("f-prioridade").value;
  const data_cadastro = document.getElementById("f-data").value;
  const status = document.getElementById("f-status").value;
  const id_usuario = document.getElementById("f-usuario").value;

  if (!descricao) return showToast("Descrição é obrigatória", true);
  if (!id_usuario) return showToast("Selecione um responsável", true);

  const body = {
    id_usuario,
    descricao,
    setor,
    prioridade,
    data_cadastro,
    status,
  };

  try {
    if (editingId) {
      await fetch(`/api/tarefas/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      showToast("Tarefa atualizada");
    } else {
      await fetch("/api/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      showToast("Tarefa criada");
    }
    closeModal();
    loadTarefas();
  } catch (e) {
    showToast("Erro ao salvar", true);
  }
}

async function deletarTarefa(id) {
  if (!confirm("Excluir esta tarefa?")) return;
  try {
    await fetch(`/api/tarefas/${id}`, { method: "DELETE" });
    showToast("Tarefa excluída");
    loadTarefas();
  } catch (e) {
    showToast("Erro ao excluir", true);
  }
}

function showToast(msg, error = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => (t.className = "toast"), 2800);
}

loadTarefas();
