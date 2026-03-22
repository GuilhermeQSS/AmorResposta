import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditarDoacaoView() {
    function fetchDoacao(id) {
        return fetch(`http://localhost:3000/doacoes/buscar?id=${id}`, {
            method: "GET"
        })
            .then((response) => response.json())
            .catch((error) => alert(error));
    }

    async function fetchAlterarDoacao() {
        if (!form.dataEntrega || !form.formaEntrega || !form.tipo) {
            alert("Preencha data, tipo e forma de entrega.");
            return;
        }

        try {
            await fetch("http://localhost:3000/doacoes/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            setFormOriginal(form);
        } catch (error) {
            alert("Erro ao atualizar");
        }
    }

    async function fetchExcluirDoacao() {
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if (!confirmar) return;

        try {
            await fetch("http://localhost:3000/doacoes/excluir", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id
                })
            });

            navigate("/tabelas/doacoes");
        } catch (error) {
            alert("Erro ao excluir");
        }
    }

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        id: 0,
        doadorNome: "",
        dataEntrega: "",
        origem: "",
        formaEntrega: "",
        tipo: "",
        observacao: ""
    });
    const [formOriginal, setFormOriginal] = useState({
        id: 0,
        doadorNome: "",
        dataEntrega: "",
        origem: "",
        formaEntrega: "",
        tipo: "",
        observacao: ""
    });
    const [editado, setEditado] = useState(false);

    useEffect(() => {
        async function carregar() {
            const data = await fetchDoacao(id);
            setForm(data);
            setFormOriginal(data);
        }

        carregar();
    }, []);

    useEffect(() => {
        setEditado(JSON.stringify(form) !== JSON.stringify(formOriginal));
    }, [form, formOriginal]);

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
                            value={form.doadorNome || ""}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div>
                        <label htmlFor="dataEntrega">Data de entrada:</label>
                        <input
                            type="date"
                            name="dataEntrega"
                            value={form.dataEntrega ? String(form.dataEntrega).slice(0, 10) : ""}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div>
                        <label htmlFor="tipo">Tipo:</label>
                        <select
                            name="tipo"
                            value={form.tipo || ""}
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
                            value={form.origem || ""}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div>
                        <label htmlFor="formaEntrega">Forma de entrega:</label>
                        <select
                            name="formaEntrega"
                            value={form.formaEntrega || ""}
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
                            value={form.observacao || ""}
                            onChange={atualizarForm}
                            rows="4"
                        />
                    </div>

                    <button
                        type="button"
                        disabled={!editado}
                        onClick={fetchAlterarDoacao}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={fetchExcluirDoacao}
                    >
                        Excluir
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default EditarDoacaoView;
