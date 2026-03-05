import React from 'react'
import '../styles/cover.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Cover() {

 const navigate = useNavigate();

  return (
    <div className='cover-div'>
      <motion.img  
        layoutId="main-logo" 
        src="src\assets\EduIcon.png" 
        alt="Logo do Site"
        animate={{
          scale: [1, 1.1, 1, 1.1, 1], 
        }}
        transition={{
          duration: 3, 
          ease: "easeInOut",
        }}
        
        onAnimationComplete={() => {
          navigate('/home');
        }}
        />
    </div>
  )
}

export default Cover
