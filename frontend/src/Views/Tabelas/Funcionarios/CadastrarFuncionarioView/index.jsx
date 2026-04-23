import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import {useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { maskCPF,maskTelefone } from "../../../../utils/mascaras";



function CadastrarFuncionarioView() {

    const [camposVazios,setCamposVazios] = useState({});
    const [form, setForm] = useState({
        nome: "",
        usuario: "",
        senha: "",
        confirmarSenha:"",
        cargo: "",
        cpf:"",
        telefone:""
    });
    const navigate = useNavigate();

    async function fetchCadastrarFuncionario(){
        const token = localStorage.getItem("token");
        let camposVazios = {
            nome: !form.nome,
            usuario: !form.usuario,
            senha: !form.senha,
            confirmarSenha: !form.confirmarSenha,
            cargo: !form.cargo,
            cpf: !form.cpf,
            telefone: !form.telefone
        };
        setCamposVazios(camposVazios);
        if (Object.values(camposVazios).includes(true)) return;
        if(form.confirmarSenha !== form.senha){
            camposVazios = {
                senha: true,
                confirmarSenha: true
            }
        }
        setCamposVazios(camposVazios);
        if (Object.values(camposVazios).includes(true)) return;
        try {
            const response = await fetch("http://localhost:3000/api/funcionarios/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome: form.nome,
                    usuario: form.usuario,
                    senha: form.senha,
                    cargo: form.cargo,
                    cpf: String(form.cpf).replace(/\D/g, ""),
                    telefone: String(form.telefone).replace(/\D/g, "")
                })
            });
            
            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return [];
            }

            if(response.ok){
                navigate("/tabelas/funcionarios");
            }else{
                const json = await response.json();
                alert(json.err || 'Erro desconhecido no servidor');
            }
        } catch (err) {
            alert("Erro ao gravar no banco: " + err.message);
        }
    }

    function atualizarForm(e){
        const { name, value } = e.target;
        let valor = value;
        if(name === 'cpf'){
            valor = maskCPF(value);
        }else if(name === 'telefone'){
            valor = maskTelefone(value);
        }
        setForm((prev) => ({
            ...prev,
            [name]: valor
        }));
    }

    return (
        <>
            <Header/>
            <main>
                <Styled.BackBtn>
                    <Link to={'/tabelas/funcionarios'}>
                        <div>
                            Voltar
                        </div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form noValidate>
                        <div>
                            <label htmlFor="nome">Nome: </label>
                            <input
                                name="nome"
                                value={form.nome}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.nome ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="usuario">Usuário: </label>
                            <input
                                name="usuario"
                                value={form.usuario}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.usuario ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="senha">Senha: </label>
                            <input
                                type="password"
                                name="senha"
                                value={form.senha}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.senha ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmaSenha">Confirmar senha: </label>
                            <input
                                type="password"
                                name="confirmarSenha"
                                value={form.confirmarSenha}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.confirmarSenha ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="cpf">CPF: </label>
                            <input
                                name="cpf"
                                value={form.cpf}
                                onChange={atualizarForm}
                                placeholder="000.000.000-00"
                                inputMode="numeric"
                                maxLength={14}
                                style={{ border: camposVazios.cpf ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="telefone">Telefone: </label>
                            <input
                                name="telefone"
                                value={form.telefone}
                                onChange={atualizarForm}
                                placeholder="(00) 00000-0000"
                                inputMode="numeric"
                                maxLength={15}
                                required
                                style={{ border: camposVazios.telefone ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="cargo">Cargo:</label>
                            <select
                                name="cargo"
                                value={form.cargo}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.cargo ? "2px solid red" : "" }}
                            >
                                <option value="" selected disabled>Selecione</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Voluntario">Voluntário</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={fetchCadastrarFuncionario}
                        >
                            Cadastrar
                        </button>
                </Styled.Form>
            </main>
            <Footer/>
        </>
    );
}

export default CadastrarFuncionarioView;