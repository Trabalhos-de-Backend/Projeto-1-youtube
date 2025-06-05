const { connect } = require("./db");
const { ObjectId } = require("mongodb");
const { logError } = require("./log");

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
        dataCriacao: new Date(),
      });
      console.log("Vídeo inserido:", result.insertedId);
      client.close();
    } catch (error) {
      console.log("Erro ao inserir Vídeo:", error);
      logError(error);
    }
  }

  static async buscarPorNome(nome) {
    try {
      const { db, client } = await connect();
      const videos = await db.collection("videos").find({ nome }).toArray();
      console.log("Vídeos encontrados:", videos);
      client.close();
      return videos;
    } catch (error) {
      console.log("Erro ao buscar vídeos:", error);
      logError(error);
    }
  }

  static async atualizar(id, novosDados) {
    try {
      const { db, client } = await connect();
      const result = await db.collection("videos").updateOne(
        { _id: new ObjectId(id) },
        { $set: novosDados }
      );
      console.log("Vídeo atualizado:", result.modifiedCount > 0);
      client.close();
    } catch (error) {
      console.log("Erro ao atualizar vídeo:", error);
      logError(error);
    }
  }

  static async deletar(id) {
    try {
      const { db, client } = await connect();
      const result = await db.collection("videos").deleteOne({ _id: new ObjectId(id) });
      console.log("Vídeo deletado:", result.deletedCount > 0);
      client.close();
    } catch (error) {
      console.log("Erro ao deletar vídeo:", error);
      logError(error);
    }
  }

  static async buscarTodos() {
    try {
      const { db, client } = await connect();
      const videos = await db.collection("videos").find().toArray();
      client.close();
      return videos;
    } catch (error) {
      console.log("Erro ao buscar todos os vídeos:", error);
      logError(error);
      return [];
    }
  }

}


module.exports = Videos;