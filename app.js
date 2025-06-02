const Videos = require("./videos");
const Home = require("./home");
const Playlists = require("./playlists");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function pergunta(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function menu() {
  console.log(`
    Escolha uma opção:
    1 - Inserir vídeo
    2 - Buscar vídeo por nome
    3 - Atualizar vídeo
    4 - Deletar vídeo
    5 - Home
    6 - Playlists
    0 - Sair
  `);

  const opcao = await pergunta("Digite a opção: ");

  switch (opcao) {
    case "1":
      const nome = await pergunta("Nome do vídeo: ");
      const url = await pergunta("URL do vídeo: ");
      const duracaoStr = await pergunta("Duração em segundos: ");
      const duracao = parseInt(duracaoStr);
      const categoria = await pergunta("Categoria: ");

      const novoVideo = new Videos(nome, url, duracao, categoria);
      await novoVideo.inserir();
      break;

    case "2":
      const nomeBusca = await pergunta("Nome para buscar: ");
      await Videos.buscarPorNome(nomeBusca);
      break;

    case "3":
      const idAtualizar = await pergunta("ID do vídeo para atualizar: ");
      const novoNome = await pergunta("Novo nome (deixe vazio para não alterar): ");
      const novaUrl = await pergunta("Nova URL (deixe vazio para não alterar): ");
      const novaDuracaoStr = await pergunta("Nova duração em segundos (deixe vazio para não alterar): ");
      const novaCategoria = await pergunta("Nova categoria (deixe vazio para não alterar): ");

      const novosDados = {};
      if (novoNome) novosDados.nome = novoNome;
      if (novaUrl) novosDados.url = novaUrl;
      if (novaDuracaoStr) novosDados.duracao = parseInt(novaDuracaoStr);
      if (novaCategoria) novosDados.categoria = novaCategoria;

      if (Object.keys(novosDados).length === 0) {
        console.log("Nenhum dado para atualizar.");
      } else {
        await Videos.atualizar(idAtualizar, novosDados);
      }
      break;

    case "4":
      const idDeletar = await pergunta("ID do vídeo para deletar: ");
      await Videos.deletar(idDeletar);
      break;

    case "5":
      await Home.exibirVideos();
      break;

    case "6":
      await Playlists.exibirPorCategoria();
      break;

    case "0":
      rl.close();
      return;

    default:
      console.log("Opção inválida.");
  }

  menu();
}

menu();
