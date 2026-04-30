import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function dataAtual() {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function CadastrarCaixasView() {
    async function fetchAbrirCaixa() {
        try {
            const response = await fetch("http://localhost:3000/caixas/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: form.data,
                    turno: form.turno,
                    suprimentoInicial: form.suprimentoInicial
                })
            });

            if (response.ok) {
                setErros({});
                navigate("/tabelas/caixas");
            } else {
                const json = await response.json();
                setErros(json.campos || {});
                alert(json.err || json.erro || "Erro desconhecido no servidor");
            }
        } catch (error) {
            alert("Erro ao abrir caixa");
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
        data: dataAtual(),
        turno: "",
        suprimentoInicial: ""
    });
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <main>
                <Styled.BackBtn>
                    <Link to={"/tabelas/caixas"}>
                        <div>Voltar</div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form noValidate>
                    <div>
                        <label htmlFor="data">Data:</label>
                        <input
                            type="date"
                            name="data"
                            value={form.data}
                            onChange={atualizarForm}
                            style={{ border: erros.cai_data ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="turno">Turno:</label>
                        <select
                            name="turno"
                            value={form.turno}
                            onChange={atualizarForm}
                            style={{ border: erros.cai_turno ? "2px solid red" : "" }}
                        >
                            <option value="">Selecione um turno...</option>
                            <option value="Manha">Manha</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noite">Noite</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="suprimentoInicial">Valor inicial:</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="suprimentoInicial"
                            value={form.suprimentoInicial}
                            onChange={atualizarForm}
                            style={{ border: erros.cai_suprimentoInicial ? "2px solid red" : "" }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={fetchAbrirCaixa}
                    >
                        Abrir Caixa
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default CadastrarCaixasView;
