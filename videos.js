const { connect } = require("./db");

class Videos {
  constructor(nome, url, duracao, categoria) {
    this.nome = nome;
    this.url = url;
    this.duracao = duracao;
    this.categoria = categoria;
  }

  async inserir() {
    try {
      const { db, client } = await connect();
      const result = await db.collection("videos").insertOne({
        nome: this.nome,
        url: this.url,
        duracao: this.duracao,
        categoria: this.categoria,
      });
      console.log("Vídeo inserido:", result.insertedId);
      client.close();
    } catch (error) {
      console.log("Erro ao inserir Vídeo:", error);
    }
  }
}

module.exports = Videos;