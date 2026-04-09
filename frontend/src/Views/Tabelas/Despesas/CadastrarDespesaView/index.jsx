import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CadastrarDespesaView() {
    async function fetchCadastrarDespesa() {
        try {
            const response = await fetch("http://localhost:3000/despesas/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    valor: form.valor,
                    descricao: form.descricao,
                })
            });

            if (response.ok) {
                setErros({});
                navigate("/tabelas/despesas");
            } else {
                const json = await response.json();
                setErros(json.campos || {});
                alert(json.err || json.erro || "Erro desconhecido no servidor");
            }
        } catch (error) {
            alert("Erro ao cadastrar");
        }
    }

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const [erros, setErros] = useState({});
    const [form, setForm] = useState({
        id: 0,
        valor: "",
        descricao: ""
    });
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <main>
                <Styled.BackBtn>
                    <Link to={"/tabelas/despesas"}>
                        <div>Voltar</div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form noValidate>
                    <div>
                        <label htmlFor="valor">Valor:</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="valor"
                            value={form.valor}
                            onChange={atualizarForm}
                            style={{ border: erros.des_valor ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="descricao">Descricao:</label>
                        <input
                            name="descricao"
                            value={form.descricao}
                            onChange={atualizarForm}
                            style={{ border: erros.des_descricao ? "2px solid red" : "" }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={fetchCadastrarDespesa}
                    >
                        Cadastrar
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default CadastrarDespesaView;
