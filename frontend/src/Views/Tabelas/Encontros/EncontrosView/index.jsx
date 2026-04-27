import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const motivos = [
  "falta de beneficiarios minimos",
  "ausencia de tutor/funcionario responsavel",
  "indisponibilidade do local",
  "problema climatico",
  "falta de materiais/itens necessarios",
  "conflito de agenda",
  "motivo emergencial/outros",
];

const views = {
  encontros: "encontros",
  cancelar: "cancelar",
  cancelados: "cancelados",
};

function formatDate(value, includeTime = false) {
  if (!value) return "";

  if (!includeTime && typeof value === "string" && value.includes("T")) {
    return value.split("T")[0].split("-").reverse().join("/");
  }

  if (!includeTime && typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return value.split("-").reverse().join("/");
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const data = date.toLocaleDateString("pt-BR");
  if (!includeTime) return data;

  return `${data} ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function getDisponibilidadeLabel(value) {
  if (value === "A") return "Ativo";
  if (value === "E") return "Em andamento";
  if (value === "F") return "Finalizado";
  if (value === "C") return "Cancelado";
  return "Desconhecido";
}

function getAcaoCancelamentoLabel(value) {
  if (value === "reagendar") return "Cancelar e reagendar";
  if (value === "transferirInscritos") return "Cancelar e transferir inscritos";
  return "Cancelar sem reposicao";
}

function buildAlertas(impacto) {
  const alertas = [];

  if (!impacto) {
    return alertas;
  }

  if (impacto.motivosBloqueio?.length) {
    alertas.push(...impacto.motivosBloqueio);
  }

  if (impacto.confirmacaoReforcada) {
    alertas.push(
      "Este cancelamento afeta participantes, responsaveis ou materiais vinculados."
    );
  }

  if (impacto.exigeDetalhes) {
    alertas.push(
      "Uma justificativa detalhada e obrigatoria e necessaria para este cancelamento."
    );
  }

  if (impacto.proximo) {
    alertas.push("O encontro esta muito proximo da data planejada.");
  }

  return alertas;
}

function EncontrosView() {
  async function fetchEncontroLista(filtroAtual, status = "ativos") {
    const response = await fetch(
      `http://localhost:3000/encontros/listar?status=${status}&filtro=${encodeURIComponent(
        filtroAtual || ""
      )}`,
      { method: "GET" }
    );

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.err || json.Erro || "Erro ao carregar encontros.");
    }

    return json;
  }

  async function fetchImpacto(id) {
    const response = await fetch(`http://localhost:3000/encontros/impacto?id=${id}`, {
      method: "GET",
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.err || json.Erro || "Erro ao buscar impacto do encontro.");
    }

    return json;
  }

  async function carregarLista(filtroAtual, viewAtual) {
    try {
      setListError(null);
      const status = viewAtual === views.cancelados ? "cancelados" : "ativos";
      const info = await fetchEncontroLista(filtroAtual, status);
      setEncontros(info);
    } catch (error) {
      setEncontros([]);
      setListError(error.message);
    }
  }

  async function handleOpenCancelar(encontro) {
    try {
      setLoadingImpacto(true);
      setCancelError(null);
      const impactoInfo = await fetchImpacto(encontro.id);
      setSelectedHistorico(null);
      setSelectedEncontro(encontro);
      setImpacto(impactoInfo);
      setCancelReason("");
      setCancelDetails("");
      setCancelOption("semReposicao");
      setReagendamentoDate("");
    } catch (error) {
      setCancelError(error.message);
    } finally {
      setLoadingImpacto(false);
    }
  }

  async function handleSubmitCancelamento() {
    if (!selectedEncontro || !impacto) return;

    if (!cancelReason) {
      setCancelError("Selecione um motivo de cancelamento.");
      return;
    }

    if (impacto.exigeDetalhes && cancelDetails.trim().length < 15) {
      setCancelError(
        "Informe pelo menos 15 caracteres de justificativa para concluir o cancelamento."
      );
      return;
    }

    if (
      (cancelOption === "reagendar" || cancelOption === "transferirInscritos") &&
      !reagendamentoDate
    ) {
      setCancelError("Informe a nova data para reagendamento.");
      return;
    }

    try {
      setCancelLoading(true);
      const response = await fetch("http://localhost:3000/encontros/cancelar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedEncontro.id,
          motivo: cancelReason,
          detalhes: cancelDetails,
          opcao: cancelOption,
          novaData: reagendamentoDate,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        setCancelError(json.err || "Erro ao cancelar encontro.");
        return;
      }

      let mensagem = `Encontro cancelado com sucesso.\n`;
      mensagem += `Beneficiarios liberados: ${json.liberados?.beneficiarios ?? 0}\n`;
      mensagem += `Responsaveis liberados: ${json.liberados?.responsaveis ?? 0}\n`;
      mensagem += `Materiais liberados: ${json.liberados?.materiais ?? 0}`;

      if (json.reagendamento) {
        mensagem += `\nNovo encontro criado para ${formatDate(json.reagendamento.novaData)}.`;
        if (json.reagendamento.transferencia) {
          mensagem += ` Inscritos transferidos automaticamente.`;
        }
      }

      alert(mensagem);
      setSelectedEncontro(null);
      setSelectedHistorico(null);
      setImpacto(null);
      setCancelError(null);
      setFiltro("");
      setActiveView(views.cancelados);
    } catch {
      setCancelError("Erro de rede ao cancelar encontro.");
    } finally {
      setCancelLoading(false);
    }
  }

  function handleCloseCancelamento() {
    setSelectedEncontro(null);
    setImpacto(null);
    setCancelError(null);
  }

  function handleChangeView(nextView) {
    setActiveView(nextView);
    setSelectedEncontro(null);
    setSelectedHistorico(null);
    setImpacto(null);
    setCancelError(null);
  }

  function handleRowClick(encontro) {
    if (activeView === views.encontros) {
      navigate(`/encontros/${encontro.id}`);
      return;
    }

    if (activeView === views.cancelados) {
      setSelectedHistorico(encontro);
    }
  }

  const [encontros, setEncontros] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [activeView, setActiveView] = useState(views.encontros);
  const [selectedEncontro, setSelectedEncontro] = useState(null);
  const [selectedHistorico, setSelectedHistorico] = useState(null);
  const [impacto, setImpacto] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDetails, setCancelDetails] = useState("");
  const [cancelOption, setCancelOption] = useState("semReposicao");
  const [reagendamentoDate, setReagendamentoDate] = useState("");
  const [cancelError, setCancelError] = useState(null);
  const [listError, setListError] = useState(null);
  const [loadingImpacto, setLoadingImpacto] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarLista(filtro, activeView);
  }, [filtro, activeView]);

  return (
    <>
      <Header />
      <Styled.PageHeader>
        <Styled.PageTitle>Encontros</Styled.PageTitle>
        <Styled.EncontroOptions>
          <button
            type="button"
            className={activeView === views.encontros ? "active" : ""}
            onClick={() => handleChangeView(views.encontros)}>
            Encontros
          </button>
          <button type="button">Finalizar Encontro</button>
          <button
            type="button"
            className={activeView === views.cancelar ? "active" : ""}
            onClick={() => handleChangeView(views.cancelar)}>
            Cancelar Encontro
          </button>
          <button type="button">Substituir Tutor</button>
          <button
            type="button"
            className={activeView === views.cancelados ? "active" : ""}
            onClick={() => handleChangeView(views.cancelados)}>
            Encontros Cancelados
          </button>
        </Styled.EncontroOptions>
      </Styled.PageHeader>
      <main>
        <Styled.Busca
          type="text"
          placeholder={
            activeView === views.cancelados
              ? "Buscar por local, id ou motivo..."
              : "Buscar encontros..."
          }
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <Styled.Actions>
          {activeView !== views.cancelados && (
            <button onClick={() => navigate("/encontros/cadastro")}>
              + Cadastrar Encontro
            </button>
          )}
        </Styled.Actions>

        {activeView === views.cancelar && (
          <Styled.ModeMessage>
            Selecione um encontro ativo para analisar o impacto e executar o cancelamento.
          </Styled.ModeMessage>
        )}

        {activeView === views.cancelados && (
          <Styled.ModeMessage>
            Consulte o historico de cancelamentos, o motivo registrado e a acao tomada apos cada evento.
          </Styled.ModeMessage>
        )}

        {listError && <Styled.InlineError>{listError}</Styled.InlineError>}

        {selectedEncontro && impacto && (
          <Styled.CancelCard>
            <h2>Cancelar encontro #{selectedEncontro.id}</h2>
            <p>
              Local: <strong>{selectedEncontro.local}</strong>
            </p>
            <p>
              Data: <strong>{formatDate(selectedEncontro.data)}</strong>
            </p>
            <Styled.Summary>
              <div>
                <strong>Beneficiarios inscritos:</strong> {impacto.beneficiarios}
              </div>
              <div>
                <strong>Responsaveis vinculados:</strong> {impacto.responsaveis}
              </div>
              <div>
                <strong>Materiais vinculados:</strong> {impacto.materiais}
              </div>
              <div>
                <strong>Proximo da data:</strong> {impacto.proximo ? "Sim" : "Nao"}
              </div>
            </Styled.Summary>

            {buildAlertas(impacto).length > 0 && (
              <Styled.AlertList>
                {buildAlertas(impacto).map((alerta) => (
                  <li key={alerta}>{alerta}</li>
                ))}
              </Styled.AlertList>
            )}

            <label>
              Motivo obrigatorio:
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}>
                <option value="">Selecione</option>
                {motivos.map((motivo) => (
                  <option key={motivo} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Detalhes adicionais:
              <textarea
                value={cancelDetails}
                onChange={(e) => setCancelDetails(e.target.value)}
                placeholder="Explique o contexto operacional do cancelamento"
              />
            </label>
            <div>
              <strong>Opcao apos cancelamento:</strong>
            </div>
            <Styled.OptionGroup>
              <label>
                <input
                  type="radio"
                  name="cancelOption"
                  value="semReposicao"
                  checked={cancelOption === "semReposicao"}
                  onChange={(e) => setCancelOption(e.target.value)}
                />
                Cancelar sem reposicao
              </label>
              <label>
                <input
                  type="radio"
                  name="cancelOption"
                  value="reagendar"
                  checked={cancelOption === "reagendar"}
                  onChange={(e) => setCancelOption(e.target.value)}
                />
                Cancelar e reagendar
              </label>
              <label>
                <input
                  type="radio"
                  name="cancelOption"
                  value="transferirInscritos"
                  checked={cancelOption === "transferirInscritos"}
                  onChange={(e) => setCancelOption(e.target.value)}
                />
                Cancelar e transferir inscritos
              </label>
            </Styled.OptionGroup>
            {(cancelOption === "reagendar" || cancelOption === "transferirInscritos") && (
              <label>
                Nova data do encontro:
                <input
                  type="date"
                  value={reagendamentoDate}
                  onChange={(e) => setReagendamentoDate(e.target.value)}
                />
              </label>
            )}
            {cancelError && <Styled.InlineError>{cancelError}</Styled.InlineError>}
            <Styled.CancelActions>
              <button
                type="button"
                onClick={handleSubmitCancelamento}
                disabled={cancelLoading}>
                {cancelLoading ? "Cancelando..." : "Confirmar cancelamento"}
              </button>
              <button type="button" className="secondary" onClick={handleCloseCancelamento}>
                Fechar
              </button>
            </Styled.CancelActions>
          </Styled.CancelCard>
        )}

        {selectedHistorico && activeView === views.cancelados && (
          <Styled.CancelCard>
            <h2>Historico do encontro cancelado #{selectedHistorico.id}</h2>
            <p>
              Local: <strong>{selectedHistorico.local}</strong>
            </p>
            <p>
              Data original: <strong>{formatDate(selectedHistorico.data)}</strong>
            </p>
            <Styled.HistoryGrid>
              <div>
                <strong>Data do cancelamento:</strong>
                <div>{formatDate(selectedHistorico.dataCancelamento, true)}</div>
              </div>
              <div>
                <strong>Motivo:</strong>
                <div>{selectedHistorico.motivoCancelamento || "Nao informado"}</div>
              </div>
              <div>
                <strong>Acao apos cancelamento:</strong>
                <div>{getAcaoCancelamentoLabel(selectedHistorico.acaoCancelamento)}</div>
              </div>
              <div>
                <strong>Novo encontro:</strong>
                <div>
                  {selectedHistorico.reagendadoPara
                    ? `#${selectedHistorico.reagendadoPara}`
                    : "Nao houve"}
                </div>
              </div>
              <div>
                <strong>Beneficiarios afetados:</strong>
                <div>{selectedHistorico.beneficiariosAfetados ?? 0}</div>
              </div>
              <div>
                <strong>Responsaveis afetados:</strong>
                <div>{selectedHistorico.responsaveisAfetados ?? 0}</div>
              </div>
              <div>
                <strong>Materiais afetados:</strong>
                <div>{selectedHistorico.materiaisAfetados ?? 0}</div>
              </div>
            </Styled.HistoryGrid>
            <label>
              Detalhamento registrado:
              <textarea value={selectedHistorico.detalhesCancelamento || ""} readOnly />
            </label>
          </Styled.CancelCard>
        )}

        {loadingImpacto && <Styled.ModeMessage>Carregando impacto do cancelamento...</Styled.ModeMessage>}

        {encontros.length === 0 ? (
          <Styled.EmptyState>
            Nenhum encontro encontrado para o filtro atual.
          </Styled.EmptyState>
        ) : (
          <Styled.Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Local</th>
                <th>Data</th>
                {activeView === views.cancelados ? (
                  <>
                    <th>Data cancelamento</th>
                    <th>Motivo</th>
                    <th>Acao</th>
                    <th>Acoes</th>
                  </>
                ) : (
                  <>
                    <th>QtdeMax</th>
                    <th>Qtde</th>
                    <th>Disponibilidade</th>
                    {activeView === views.cancelar && <th>Acoes</th>}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {encontros.map((f) => (
                <tr key={f.id} onClick={() => handleRowClick(f)}>
                  <td>{f.id}</td>
                  <td>{f.local}</td>
                  <td>{formatDate(f.data)}</td>
                  {activeView === views.cancelados ? (
                    <>
                      <td>{formatDate(f.dataCancelamento, true)}</td>
                      <td>{f.motivoCancelamento || "-"}</td>
                      <td>{getAcaoCancelamentoLabel(f.acaoCancelamento)}</td>
                      <td>
                        <Styled.TableSecondaryButton
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHistorico(f);
                          }}>
                          Ver historico
                        </Styled.TableSecondaryButton>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{f.qtdeMax}</td>
                      <td>{f.qtde}</td>
                      <td>{getDisponibilidadeLabel(f.disponibilidade)}</td>
                      {activeView === views.cancelar && (
                        <td>
                          <Styled.TableCancelButton
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCancelar(f);
                            }}>
                            Cancelar
                          </Styled.TableCancelButton>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Styled.Table>
        )}
      </main>
      <Footer />
    </>
  );
}

export default EncontrosView;
