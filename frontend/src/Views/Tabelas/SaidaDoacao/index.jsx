import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Styled from "./styles";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SaidaDoacaoView() {
    const [beneficiarios, setBeneficiarios] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [camposVazios, setCamposVazios] = useState({});
    const [form, setForm] = useState({
        benId: "",
        data: "",
    });
    const [listaLotes, setListaLotes] = useState([
        { id: "", qtd: "" }
    ]);
    const lotesJaSelecionados = listaLotes.map((l) => l.id);
    useEffect(() => {
        async function carregarDados() {
            try {
                const [resBen, resLotes] = await Promise.all([
                    fetch("http://localhost:3000/beneficiarios/listar"),
                    fetch("http://localhost:3000/lotes/listarComItens"),
                ]);
                const dataBen = await resBen.json();
                console.log(dataBen);
                const dataLotes = await resLotes.json();

                if (resBen.ok) {
                    if (dataBen.length === 0) alert("Nenhum beneficiário cadastrado!");
                    else setBeneficiarios(dataBen);
                }
                if (resLotes.ok) {
                    if (dataLotes.length === 0) alert("Nenhum lote disponível!");
                    else setLotes(dataLotes);
                }
            } catch (error) {
                alert("Erro ao carregar dados");
            }
        }
        carregarDados();
    }, []);

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function atualizarLoteItem(index, field, value) {
        setListaLotes((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    }

    function adicionarLote() {
        const ultima = listaLotes[listaLotes.length - 1];

        if (!ultima.id) {
            alert("Selecione um lote antes de adicionar outro!");
            return;
        }
        if (!ultima.qtd || Number(ultima.qtd) <= 0) {
            alert("Informe uma quantidade válida antes de adicionar outro lote!");
            return;
        }
        const loteInfo = lotes.find((l) => l.lot_id === Number(ultima.id));
        if (loteInfo && Number(ultima.qtd) > loteInfo.lot_qtde) {
            alert(`Quantidade maior que o estoque disponível (${loteInfo.lot_qtde})!`);
            return;
        }
        setListaLotes((prev) => [...prev, { id: "", qtd: "" }]);
    }

    function removerLote(index) {
        setListaLotes((prev) => prev.filter((_, i) => i !== index));
    }

    async function fetchSaidaDoacao() {
        // Validação
        const vazios = {
            benId: !form.benId,
            listaLotes: listaLotes.some((l) => !l.id || !l.qtd || Number(l.qtd) <= 0),
        };
        setCamposVazios(vazios);
        if (Object.values(vazios).includes(true)) {
            alert("Preencha todos os campos corretamente!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/lotes/saida-doacao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    benId: form.benId,
                    data: form.data || null,
                    listaLotes: listaLotes.map((l) => ({
                        id: Number(l.id),
                        qtd: Number(l.qtd),
                    })),
                }),
            });

            if (response.ok) {
                alert("Saída de doação registrada com sucesso!");
                setForm({ benId: "", data: "" });
                setListaLotes([{ id: "", qtd: "" }]);
                setCamposVazios({});
            } else {
                const json = await response.json();
                alert(json.err || "Erro desconhecido no servidor");
            }
        } catch (error) {
            alert("Erro ao registrar saída de doação");
        }
    }

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
                    {/* Beneficiário */}
                    <div>
                        <label htmlFor="benId">Beneficiário: </label>
                            <select
                                name="benId"
                                value={form.benId}
                                onChange={atualizarForm}
                                disabled={beneficiarios.length === 0}
                                style={{ border: camposVazios.benId ? "2px solid red" : "" }}
                            >
                                <option value="">
                                    {beneficiarios.length === 0
                                        ? "Nenhum beneficiário disponível"
                                        : "Selecione um beneficiário..."}
                                </option>
                                {beneficiarios.map((b) => (
                                    <option key={`ben-${b.id}`} value={b.id}>
                                        {b.nome}
                                    </option>
                                ))}
                            </select>
                    </div>

                    {/* Data */}
                    <div>
                        <label htmlFor="data">Data efetiva da doação: </label>
                        <input
                            type="date"
                            name="data"
                            value={form.data}
                            onChange={atualizarForm}
                        />
                    </div>

                    {/* Lista de lotes */}
                    <div>
                        <label>Lotes doados:</label>
                        {listaLotes.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center",
                                    marginBottom: "8px",
                                    border: camposVazios.listaLotes ? "2px solid red" : "",
                                }}
                            >
                                <select
                                    value={item.id}
                                    onChange={(e) => atualizarLoteItem(index, "id", e.target.value)}
                                    disabled={lotes.length === 0}
                                >
                                    <option value="">Selecione um lote...</option>
                                        {lotes
                                            .filter((l) => !lotesJaSelecionados.includes(String(l.lot_id)) || l.lot_id === Number(item.id))
                                            .map((l) => (
                                                <option key={`lot-${l.lot_id}`} value={l.lot_id}>
                                                    {l.item_nome} — Lote #{l.lot_id}
                                                    {l.lot_validade ? ` | Val: ${new Date(l.lot_validade).toLocaleDateString("pt-BR")}` : " | Sem validade"}
                                                    {" "}| Estoque: {l.lot_qtde} {l.item_unidadeMedida}
                                                </option>
                                            ))
                                        }
                                </select>

                                <input
                                    type="number"
                                    placeholder="Quantidade"
                                    value={item.qtd}
                                    min={1}
                                    onChange={(e) => atualizarLoteItem(index, "qtd", e.target.value)}
                                />

                                {listaLotes.length > 1 && (
                                    <button type="button" onClick={() => removerLote(index)}>
                                        Remover
                                    </button>
                                )}
                            </div>
                        ))}

                        <button type="button" onClick={adicionarLote}>
                            + Adicionar lote
                        </button>
                    </div>

                    <button type="button" onClick={fetchSaidaDoacao}>
                        Registrar saída
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default SaidaDoacaoView;