import { useState } from "react";
import Styled from "./styles";

function ModalLotes({ lotes, lotesJaSelecionados = [], onConfirmar, erro }) {
    console.log("lotes no modal:", lotes);
    const [aberto, setAberto] = useState(false);
    const [busca, setBusca] = useState("");
    const [selecionados, setSelecionados] = useState(
        lotesJaSelecionados.map(l => ({ ...l }))
    );

    const lotesFiltrados = lotes.filter(l =>
        (l.item_nome ?? "").toLowerCase().includes(busca.toLowerCase())
    );

    function toggleLote(lote) {
        setSelecionados(prev => {
            const jaEsta = prev.find(s => s.id === lote.lot_id);
            if (jaEsta)
                return prev.filter(s => s.id !== lote.lot_id);
            return [...prev, { id: lote.lot_id, qtd: "", loteInfo: lote }];
        });
    }

    function atualizarQtd(id, qtd) {
        setSelecionados(prev =>
            prev.map(s => s.id === id ? { ...s, qtd } : s)
        );
    }

    function confirmar() {
        for (let s of selecionados) {
            if (!s.qtd || Number(s.qtd) <= 0) {
                alert(`Informe uma quantidade válida para: ${s.loteInfo.item_nome} — Lote #${s.id}`);
                return;
            }
            if (Number(s.qtd) > s.loteInfo.lot_qtde) {
                alert(`Quantidade maior que o estoque (${s.loteInfo.lot_qtde}) para: ${s.loteInfo.item_nome} — Lote #${s.id}`);
                return;
            }
        }
        onConfirmar(selecionados);
        setAberto(false);
    }

    function abrirModal() {
        setSelecionados(lotesJaSelecionados.map(l => ({ ...l })));
        setAberto(true);
    }

    return (
        <>
            <Styled.Trigger
                $erro={erro}
                onClick={lotes.length === 0 ? null : abrirModal}
                style={{ opacity: lotes.length === 0 ? 0.5 : 1, cursor: lotes.length === 0 ? "not-allowed" : "pointer" }}
            >
                <Styled.Placeholder>
                    {lotes.length === 0 ? "Carregando lotes..." : "Selecionar lotes..."}
                </Styled.Placeholder>
            </Styled.Trigger>

            {aberto && (
                <Styled.Fundo onClick={() => setAberto(false)}>
                    <Styled.Modal onClick={e => e.stopPropagation()}>
                        <h3>Selecionar Lotes</h3>

                        <Styled.BuscaInput
                            type="text"
                            placeholder="Buscar item..."
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                        />

                        <Styled.ListaLotes>
                            {lotesFiltrados.length === 0
                                ? <span style={{ color: "#999" }}>Nenhum lote encontrado</span>
                                : lotesFiltrados.map(l => {
                                    const sel = selecionados.find(s => s.id === l.lot_id);
                                    return (
                                        <Styled.LoteItem
                                            key={`lot-${l.lot_id}`}
                                            $selecionado={!!sel}
                                            onClick={() => toggleLote(l)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={!!sel}
                                                onChange={() => toggleLote(l)}
                                                onClick={e => e.stopPropagation()}
                                                style={{ cursor: "pointer" }}
                                            />

                                            <Styled.LoteInfo>
                                                <strong>{l.item_nome}</strong> — Lote #{l.lot_id}
                                                <br />
                                                <span>
                                                    {l.lot_validade
                                                        ? `Val: ${new Date(l.lot_validade).toLocaleDateString("pt-BR")}`
                                                        : "Sem validade"}
                                                    {" | "}Estoque: {l.lot_qtde} {l.item_unidadeMedida}
                                                </span>
                                            </Styled.LoteInfo>

                                            {sel && (
                                                <Styled.QtdInput
                                                    type="number"
                                                    placeholder="Qtd"
                                                    value={sel.qtd}
                                                    min={1}
                                                    max={l.lot_qtde}
                                                    onClick={e => e.stopPropagation()}
                                                    onChange={e => atualizarQtd(l.lot_id, e.target.value)}
                                                />
                                            )}
                                        </Styled.LoteItem>
                                    );
                                })
                            }
                        </Styled.ListaLotes>

                        <Styled.Botoes>
                            <Styled.BtnCancelar type="button" onClick={() => setAberto(false)}>
                                Cancelar
                            </Styled.BtnCancelar>
                            <Styled.BtnConfirmar
                                type="button"
                                onClick={confirmar}
                                disabled={selecionados.length === 0}
                            >
                                Confirmar
                            </Styled.BtnConfirmar>
                        </Styled.Botoes>
                    </Styled.Modal>
                </Styled.Fundo>
            )}
        </>
    );
}

export default ModalLotes;