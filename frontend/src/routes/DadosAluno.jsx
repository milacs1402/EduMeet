import React from "react";
import '../styles/dadosAluno.css'
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function DadosAluno() {

    const { id } = useParams(); // pega o id da URL
    const [aluno, setAluno] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/alunos/${id}`)
        .then(res => res.json())
        .then(data => setAluno(data))
        .catch(err => console.error(err));
    }, [id]);

    if (!aluno) {
        return <p>Carregando...</p>;
    }

    return(
        <section className="dados-section">
            <div className="area-dados">

                <div className='esquerda-dados'>

                    <div className='nome'>

                        <h1>{aluno.name}</h1>
                        <h1>{aluno.lastname}</h1>

                    </div>
                    
                    <div className='registros'>

                        <p><strong>RA:</strong> {aluno.ra}</p>
                        <p><strong>RG:</strong> {aluno.rg}</p>

                    </div>

                    <div className='telefone'>

                        <p><strong>Telefone 1:</strong> {aluno.cel1}</p>
                        <p><strong>Telefone 2:</strong> {aluno.cel2}</p>

                    </div>

                    <p><strong>Email:</strong> {aluno.email}</p>
                    <p><strong>Endereço:</strong> {aluno.end}</p>
                    <p><strong>CEP:</strong> {aluno.cep}</p>
                    <p><strong>Data de Nascimento:</strong> {new Date(aluno.bday).toLocaleDateString('pt-BR')}</p>

                </div>

                <div className='direita-dados'>

                    

                </div>

                <div className='form-buttons-dados'>
                    <button>Editar</button>
                    <button>Excluir cadastro</button>
                </div>
            </div>

            <Link className='voltar-dados' to='/busca'>Voltar</Link>
        </section>
    )
}

export default DadosAluno;