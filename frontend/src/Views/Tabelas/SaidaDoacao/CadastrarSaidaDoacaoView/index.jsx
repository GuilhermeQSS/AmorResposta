import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AutocompleteBen from "../autoCompleteBen";
import ModalLotes from "../ModalLotes";

function SaidaDoacaoView() {
    const [beneficiarios, setBeneficiarios] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [camposVazios, setCamposVazios] = useState({});
    const [form, setForm] = useState({
        benId: "",
        data: "",
    });
    const [listaLotes, setListaLotes] = useState([]);
    useEffect(() => {
        async function carregarDados() {
            try {
                const resBen = await fetch("http://localhost:3000/beneficiarios/listar");
                const dataBen = await resBen.json();
                if (resBen.ok) {
                    if (dataBen.length === 0) alert("Nenhum beneficiário cadastrado!");
                    else setBeneficiarios(dataBen);
                }
                await carregarLotes();
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

    async function carregarLotes() {
        const resLotes = await fetch("http://localhost:3000/lotes/listarComItens");
        const dataLotes = await resLotes.json();
        if (resLotes.ok && dataLotes.length > 0)
            setLotes(dataLotes);
    }

    async function fetchSaidaDoacao() {
        // Validação
        console.log("form.benId:", form.benId);
        console.log("body:", {
            benId: form.benId,
            data: form.data || null,
            listaLotes: listaLotes.map(l => ({ id: l.id, qtd: Number(l.qtd) }))
        });
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
            const response = await fetch("http://localhost:3000/saidaDoacao/cadastrar", {
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
                setListaLotes([]);
                setCamposVazios({});
                await carregarLotes();
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
                    <Link to={"/tabelas/saidaDoacao"}>
                        <div>Voltar</div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form>
                    {/* Beneficiário */}
                    <div>
                        <label>Beneficiário: </label>
                        <AutocompleteBen
                            beneficiarios={beneficiarios}
                            value={form.benId}
                            onChange={(id) => setForm(prev => ({ ...prev, benId: id }))}
                            erro={camposVazios.benId}
                        />
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
                        <ModalLotes
                                lotes={lotes}
                                lotesJaSelecionados={listaLotes}
                                onConfirmar={(selecionados) => setListaLotes(selecionados)}
                            />
                            {listaLotes.length > 0 && (
                                <Styled.Tags>
                                    {listaLotes.map(s => (
                                        <Styled.Tag key={s.id}>
                                            #{s.id} — {s.loteInfo?.item_nome ?? `Lote #${s.id}`} — {s.qtd ?? s.qtde} {s.loteInfo?.item_unidadeMedida ?? ""}
                                            {s.loteInfo?.lot_validade
                                                ? ` — Val: ${new Date(s.loteInfo.lot_validade).toLocaleDateString("pt-BR")}`
                                                : " — Sem validade"}
                                        </Styled.Tag>
                                    ))}
                                </Styled.Tags>
                            )}
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