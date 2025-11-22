// Método para deixar a data no formato dd/mm/yyyy

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}


async function carregarPostagens () {
    try {
        const response = await fetch("http://localhost:8080/postagem");

        if(!response.ok){
            throw new Error(`Erro na rquisição: ${response.status}`)
        }

        const postagens = await response.json();

        console.log("JSON retornado pela API:", postagens);

        exibirPostagens(postagens);


    } catch(erro){
        console.error("Erro ao carregar postagens:", erro);
    }
}

function exibirPostagens(lista){
    const container = document.getElementById("posts");
    container.innerHTML = "";

    lista.forEach(post => {
        const card = `
            <div class="post-card">
                <h3>${post.titulo}</h3>
                <p>Autor: ${post.autor}</p>
                <p> Publicado em ${formatarData(post.dataPublicacao)}</p>
                <p>${post.conteudo}</p>
                
            </div>
        `;
        container.innerHTML += card;
    });
}

document.addEventListener("DOMContentLoaded", carregarPostagens);
