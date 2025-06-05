const fs = require("fs");
const path = require("path");

const pastaLogs = path.join(__dirname, "logs");
if (!fs.existsSync(pastaLogs)) {
  fs.mkdirSync(pastaLogs);
}

const caminhoArquivoLog = path.join(pastaLogs, "errors.log");

function registrarError(error) {
  const dataHora = new Date().toISOString();
  const mensagemLog = `[${dataHora}] ${error.stack || error.message || error}\n\n`;
  fs.appendFile(caminhoArquivoLog, mensagemLog, (errorInterno) => {
    if (errorInterno) {
      console.error("Erro ao registrar log:", errorInterno);
    }
  });
}

module.exports = { registrarError };
