import React from 'react'
import '../styles/busca.css'
import {useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function Busca() {

    const [busca, setBusca] = useState('');
    const [resultados, setResultados] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        if(busca ===''){
            setResultados([]);
            return;
        }

        fetch(`http://localhost:3001/alunos?busca=${busca}`)
        .then(res => res.json())
        .then(data => setResultados(data))
        .catch(err => console.error(err));

    }, [busca]);

    return(
        <section className='busca-section'>
            <h2>Busque por nome ou RA:</h2>

            <div className='busca-area'>
                <input 
                type="search" 
                placeholder="Digite o nome ou RA..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}/> 
                {/* Quando o input mudar, pega o evento (e), acessa o elemento que mudou (e.target), pega o valor dele (e.target.value) e salva no estado de busca */}
                <button>Buscar</button>

            </div>
            
            <ul>
                {resultados.map(Alunos_unesp => (
                        <li  key={Alunos_unesp.id_aluno} onClick={() => navigate(`/dados-aluno/${Alunos_unesp.id_aluno}`)}>
                            {Alunos_unesp.name} {Alunos_unesp.lastname} - RA: {Alunos_unesp.ra}
                        </li>
                ))}
            </ul>
            
            <Link className='voltarInicio' to='/home'>Voltar ao início</Link>
        </section>
    )
}

export default Busca
