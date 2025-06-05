const fs = require("fs");
const path = require("path");

const pastaLogs = path.join(__dirname, "logs");
if (!fs.existsSync(pastaLogs)) {
  fs.mkdirSync(pastaLogs);
}

const caminhoArquivoLog = path.join(pastaLogs, "erros.log");

function registrarErro(erro) {
  const dataHora = new Date().toISOString();
  const mensagemLog = `[${dataHora}] ${erro.stack || erro.message || erro}\n\n`;
  fs.appendFile(caminhoArquivoLog, mensagemLog, (erroInterno) => {
    if (erroInterno) {
      console.error("Erro ao registrar log:", erroInterno);
    }
  });
}

module.exports = { registrarErro };
