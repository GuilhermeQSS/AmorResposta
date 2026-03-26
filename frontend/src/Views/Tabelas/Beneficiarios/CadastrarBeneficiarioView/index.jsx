import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatarTelefone, limparTelefone } from "../../../../utils/telefone";

function CadastrarBeneficiarioView() {
    async function fetchCadastrarBeneficiario(){
        try {
            const response = await fetch("http://localhost:3000/beneficiarios/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: form.nome,
                    endereco: form.endereco,
                    telefone: limparTelefone(form.telefone),
                    usuario: form.usuario,
                    senha: form.senha
                })
            });
            if(response.ok){
                setErros({});
                navigate("/tabelas/beneficiarios");
            }else{
                const json = await response.json();
                setErros(json.campos || {});
                alert(json.err || "Erro desconhecido no servidor");
            }
        } catch (error) {
            alert("Erro ao atualizar");
        }
    }

    function atualizarForm(e){
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "telefone" ? formatarTelefone(value) : value
        }));
    }

    const [erros,setErros] = useState({});
    const [form, setForm] = useState({
        id:0,
        nome: "",
        endereco: "",
        telefone: "",
        usuario: "",
        senha: ""
    });
    const navigate = useNavigate();

    return (
        <>
            <Header/>
            <main>
                <Styled.BackBtn>
                    <Link to={'/tabelas/beneficiarios'}>
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
                            style={{ border: erros.ben_nome ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="endereco">Endereco: </label>
                        <input
                            name="endereco"
                            value={form.endereco}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_endereco ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="telefone">Telefone: </label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            name="telefone"
                            value={form.telefone}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_telefone ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="usuario">Usuario: </label>
                        <input
                            name="usuario"
                            value={form.usuario}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_usuario ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="senha">Senha: </label>
                        <input
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_senha ? "2px solid red" : "" }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={fetchCadastrarBeneficiario}
                    >
                        Cadastrar
                    </button>
                </Styled.Form>
            </main>
            <Footer/>
        </>
    );
}

export default CadastrarBeneficiarioView;
