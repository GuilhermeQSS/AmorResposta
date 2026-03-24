import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CadastrarDoacaoView() {
    async function fetchCadastrarDoacao() {
        if (!form.dataEntrega || !form.formaEntrega || !form.tipo) {
            alert("Preencha data, tipo e forma de entrega.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/doacoes/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.erro || "Erro ao cadastrar doacao");
            }

            navigate("/tabelas/doacoes");
        } catch (error) {
            alert(error.message);
        }
    }

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const [form, setForm] = useState({
        doadorNome: "",
        dataEntrega: "",
        origem: "",
        formaEntrega: "",
        tipo: "",
        observacao: ""
    });
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <main>
                <Styled.BackBtn>
                    <Link to={"/tabelas/doacoes"}>
                        <div>Voltar</div>
                    </Link>
                </Styled.BackBtn>

                <Styled.Form>
                    <div>
                        <label htmlFor="doadorNome">Doador:</label>
                        <input
                            name="doadorNome"
                            value={form.doadorNome}
                            onChange={atualizarForm}
                            placeholder="Nome do doador ou empresa"
                        />
                    </div>

                    <div>
                        <label htmlFor="dataEntrega">Data de entrada:</label>
                        <input
                            type="date"
                            name="dataEntrega"
                            value={form.dataEntrega}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div>
                        <label htmlFor="tipo">Tipo:</label>
                        <select
                            name="tipo"
                            value={form.tipo}
                            onChange={atualizarForm}
                        >
                            <option value="">Selecione</option>
                            <option value="Alimentos">Alimentos</option>
                            <option value="Roupas">Roupas</option>
                            <option value="Higiene">Higiene</option>
                            <option value="Materiais">Materiais diversos</option>
                            <option value="Financeira">Financeira</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="origem">Origem:</label>
                        <input
                            name="origem"
                            value={form.origem}
                            onChange={atualizarForm}
                            placeholder="Campanha, parceiro, coleta..."
                        />
                    </div>

                    <div>
                        <label htmlFor="formaEntrega">Forma de entrega:</label>
                        <select
                            name="formaEntrega"
                            value={form.formaEntrega}
                            onChange={atualizarForm}
                        >
                            <option value="">Selecione</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Coleta">Coleta</option>
                            <option value="Transferencia">Transferencia</option>
                            <option value="Entrega externa">Entrega externa</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="observacao">Observacao:</label>
                        <textarea
                            name="observacao"
                            value={form.observacao}
                            onChange={atualizarForm}
                            rows="4"
                            placeholder="Detalhes importantes da doacao"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={fetchCadastrarDoacao}
                    >
                        Cadastrar
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default CadastrarDoacaoView;