import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CadastrarItensView() {
    async function fetchCadastrarItem(){
        const camposVazios = {
            descricao: !form.descricao,
            nome: !form.nome,
            tipo: !form.tipo,
        };
        setCamposVazios(camposVazios);
        if (Object.values(camposVazios).includes(true)) {
            alert("Preencha todos os campos!");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/itens/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    descricao: form.descricao,
                    nome: form.nome,
                    tipo: form.tipo,
                    possuiValidade: form.possuiValidade
                })
            });
            if(response.ok){
                alert("item cadastrado com sucesso!");
                    setForm({
                        descricao: "",
                        nome: "",
                        tipo: "",
                        possuiValidade: false
                    });
            }else{
                const json = await response.json(); 
                console.log(json);
                alert(json.err || 'Erro desconhecido no servidor');
            }
        } catch (error) {
            alert("Erro ao atualizar tabela");
        }
    }

    function atualizarForm(e){
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    }
    const [camposVazios,setCamposVazios] = useState({});
    const [form, setForm] = useState({
        id:0,
        descricao: "",
        nome: "",
        tipo: "",
        possuiValidade: false
    });
    //const navigate = useNavigate();

    return (
        <>
            <Header/>
            <main>
                <Styled.BackBtn>
                    <Link to={'/tabelas/itens'}>
                        <div>
                            Voltar
                        </div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form>
                    <div>
                        <label htmlFor="nome">Nome: </label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.nome ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="descricao">Descricão: </label>
                        <input
                            type="text"
                            name="descricao"
                            value={form.descricao}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.descricao ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="tipo">Tipo: </label>
                        <input
                            type="text"
                            name="tipo"
                            value={form.tipo}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.tipo ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="possuiValidade">Possui Validade</label>
                        <input
                        type="checkbox"
                        name="possuiValidade"
                        id="possuiValidade"
                        checked={form.possuiValidade}
                        onChange={atualizarForm}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={fetchCadastrarItem}
                    >
                        Cadastrar
                    </button>
                </Styled.Form>
            </main>
            <Footer/>
        </>
    );
}

export default CadastrarItensView;
