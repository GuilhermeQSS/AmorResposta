import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function formatarDataInput(data) {
    if (!data) return "";
    return String(data).split("T")[0];
}

function EditarCaixasView() {
    async function fetchCaixa() {
        try {
            const response = await fetch(`http://localhost:3000/caixas/buscar?id=${id}`, {
                method: "GET"
            });
            const data = await response.json();

            if (response.ok) {
                setForm({
                    id: data.id,
                    data: formatarDataInput(data.data),
                    turno: data.turno,
                    suprimentoInicial: data.suprimentoInicial,
                    status: data.status
                });
            } else {
                alert(data.erro || "Erro ao buscar caixa");
            }
        } catch (error) {
            alert("Erro ao buscar caixa");
        }
    }

    async function fetchAlterarCaixa() {
        try {
            const response = await fetch("http://localhost:3000/caixas/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
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
            alert("Erro ao alterar caixa");
        }
    }

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const { id } = useParams();
    const [erros, setErros] = useState({});
    const [form, setForm] = useState({
        id: 0,
        data: "",
        turno: "",
        suprimentoInicial: "",
        status: "aberto"
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCaixa();
    }, [id]);

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

                    <div>
                        <label htmlFor="status">Status:</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={atualizarForm}
                        >
                            <option value="aberto">Aberto</option>
                            <option value="fechado">Fechado</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={fetchAlterarCaixa}
                    >
                        Salvar Caixa
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default EditarCaixasView;
