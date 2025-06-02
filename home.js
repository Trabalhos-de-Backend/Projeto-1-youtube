const Videos = require("./videos");

class Home {
  static async exibirVideos() {
    try {
      const videos = await Videos.buscarTodos();
      console.log("\nHome:\n");
      videos.forEach((video) => {
        console.log(video.nome);
        console.log(video.url);
        console.log();
      });
    } catch (error) {
      console.log("Erro ao exibir vídeos:", error);
    }
  }
}

module.exports = Home;