// Carregando as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Usando as variáveis de ambiente
const senhaAdm = process.env.SENHA_ADM

const express = require('express');
const app = express();
const porta = 1313;
const path = require('path');
const fs = require('fs').promises;

//coisas do sqlite pra fzr funcionar o sqlite, e criação das tabelas principais
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("./database.sqlite", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message)
})
db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='midia'`, (err, row) => {
  if (err) {
    console.error(err.message);
  } else if (!row) {
    const sql = 'CREATE TABLE midia(id INTERGER PRIMARY KEY,idObra,tipoObra,avaliacao,comentario)'
    db.run(sql)
  }
});
db.close()

// Middleware para analisar corpos JSON
app.use(express.json());

// Middleware para analisar dados de formulário URL-encoded
app.use(express.urlencoded({ extended: true }));

// Define o diretório onde os arquivos estáticos (como HTML) estão localizados
app.use(express.static(path.join(__dirname, 'public')));

// Configurando CORS
app.use((req, res , next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
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
app.post('/senha_adm', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ erro: 'Corpo da solicitação vazio' });
    }
    const dadosDoCorpo = req.body;
    if (dadosDoCorpo.senha == senhaAdm) {
        const caminhoArquivo = path.join(__dirname, 'public', 'admin_dashboard.html')
        const conteudoArquivo = await fs.readFile(caminhoArquivo, 'utf-8');
        res.status(200).json({acerto:true, arquivo:conteudoArquivo, senha:senhaAdm})
    } else {
        res.status(200).json({acerto:false, arquivo:'nada seu merda', senha:'nada seu merda'});
    }
  } catch (erro) {
    console.error('Erro ao processar a solicitação:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Recebendo requisição de POST para adicionar o conteudo/obras ao seu repertório pessoal(banco de dados, refúgio da inspiração, oq vc preferir chamar:D)
app.post('/post', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ erro: 'Corpo da solicitação vazio' });
    }
    const dadosDoCorpo = req.body;
    if (dadosDoCorpo.obra.senha == senhaAdm) {
      console.log(dadosDoCorpo.obra.id, dadosDoCorpo.obra.tipoObra,  dadosDoCorpo.obra.avaliacao, dadosDoCorpo.obra.comentario)
      res.status(200).json({resposta: 'Sucesso ao inserir obra ao banco de dados!'})
    } else {
      res.status(200).json({resposta: 'Fracasso ao inserir obra ao banco de dados! Motivo: senha incorreta. Por acaso vc acha q vai conseguir fzr postagens sem minha permissão? Seu malandro cavajeste.'});
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