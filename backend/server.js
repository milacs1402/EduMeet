const express = require('express');
const cors = require('cors');
const db = require('./db'); // a "tomada" no db.js
require('dotenv').config(); // lê o arquivo .env
const multer = require('multer');
const path = require('path');

const multerStorageCloudinary = require('multer-storage-cloudinary');
const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage;

// Configura o Cloudinary com as credenciais do .env
CloudinaryStorage.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define o Cloudinary como destino do multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'edumeet', // pasta no Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });

// Cria o servidor
const app = express();

// Middlewares — funções que rodam em TODO pedido antes de chegar na rota
app.use(cors());         // libera o React (porta 3000) acessar o servidor
app.use(express.json()); // permite ler o corpo JSON que o React envia

// req = o pedido que chegou (contém os dados do form)
// res = a resposta que você vai enviar de volta
app.post('/cadastro', upload.single('foto'), async (req, res) => {
  const { name, lastname, ra, rg, cel1, cel2, email, end, cep, bday } = req.body;
  const foto = req.file ? req.file.path : null;

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
      `INSERT INTO Alunos_unesp (name, lastname, ra, rg, cel1, cel2, email, end, cep, bday, foto) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, lastname, ra, rg, cel1, cel2, email, end, cep, bday, foto]
    );

    res.status(201).json({ mensagem: 'Cadastrado com sucesso!', id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao cadastrar.' });
  }
});

app.get('/alunos', async (req, res) => {
  const { busca } = req.query;

  try {
    const [rows] = await db.execute(
      `SELECT * FROM Alunos_unesp 
       WHERE name LIKE ? OR ra LIKE ?
       ORDER BY name ASC`,
      [`%${busca || ''}%`, `%${busca || ''}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao buscar.' });
  }
});

app.get('/alunos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM Alunos_unesp WHERE id_aluno = ?',
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao buscar aluno.' });
  }
});

app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;

  try{
    const [result] = await db.execute(
      'DELETE FROM Alunos_unesp WHERE id_aluno = ?',
      [id]
    );

    res.json({ mensagem: 'Aluno excluído com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao excluir aluno.' });
  }
});

app.put('/alunos/:id', upload.single('foto'), async (req, res) => {
  const { id } = req.params;
  const { name, lastname, ra, rg, cel1, cel2, email, end, cep, bday } = req.body;

  // se enviou foto nova, usa ela — senão mantém a que já estava
  const foto = req.file ? req.file.path : req.body.fotoAtual;

  try {
    await db.execute(
      `UPDATE Alunos_unesp SET 
        name=?, lastname=?, ra=?, rg=?, cel1=?, cel2=?, email=?, end=?, cep=?, bday=?, foto=?
       WHERE id_aluno=?`,
      [name, lastname, ra, rg, cel1, cel2, email, end, cep, bday, foto, id]
    );
    res.json({ mensagem: 'Atualizado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao atualizar.' });
  }
});

// Inicia o servidor na porta definida no .env 
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});