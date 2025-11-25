// Método para deixar a data no formato dd/mm/yyyy
function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

// Carregar postagens da API
async function carregarPostagens() {
  try {
    const response = await fetch("http://localhost:8080/postagem");

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const postagens = await response.json();
    exibirPostagens(postagens);
  } catch (erro) {
    console.error("Erro ao carregar postagens:", erro);
  }
}

// Exibir posts
function exibirPostagens(lista) {
  const container = document.getElementById("posts");

  if (!container) return;

  container.innerHTML = "";

  lista.forEach((post) => {
    let flag = "";

    if (!post.publicado) {
      flag = `<span class="flag-nao-publicado">Não publicado</span>`;
    }

    const card = `
            <div class="post-card">
                ${flag}
                <h3>${post.titulo}</h3>
                <p>Autor: ${post.autor}</p>
                <p>Publicado em ${formatarData(post.dataPublicacao)}</p>
                <p>${post.conteudo}</p>
                  <div class="card-buttons">
                <button class="btn-edit" onclick="editarPost(${
                  post.id
                })">Alterar</button>
                <button class="btn-delete" onclick="excluirPost(${
                  post.id
                })">Excluir</button>
                </div>
            </div>
        `;
    container.innerHTML += card;
  });
}

// Função para salvar a postagem

async function salvarPostagem(event) {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;

  const autor = document.getElementById("autor").value;

  const conteudo = document.getElementById("conteudo").value;

  const data = document.getElementById("data").value;

  if (titulo == "" || autor == "" || conteudo == "" || data == "") {
    alert("Preencha todos os campos!");
    return;
  }

  const novaPostagem = {
    titulo: titulo,
    autor: autor,
    conteudo: conteudo,
    dataPublicacao: data,
  };

  try {
    const response = await fetch("http://localhost:8080/postagem", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(novaPostagem),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    mostrarPopupSucesso("Postagem salva com sucesso!");
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 2000);
  } catch (erro) {
    alert("Erro no envio");
  }
}

// Função desenvolvida para garantir que o JS só tente buscar e exibir postagens
// depois que o elemento id "Posts" já exista no DOM. Evitar erros como cannot set properties of null
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("posts")) {
    carregarPostagens();
  }

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", salvarPostagem);
  }
});

async function excluirPost(id) {
  confirmarExclusao(id);
}

function confirmarExclusao(id) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.35)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";

  const modal = document.createElement("div");
  modal.style.background = "white";
  modal.style.padding = "25px";
  modal.style.borderRadius = "10px";
  modal.style.width = "300px";
  modal.style.textAlign = "center";
  modal.style.fontFamily = "Poppins, sans-serif";

  const texto = document.createElement("p");
  texto.innerText = `Tem certeza que deseja excluir a publicação do ID: ${id}?`;
  texto.style.marginBottom = "20px";

  const btnSim = document.createElement("button");
  btnSim.innerText = "Sim";
  btnSim.style.marginRight = "10px";
  btnSim.style.padding = "8px 18px";
  btnSim.style.background = "#e63946";
  btnSim.style.color = "white";
  btnSim.style.border = "none";
  btnSim.style.borderRadius = "8px";
  btnSim.style.cursor = "pointer";
  btnSim.style.fontWeight = "600";

  const btnNao = document.createElement("button");
  btnNao.innerText = "Não";
  btnNao.style.padding = "8px 18px";
  btnNao.style.background = "#ccc";
  btnNao.style.color = "#333";
  btnNao.style.border = "none";
  btnNao.style.borderRadius = "8px";
  btnNao.style.cursor = "pointer";
  btnNao.style.fontWeight = "600";

  btnNao.onclick = () => {
    document.body.removeChild(overlay);
  };

  btnSim.onclick = async () => {
    try {
      const response = await fetch(`http://localhost:8080/postagem/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir.");
      }

      document.body.removeChild(overlay);

      mostrarPopupSucesso("Postagem excluída com sucesso!");
      carregarPostagens();
    } catch (erro) {
      alert("Erro ao excluir.");
    }
  };

  modal.appendChild(texto);
  modal.appendChild(btnSim);
  modal.appendChild(btnNao);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function mostrarPopupSucesso(mensagem) {
  const div = document.createElement("div");
  div.innerText = mensagem;

  div.style.position = "fixed";
  div.style.bottom = "20px";
  div.style.right = "20px";
  div.style.padding = "15px 20px";
  div.style.background = "#4caf50";
  div.style.color = "white";
  div.style.borderRadius = "8px";
  div.style.fontFamily = "Poppins, sans-serif";
  div.style.zIndex = "9999";
  div.style.opacity = "1";
  div.style.transition = "opacity 1s ease";

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.opacity = "0";
    setTimeout(() => div.remove(), 1000);
  }, 2000);
}

async function editarPost(id) {
  try {
    const response = await fetch(`http://localhost:8080/postagem/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao carregar postagem");
    }

    const postagem = await response.json();

    document.querySelector("#posts").style.display = "none";

    const container = document.createElement("div");
    container.id = "editar-form-container";
    container.innerHTML = `
      <h2>Editar Postagem</h2>

      <label>Título:</label>
      <input id="edit-titulo" type="text" required value="${postagem.titulo}">

      <label>Autor:</label>
      <input id="edit-autor" type="text" required value="${postagem.autor}">

      <label>Conteúdo:</label>
      <textarea id="edit-conteudo" required minlength="10">${postagem.conteudo}</textarea>

      <label>Data:</label>
      <input id="edit-data" type="date" required value="${postagem.dataPublicacao}">

      <button id="btn-salvar-edicao">Salvar alterações</button>
      <button id="btn-cancelar-edicao">Cancelar</button>
    `;

    document.body.appendChild(container);

    document.querySelector("#btn-salvar-edicao").onclick = async () => {
      const dadosEditados = {
        titulo: document.querySelector("#edit-titulo").value,
        autor: document.querySelector("#edit-autor").value,
        conteudo: document.querySelector("#edit-conteudo").value,
        dataPublicacao: document.querySelector("#edit-data").value,
      };

      const responseUpdate = await fetch(
        `http://localhost:8080/postagem/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosEditados),
        }
      );

      if (!responseUpdate.ok) {
        alert("Erro ao salvar edição!");
        return;
      }

      mostrarPopupSucesso("Postagem atualizada com sucesso!");
      setTimeout(() => {
        location.reload();
      }, 1800);
    };

    document.querySelector("#btn-cancelar-edicao").onclick = () => {
      container.remove();
      document.querySelector("#posts").style.display = "block";
    };
  } catch (erro) {
    alert("Erro ao carregar dados da postagem");
  }
}
