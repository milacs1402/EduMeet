import React from "react";
import '../styles/dadosAluno.css'
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DadosAluno() {

    const { id } = useParams(); // pega o id da URL
    const [aluno, setAluno] = useState(null);
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [fotoNova, setFotoNova] = useState(null);

    const handleDelete = async() => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este cadastro?");

        if (!confirmacao) return;

        try{
            const response = await fetch(`http://localhost:3001/alunos/${id}`, {
                method: 'DELETE'
        });

        const data = await response.json();
        alert(data.mensagem);
        navigate('/busca');

        }catch(err){

        console.error(err);
        alert("Erro ao excluir cadastro.");

        }
    };

    const handleEdit = async() => {
        setEditMode(true);
        setForm({
            name: aluno.name,
            lastname: aluno.lastname,
            ra: aluno.ra,
            rg: aluno.rg,
            cel1: aluno.cel1,
            cel2: aluno.cel2,
            email: aluno.email,
            end: aluno.end,
            cep: aluno.cep,
            bday: aluno.bday
        })
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSalvar = async () => {
        const formData = new FormData();

        // adiciona os campos de texto
        Object.keys(form).forEach(campo => {
            formData.append(campo, form[campo]);
        });

        // se tem foto nova, envia ela — senão manda o nome da foto atual
        if (fotoNova) {
            formData.append('foto', fotoNova);
        } else {
            formData.append('fotoAtual', aluno.foto);
        }

        try {
            const resposta = await fetch(`http://localhost:3001/alunos/${id}`, {
            method: 'PUT',
            body: formData // sem Content-Type!
            });

            const data = await resposta.json();
            alert(data.mensagem);
            setAluno({ ...form, foto: fotoNova ? URL.createObjectURL(fotoNova) : aluno.foto });
            setEditMode(false);
        } catch (err) {
            alert('Erro ao salvar.');
        }
    };

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

            {editMode ? (
                // MODO EDIÇÃO — inputs preenchidos
                <div className='esquerda-dados'>
                    <input name="name"     value={form.name}     onChange={handleChange} />
                    <input name="lastname" value={form.lastname}  onChange={handleChange} />
                    <input name="ra"       value={form.ra}        onChange={handleChange} />
                    <input name="rg"       value={form.rg}        onChange={handleChange} />
                    <input name="cel1"     value={form.cel1}      onChange={handleChange} />
                    <input name="cel2"     value={form.cel2}      onChange={handleChange} placeholder="telefone 2"/>
                    <input name="email"    value={form.email}     onChange={handleChange} />
                    <input name="end"      value={form.end}       onChange={handleChange} />
                    <input name="cep"      value={form.cep}       onChange={handleChange} />
                    <input name="bday"     value={form.bday}      onChange={handleChange} type="date"/>
                </div> ) : (
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
                )}

                {editMode ? (
                    <div className='direita-dados'>
                        <input name="foto" onChange={(e) => setFotoNova(e.target.files[0])} type="file" accept="image/*" />
                    </div>
                ) : (
                    <div className='direita-dados'>
                        {aluno.foto? (
                            <img src={`http://localhost:3001/uploads/${aluno.foto}`} alt="Foto do aluno" className="foto-aluno"/>
                        ) : (
                            <p>Aluno sem foto cadastrada</p>
                        )}
                    </div>
                )}

                {editMode? (
                    <div className='form-buttons-dados'>
                        <button onClick={handleSalvar}>Salvar Alterações</button>
                    </div>
                ):(
                    <div className='form-buttons-dados'>
                        <button onClick={handleEdit}>Editar</button>
                        <button onClick={handleDelete}>Excluir cadastro</button>
                    </div>
                )}
                
            </div>

            {editMode? (
                    <button className='voltar-dados' onClick={() => setEditMode(false)}>Cancelar</button>
                ):(
                    <Link className='voltar-dados' to='/busca'>Voltar</Link>
                )}

            
        </section>
    )
}

export default DadosAluno;