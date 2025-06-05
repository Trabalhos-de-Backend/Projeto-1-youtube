const Videos = require("./videos");
const { logError } = require("./log");

class Playlists {
  static async exibirPorCategoria() {
    try {
      const videos = await Videos.buscarTodos();

      const categorias = {};
      videos.forEach((video) => {
        if (!categorias[video.categoria]) {
          categorias[video.categoria] = [];
        }
        categorias[video.categoria].push(video);
      });

      console.log("\nPlaylists:\n");
      for (const categoria in categorias) {
        console.log(`Categoria: ${categoria}`);
        categorias[categoria].forEach((video) => {
          console.log(video.nome);
          console.log(video.url);
          console.log();
        });
      }
    } catch (error) {
      console.log("Erro ao exibir playlists:", error);
      logError(error);
    }
  }
}

module.exports = Playlists;