import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CadastrarEstoqueView() {
    async function fetchCadastrarEstoque(){
        try {
            const response = await fetch("http://localhost:3000/estoque/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    descricao: form.descricao,
                    qtde: form.qtde,
                    validade: form.validade || null
                })
            });
            if(response.ok){
                navigate("/tabelas/estoque");
            }else{
                const json = await response.json(); 
                console.log(json);
                setErros(json.campos || {});
                alert(json.err || 'Erro desconhecido no servidor');
            }
        } catch (error) {
            alert("Erro ao atualizar");
        }
    }

    function atualizarForm(e){
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const [erros,setErros] = useState({});
    const [form, setForm] = useState({
        id:0,
        descricao: "",
        qtde: "",
        validade: ""
    });
    const navigate = useNavigate();

    return (
        <>
            <Header/>
            <main>
                <Styled.BackBtn>
                    <Link to={'/tabelas/estoque'}>
                        <div>
                            Voltar
                        </div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form>
                    <div>
                        <label htmlFor="descricao">Descricão: </label>
                        <input
                            type="text"
                            name="descricao"
                            value={form.descricao}
                            onChange={atualizarForm}
                            style={{ border: erros.est_descricao ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="qtde">Quantidade: </label>
                        <input
                            type="number"
                            name="qtde"
                            value={form.qtde}
                            onChange={atualizarForm}
                            style={{ border: erros.est_qtde ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="validade">Validade: </label>
                        <input
                            type="date"
                            name="validade"
                            value={form.validade}
                            onChange={atualizarForm}
                            style={{ border: erros.est_validade ? "2px solid red" : "" }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={fetchCadastrarEstoque}
                    >
                        Cadastrar
                    </button>
                </Styled.Form>
            </main>
            <Footer/>
        </>
    );
}

export default CadastrarEstoqueView;
