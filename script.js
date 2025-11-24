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

    alert("Dados incluídos com sucesso!");
    window.location.href = "./index.html";
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
