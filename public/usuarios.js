let editingId = null;

async function loadUsuarios() {
  try {
    const res = await fetch("/api/usuarios");
    const lista = await res.json();
    const tbody = document.getElementById("usuarios-tbody");

    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="4"><div class="empty">Nenhum usuário cadastrado.</div></td></tr>`;
      return;
    }

    tbody.innerHTML = lista
      .map((u) => {
        const iniciais = u.nome
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        const data = u.criado_em
          ? new Date(u.criado_em).toLocaleDateString("pt-BR")
          : "—";
        return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="avatar">${iniciais}</div>
              <span>${u.nome}</span>
            </div>
          </td>
          <td style="color:var(--text-muted)">${u.email}</td>
          <td style="color:var(--text-muted)">${data}</td>
          <td>
            <div style="display:flex;gap:4px;justify-content:flex-end">
              <button class="btn btn-ghost btn-sm" onclick="editarUsuario(${u.id},'${u.nome}','${u.email}')">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="deletarUsuario(${u.id})">Excluir</button>
            </div>
          </td>
        </tr>`;
      })
      .join("");
  } catch (e) {
    showToast("Erro ao carregar usuários", true);
  }
}

function openModal(id = null) {
  editingId = id;
  document.getElementById("edit-id").value = id || "";
  document.getElementById("modal-title").textContent = id
    ? "Editar usuário"
    : "Novo usuário";
  if (!id) {
    document.getElementById("f-nome").value = "";
    document.getElementById("f-email").value = "";
    document.getElementById("f-senha").value = "";
  }
  document.getElementById("overlay").classList.add("open");
}

function closeModal(e) {
  if (!e || e.target === document.getElementById("overlay")) {
    document.getElementById("overlay").classList.remove("open");
  }
}

function editarUsuario(id, nome, email) {
  openModal(id);
  document.getElementById("f-nome").value = nome;
  document.getElementById("f-email").value = email;
  document.getElementById("f-senha").value = "";
}

async function salvarUsuario() {
  const nome = document.getElementById("f-nome").value.trim();
  const email = document.getElementById("f-email").value.trim();
  const senha = document.getElementById("f-senha").value;

  if (!nome || !email) return showToast("Preencha nome e email", true);

  try {
    if (editingId) {
      await fetch(`/api/
        usuarios/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      showToast("Usuário atualizado");
    } else {
      if (!senha) return showToast("Senha é obrigatória", true);
      await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      showToast("Usuário criado");
    }
    closeModal();
    loadUsuarios();
  } catch (e) {
    showToast("Erro ao salvar", true);
  }
}

async function deletarUsuario(id) {
  if (!confirm("Excluir este usuário?")) return;
  try {
    await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
    showToast("Usuário excluído");
    loadUsuarios();
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

loadUsuarios();
