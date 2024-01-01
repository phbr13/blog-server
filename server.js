// Carregando as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Usando as variáveis de ambiente
const senhaAdm = process.env.SENHA_ADM

const express = require('express');
const app = express();
const porta = 3000;

// Middleware para analisar corpos JSON
app.use(express.json());

// Middleware para analisar dados de formulário URL-encoded
app.use(express.urlencoded({ extended: true }));

app.post('/exemplo-rota', (req, res) => {
  try {
    // Verificar se há dados no corpo da solicitação
    if (!req.body) {
      return res.status(400).json({ erro: 'Corpo da solicitação vazio' });
    }
    // O corpo da solicitação está disponível em req.body
    const dadosDoCorpo = req.body;
    console.log(dadosDoCorpo);

    res.status(200).send('Solicitação recebida com sucesso!');
  } catch (erro) {
    console.error('Erro ao processar a solicitação:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});