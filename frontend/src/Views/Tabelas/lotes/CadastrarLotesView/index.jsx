import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CadastrarLotesView() {
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

    async function fetchCadastrarLote() {
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
            const response = await fetch("http://localhost:3000/lotes/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idItem: form.idItem,
                    unidadeMed: form.unidadeMed,
                    data: form.data || null,
                    quantidade: form.quantidade
                })
            });
            if (response.ok) {
                alert("Lote cadastrado com sucesso!");
                setForm({
                    idItem: "",
                    unidadeMed: "",
                    data: "",
                    quantidade: ""
                });
            } else {
                const json = await response.json();
                alert(json.err || "Erro desconhecido no servidor");
            }
        } catch (error) {
            alert("Erro ao cadastrar lote");
        }
    }

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const [itens, setItens] = useState([]);
    const [camposVazios, setCamposVazios] = useState({});
    const [form, setForm] = useState({
        idItem: "",
        unidadeMed: "",
        data: "",
        quantidade: ""
    });

    useEffect(() => {
        async function carregarItens() {
            try {
                const response = await fetch("http://localhost:3000/itens/listar", {
                    method: "GET"
                });
                const data = await response.json();
                if (response.ok) {
                    console.log(data);
                    if (data.length === 0)
                        alert("Nenhum item cadastrado!");
                    setItens(data);
                }
            } catch (error) {
                alert("Erro ao carregar itens");
            }
        }
        carregarItens();
    }, []);

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

                    <button type="button" onClick={fetchCadastrarLote}>
                        Cadastrar
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default CadastrarLotesView;