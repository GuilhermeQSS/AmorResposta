import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatarTelefone } from "../../../../utils/telefone";

function CadastrarBeneficiarioView() {
    function validarFormulario() {
        return Object.entries(form)
            .filter(([campo, valor]) => campo !== "id" && !`${valor}`.trim())
            .map(([campo]) => campo);
    }

    async function fetchCadastrarBeneficiario(){
        const camposInvalidos = validarFormulario();
        if (camposInvalidos.length > 0) {
            alert("Preencha todos os campos antes de cadastrar.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/beneficiarios/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: form.nome.trim(),
                    endereco: form.endereco.trim(),
                    telefone: form.telefone.trim(),
                    usuario: form.usuario.trim(),
                    senha: form.senha.trim()
                })
            });

            if (!response.ok) {
                const json = await response.json();
                setErros(json.campos || {});
                throw new Error(json.err || json.erro || json.Erro || "Nao foi possivel cadastrar o beneficiario");
            }

            navigate("/tabelas/beneficiarios");
        } catch (error) {
            alert(error.message || "Erro ao cadastrar");
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
                            id="nome"
                            name="nome"
                            value={form.nome}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_nome ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="endereco">Endereco: </label>
                        <input
                            id="endereco"
                            name="endereco"
                            value={form.endereco}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_endereco ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="telefone">Telefone: </label>
                        <input
                            id="telefone"
                            name="telefone"
                            value={form.telefone}
                            onChange={atualizarForm}
                            inputMode="numeric"
                            placeholder="(00) 00000-0000"
                            maxLength="15"
                            style={{ border: erros.ben_telefone ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="usuario">Usuario: </label>
                        <input
                            id="usuario"
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
                            id="senha"
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
