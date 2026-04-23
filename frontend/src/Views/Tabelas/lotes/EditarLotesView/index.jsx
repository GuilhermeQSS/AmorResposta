import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function EditarLotesView() {
    async function fetchItens() {
        try {
            const response = await fetch("http://localhost:3000/itens/listar", {
                method: "GET"
            });
            const data = await response.json();
            if (response.ok) setItens(data);
        } catch (error) {
            alert("Erro ao carregar itens");
        }
    }

    function fetchLoteId(id) {
        return fetch(`http://localhost:3000/lotes/buscar?id=${id}`, {
            method: "GET"
        })
        .then((response) => response.json())
        .catch((error) => alert(error));
    }

    async function fetchAlterarLote() {
        const camposVazios = {
            idItem: !form.idItem,
            unidadeMed: !form.unidadeMed,
            quantidade: !form.quantidade,
        };
        setCamposVazios(camposVazios);
        if (Object.values(camposVazios).includes(true)) {
            alert("Preencha todos os campos!");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/lotes/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id,
                    idItem: form.idItem,
                    unidadeMed: form.unidadeMed,
                    data: form.data || null,
                    quantidade: form.quantidade
                })
            });
            if (response.ok) {
                alert("Alterado com sucesso");
                setFormOriginal(form);
            } else {
                const json = await response.json();
                alert(json.err || "Erro desconhecido no servidor");
            }
        } catch (err) {
            alert("Erro ao alterar");
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
    const [itens, setItens] = useState([]);
    const [camposVazios, setCamposVazios] = useState({});
    const [editado, setEditado] = useState(false);
    const [form, setForm] = useState({
        id: 0,
        idItem: "",
        unidadeMed: "",
        data: "",
        quantidade: ""
    });
    const [formOriginal, setFormOriginal] = useState({
        id: 0,
        idItem: "",
        unidadeMed: "",
        data: "",
        quantidade: ""
    });

    useEffect(() => {
        async function carregar() {
            await fetchItens();
            const data = await fetchLoteId(id);
            console.log(data); // veja o que vem aqui

            const dataFormatada = data.lot_validade
                ? new Date(data.lot_validade).toISOString().split("T")[0]
                : "";

            const loteForm = {
                id: data.lot_id ?? "",
                idItem: data.item_id ?? "",
                unidadeMed: data.lot_unidadeMedida ?? "",
                data: dataFormatada,
                quantidade: data.lot_qtde ?? ""
            };

            setForm(loteForm);
            setFormOriginal(loteForm);
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
                    <Link to={"/tabelas/lotes"}>
                        <div>Voltar</div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form>
                    <div>
                        <label htmlFor="idItem">Item: </label>
                        <select
                            name="idItem"
                            value={form.idItem}
                            onChange={atualizarForm}
                            disabled={itens.length === 0}
                            style={{ border: camposVazios.idItem ? "2px solid red" : "" }}
                        >
                            <option key="default" value="">
                                {itens.length === 0 ? "Nenhum item disponível" : "Selecione um item..."}
                            </option>
                            {itens.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="unidadeMed">Unidade de Medida: </label>
                        <input
                            type="text"
                            name="unidadeMed"
                            value={form.unidadeMed}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.unidadeMed ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="quantidade">Quantidade: </label>
                        <input
                            type="number"
                            name="quantidade"
                            value={form.quantidade}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.quantidade ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="data">Validade: </label>
                        <input
                            type="date"
                            name="data"
                            value={form.data}
                            onChange={atualizarForm}
                        />
                    </div>

                    <button
                        type="button"
                        disabled={!editado}
                        onClick={fetchAlterarLote}
                    >
                        Editar
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default EditarLotesView;