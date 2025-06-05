const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const Videos = require("./videos");
const Home = require("./home");
const Playlists = require("./playlists");
const { ObjectId } = require("mongodb");

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");
  const method = req.method.toUpperCase();
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", chunk => (buffer += decoder.write(chunk)));
  req.on("end", async () => {
    buffer += decoder.end();
    let payload = {};
    try {
      payload = JSON.parse(buffer);
    } catch {}

    if (pathname === "videos" && method === "GET") {
      if (parsedUrl.query.nome) {
        try {
          const results = await Videos.buscarPorNome(parsedUrl.query.nome);
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(results));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Erro ao buscar vídeos" }));
        }
      } else {
        try {
          const all = await Videos.buscarTodos();
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(all));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Erro ao listar vídeos" }));
        }
      }
    }

    if (pathname === "videos" && method === "POST") {
      const { nome, url: videoUrl, duracao, categoria } = payload;
      if (!nome || !videoUrl || !duracao || !categoria) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Campos obrigatórios ausentes" }));
      }
      try {
        const novoVideo = new Videos(nome, videoUrl, duracao, categoria);
        await novoVideo.inserir();
        res.writeHead(201, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Vídeo inserido" }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Erro ao inserir vídeo" }));
      }
    }

    if (pathname.startsWith("videos/")) {
      const parts = pathname.split("/");
      const id = parts[1];
      if (!ObjectId.isValid(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "ID inválido" }));
      }

      if (method === "PUT") {
        const novosDados = {};
        const { nome: novoNome, url: novaUrl, duracao: novaDuracao, categoria: novaCategoria } = payload;
        if (novoNome) novosDados.nome = novoNome;
        if (novaUrl) novosDados.url = novaUrl;
        if (novaDuracao) novosDados.duracao = novaDuracao;
        if (novaCategoria) novosDados.categoria = novaCategoria;

        if (Object.keys(novosDados).length === 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Nenhum campo para atualizar" }));
        }

        try {
          await Videos.atualizar(id, novosDados);
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ message: "Vídeo atualizado" }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Erro ao atualizar vídeo" }));
        }
      }

      if (method === "DELETE") {
        try {
          await Videos.deletar(id);
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ message: "Vídeo deletado" }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Erro ao deletar vídeo" }));
        }
      }

      if (method === "GET") {
        try {
          const videos = await Videos.buscarPorNome(id);
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(videos));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Erro ao buscar vídeos" }));
        }
      }
    }

    if (pathname === "home" && method === "GET") {
      try {
        const videos = await Videos.buscarTodos();
        const response = videos.map(v => ({ nome: v.nome, url: v.url }));
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(response));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Erro ao exibir Home" }));
      }
    }

    if (pathname === "playlists" && method === "GET") {
      try {
        const videos = await Videos.buscarTodos();
        const categorias = {};
        videos.forEach(video => {
          if (!categorias[video.categoria]) {
            categorias[video.categoria] = [];
          }
          categorias[video.categoria].push({
            nome: video.nome,
            url: video.url,
            duracao: video.duracao,
            dataCriacao: video.dataCriacao,
          });
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(categorias));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Erro ao exibir Playlists" }));
      }
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Rota não encontrada" }));
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
