import React from 'react'
import '../styles/home.css'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react';
import EduIcon from '../assets/EduIcon.png';

function Home() {
  return (
    <section className='home'>
      <div className='logo-esquerda'>
        <motion.img  
          layoutId="main-logo" 
          src={EduIcon} 
          alt="Logo do Site" 
          transition={{ type: "tween", stiffness: 0, damping: 15 }}
          />
      </div>

      <div className='menu-direita'>
        <div className='container'>
          <h2>Bem-vindo!</h2>

          <div className='buttons'>
            <Link to='/cadastro'><button>Novo Cadastro</button></Link>
            <Link to='/busca'><button>Procurar Cadastro</button></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
