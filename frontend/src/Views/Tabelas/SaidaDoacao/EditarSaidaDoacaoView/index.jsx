import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AutocompleteBen from "../autoCompleteBen";
import ModalLotes from "../ModalLotes";

function EditarSaidaDoacaoView() {

    const { id } = useParams();

    const [beneficiarios, setBeneficiarios] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [camposVazios, setCamposVazios] = useState({});
    const [listaOld, setListaOld] = useState([]);
    const [listaLotes, setListaLotes] = useState([]);
    const [editado, setEditado] = useState(false);

    const [form, setForm] = useState({
        benId: "",
        data: "",
    });
    const [formOriginal, setFormOriginal] = useState({
        benId: "",
        data: "",
    });

    useEffect(() => {
        async function carregarDados() {
            try {
                const [resBen, resLotes, resSaida, resLotesSaida] = await Promise.all([
                    fetch("http://localhost:3000/beneficiarios/listar"),
                    fetch("http://localhost:3000/lotes/listarComItens?zerado=true"),
                    fetch(`http://localhost:3000/saidaDoacao/buscar?id=${id}`),
                    fetch(`http://localhost:3000/saidaDoacao/buscarLotes/${id}`),
                ]);

                const dataBen = await resBen.json();
                const dataLotes = await resLotes.json();
                const dataSaida = await resSaida.json();
                const dataLotesSaida = await resLotesSaida.json();

                if (resBen.ok) {
                    if (dataBen.length === 0) alert("Nenhum beneficiário cadastrado!");
                    else setBeneficiarios(dataBen);
                }

                if (resLotes.ok && dataLotes.length > 0)
                    setLotes(dataLotes);

                if (resSaida.ok) {
                    const f = {
                        benId: dataSaida.benId,
                        data: dataSaida.data
                            ? new Date(dataSaida.data).toISOString().split("T")[0]
                            : "",
                    };
                    setForm(f);
                    setFormOriginal(f);
                }

                if (resLotesSaida.ok) {
                    setListaLotes(dataLotesSaida);
                    setListaOld(dataLotesSaida);
                }

            } catch (error) {
                alert("Erro ao carregar dados");
            }
        }
        carregarDados();
    }, []);

    useEffect(() => {
        const formEditado = JSON.stringify(form) !== JSON.stringify(formOriginal);
        const lotesEditados = JSON.stringify(listaLotes) !== JSON.stringify(listaOld);
        setEditado(formEditado || lotesEditados);
    }, [form, formOriginal, listaLotes, listaOld]);

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function carregarLotes() {
        const resLotes = await fetch("http://localhost:3000/lotes/listarComItens?zerado=true");
        const dataLotes = await resLotes.json();
        if (resLotes.ok && dataLotes.length > 0)
            setLotes(dataLotes);
    }

    async function fetchAlterar() {
        const vazios = {
            benId: !form.benId,
            listaLotes: listaLotes.length === 0,
        };
        setCamposVazios(vazios);
        if (Object.values(vazios).includes(true)) {
            alert("Preencha todos os campos corretamente!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/saidaDoacao/alterar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: id,
                    benId: form.benId,
                    data: form.data || null,
                    listaOld: listaOld.map(l => ({ id: l.id, qtde: l.qtde })),
                    listaNew: listaLotes.map(l => ({ id: l.id, qtde: Number(l.qtd ?? l.qtde) })),
                }),
            });
            if (response.ok) {
                alert("Saída alterada com sucesso!");
                setFormOriginal(form);
                setListaOld(listaLotes);
                setEditado(false);
                await carregarLotes();
            } else {
                const json = await response.json();
                alert(json.err || "Erro desconhecido no servidor");
            }
        } catch (error) {
            alert("Erro ao alterar saída de doação");
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
                    <h2>Editar Saída de Doação</h2>

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
                        <label>Data efetiva da doação: </label>
                        <input
                            type="date"
                            name="data"
                            value={form.data}
                            onChange={atualizarForm}
                        />
                    </div>

                    {/* Lotes */}
                    <div>
                        <label>Lotes doados: </label>
                        <ModalLotes
                            lotes={lotes}
                            lotesJaSelecionados={listaLotes}
                            onConfirmar={(selecionados) => setListaLotes(selecionados)}
                            erro={camposVazios.listaLotes}
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

                    <button
                        type="button"
                        disabled={!editado}
                        onClick={fetchAlterar}
                    >
                        Salvar alterações
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default EditarSaidaDoacaoView;