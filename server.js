// Carregando as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Usando as variáveis de ambiente
const senhaAdm = process.env.SENHA_ADM

const express = require('express');
const app = express();
const porta = 1313;

// Middleware para analisar corpos JSON
app.use(express.json());

// Middleware para analisar dados de formulário URL-encoded
app.use(express.urlencoded({ extended: true }));

// Configurando CORS
app.use((req, res , next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        res.header('Access-Control-Allow-Methods', 'PUT, PATCH, DELETE, GET, POST')
        return res.status(200).send({})
    }
    next()
})

// Recebendo requisição de POST para ver se senha está correta
app.post('/senha_adm', (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ erro: 'Corpo da solicitação vazio' });
    }
    const dadosDoCorpo = req.body;
    if (dadosDoCorpo.senha == senhaAdm) {
        res.status(200).json({acerto:true});
    } else {
        res.status(200).json({acerto:false});
    }
  } catch (erro) {
    console.error('Erro ao processar a solicitação:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Ouvindo porta no 1313
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});