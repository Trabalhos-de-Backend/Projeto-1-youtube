const Videos = require("./videos");

async function testarInsercao() {
  const video = new Videos("Aprenda a fazer pipoca", "https://www.youtube.com/watch?v=rkW2nqp_3X4", 123, "culinária");
  await video.inserir();
}

testarInsercao();