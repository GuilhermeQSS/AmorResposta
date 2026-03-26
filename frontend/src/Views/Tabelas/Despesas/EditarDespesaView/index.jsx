import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditarDespesaView() {
    function fetchDespesa(id) {
        return fetch(`http://localhost:3000/despesas/buscar?id=${id}`, {
            method: "GET"
        })
            .then((response) => response.json())
            .catch((error) => alert(error));
    }

    async function fetchAlterarDespesa() {
        try {
            const response = await fetch("http://localhost:3000/despesas/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id,
                    valor: form.valor,
                    descricao: form.descricao
                })
            });

            if (response.ok) {
                setErros({});
                setFormOriginal(form);
            } else {
                const json = await response.json();
                setErros(json.campos || {});
                alert(json.err || json.erro || "Erro desconhecido no servidor");
            }
        } catch (error) {
            alert("Erro ao atualizar");
        }
    }

    async function fetchExcluirDespesa() {
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if (!confirmar) return;

        try {
            await fetch("http://localhost:3000/despesas/excluir", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id
                })
            });

            navigate("/tabelas/despesas");
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
    const [erros, setErros] = useState({});
    const [form, setForm] = useState({
        id: 0,
        valor: "",
        descricao: ""
    });
    const [formOriginal, setFormOriginal] = useState({
        id: 0,
        valor: "",
        descricao: ""
    });
    const [editado, setEditado] = useState(false);

    useEffect(() => {
        async function carregar() {
            const data = await fetchDespesa(id);
            if (!data) {
                return;
            }

            const despesa = { ...data, valor: data.valor ?? "" };
            setForm(despesa);
            setFormOriginal(despesa);
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
                        disabled={!editado}
                        onClick={fetchAlterarDespesa}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={fetchExcluirDespesa}
                    >
                        Excluir
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default EditarDespesaView;
