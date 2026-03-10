// Importa os pacotes instalados (igual ao import do React)
const express = require('express');
const cors = require('cors');
const db = require('./db'); // a "tomada" no db.js
require('dotenv').config(); // lê o arquivo .env

// Cria o servidor
const app = express();

// Middlewares — funções que rodam em TODO pedido antes de chegar na rota
app.use(cors());         // libera o React (porta 3000) acessar o servidor
app.use(express.json()); // permite ler o corpo JSON que o React envia

// Define uma rota — quando o React fizer um POST para /cadastro, essa função roda
// req = o pedido que chegou (contém os dados do form)
// res = a resposta que você vai enviar de volta
app.post('/cadastro', async (req, res) => {
  const { name, lastname, ra, rg, cel1, cel2, email, end, cep, bday } = req.body;

   // Campos obrigatórios
  const obrigatorios = { name, lastname, ra, rg, cel1, email, end, cep, bday };
  const faltando = Object.keys(obrigatorios).filter(campo => !obrigatorios[campo]);

  if (faltando.length > 0) {
    return res.status(400).json({ 
      mensagem: `Preencha todos os campos obrigatórios.` 
    });
  }
  
  try {
    // Verifica se RA ou RG já existem no banco
    const [existe] = await db.execute(
      'SELECT id_aluno FROM Alunos_unesp WHERE ra = ? OR rg = ?',
      [ra, rg]
    );

    if (existe.length > 0) {
      // Descobre qual dos dois já está cadastrado
      const [raExiste] = await db.execute('SELECT id_aluno FROM Alunos_unesp WHERE ra = ?', [ra]);
      const [rgExiste] = await db.execute('SELECT id_aluno FROM Alunos_unesp WHERE rg = ?', [rg]);

      if (raExiste.length > 0) return res.status(409).json({ mensagem: 'RA já cadastrado!' });
      if (rgExiste.length > 0) return res.status(409).json({ mensagem: 'RG já cadastrado!' });
    }

    // Se não existe, cadastra normalmente
    const [result] = await db.execute(
      `INSERT INTO Alunos_unesp (name, lastname, ra, rg, cel1, cel2, email, end, cep, bday) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, lastname, ra, rg, cel1, cel2, email, end, cep, bday]
    );

    res.status(201).json({ mensagem: 'Cadastrado com sucesso!', id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao cadastrar.' });
  }
});

// Inicia o servidor na porta definida no .env 
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});