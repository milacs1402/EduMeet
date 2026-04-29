import React from 'react'
import '../styles/cadastro.css'
import { Link } from 'react-router-dom'
import { useState } from 'react';

function Cadastro() {

  const [form, setForm] = useState({
    name: '', lastname: '', ra: '', rg: '',
    cel1: '', cel2: '', email: '', end: '', cep: '', bday: ''
  });
  const [foto, setFoto] = useState(null);

  // Atualiza o campo certo conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFoto = (e) => {
    setFoto(e.target.files[0]);
  };

  // Envia os dados para o servidor quando o form é submetido
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData envia texto e arquivo juntos
    const formData = new FormData();

    // adiciona cada campo do form
    Object.keys(form).forEach(campo => {
      formData.append(campo, form[campo]);
    });

    // adiciona a foto
    if (foto) formData.append('foto', foto);

    try {
      const resposta = await fetch('http://localhost:3001/cadastro', {
        method: 'POST',
        body: formData
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        // Cai aqui se vier 409 (duplicado) ou 500 (erro)
        alert(data.mensagem); // "RA já cadastrado!" ou "RG já cadastrado!"
        return;
      }

      alert(data.mensagem); // "Cadastrado com sucesso!"

    } catch (err) {
      alert('Erro ao conectar com o servidor.');
    }
  };

  const handleReset = () => {
  setForm({
    name: '', lastname: '', ra: '', rg: '',
    cel1: '', cel2: '', email: '', end: '', cep: '', bday: ''
  });
  };

  return (
    <section className='cadastro'>
      <h2>Preencha as informações abaixo:</h2>

      <form onSubmit={handleSubmit}>

        <div className='esquerda'>

          <div className='nome'>

            <input type="text" id='name'     name="name"    required   placeholder='Nome'  value={form.name}     onChange={handleChange}/>

            <input type="text" id='lastname' name="lastname"  required   placeholder='Sobrenome' value={form.lastname} onChange={handleChange}/>

          </div>
        
          <div className='registros'>

            <input type="text" id='RA' name="ra" required   placeholder='RA' value={form.ra} onChange={handleChange}/>

            <input type="text" id='RG' name="rg" required   placeholder='RG' value={form.rg} onChange={handleChange}/>

          </div>

          <div className='telefone'>

            <input type="text" id="cel1" name="cel1" required   placeholder='Telefone 1' value={form.cel1} onChange={handleChange}/>

            <input type="text" id="cel2" name="cel2"  placeholder='Telefone 2' value={form.cel2} onChange={handleChange}/>

          </div>

          <input type="email" id='email'   name="email"    required   placeholder='Email' value={form.email} onChange={handleChange}/>

          <input type="text"  id="address" name="end"  required   placeholder='Endereço' value={form.end} onChange={handleChange}/>

          <input type="text"  id="CEP"     name="cep"       required   placeholder='CEP' value={form.cep} onChange={handleChange}/>

          <input type="date"  id="bday"    name="bday" required   value={form.bday} onChange={handleChange} />

        </div>

        <div className='direita'>

          <p>Envie uma foto:</p>

          <input type="file" id="foto" name="foto" accept="image/*" onChange={handleFoto}/>

        </div>

        <div className='form-buttons'>

            <Link to='/Home'><input type="submit" id='button' value='Cadastrar'/></Link>

            <input type="button" id='button' value='Limpar'onClick={handleReset}/>
            
        </div>

        <Link className='voltar' to='/home'>Voltar ao início</Link>

      </form>
    </section>
    
  )
}

export default Cadastro
