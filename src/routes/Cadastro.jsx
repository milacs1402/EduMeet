import React from 'react'
import '../styles/cadastro.css'
import { Link } from 'react-router-dom'

function Cadastro() {
  return (
    <section className='cadastro'>
      <h2>Preencha as informações abaixo:</h2>

      <form action="">
        <div className='esquerda'>
          <div className='nome'>
            <input type="text" id='name' placeholder='Nome'/>
            <input type="text" id='lastname' placeholder='Sobrenome'/>
          </div>

          <div className='registros'>
            <input type="text" id='RA' placeholder='RA'/>
            <input type="text" id='RG' placeholder='RG'/>
          </div>


          <div className='telefone'>
            <input type="text" id="cel1" placeholder='Telefone 1'/>
            <input type="text" id="cel2" placeholder='Telefone 2'/>
          </div>

          <input type="email" id='email' placeholder='Email'/>

          <input type="text" id="address" placeholder='Endereço'/>

          <input type="text" id="CEP" placeholder='CEP'/>

          <input type="date" id="bday" />
        </div>
        
        <div className='direita'>
          <p>Envie uma foto:</p>
          <input type="file" id="imagem" name="imagem" accept="image/*"/>
        </div>

        <div className='form-buttons'>
            <input type="submit" id='button' />
            <input type="reset" id='button'/>
        </div>

        <Link className='voltar' to='/home'>Voltar ao início</Link>

      </form>
    </section>
    
  )
}

export default Cadastro
