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
  substituir: "substituir",
  cancelados: "cancelados",
};

const API_URL = "http://localhost:3000/api/encontros";

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("token");
  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`,
  };
}

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

async function parseResponse(response, fallbackMessage) {
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.err || json.Erro || fallbackMessage);
  }
  return json;
}

function EncontrosView() {
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
  const [selectedEncontroSubstituicao, setSelectedEncontroSubstituicao] = useState(null);
  const [responsaveis, setResponsaveis] = useState([]);
  const [responsavelSelecionado, setResponsavelSelecionado] = useState(null);
  const [substitutos, setSubstitutos] = useState([]);
  const [substituicaoError, setSubstituicaoError] = useState(null);
  const navigate = useNavigate();

  async function fetchEncontroLista(filtroAtual, status = "ativos") {
    const response = await fetch(
      `${API_URL}/listar?status=${status}&filtro=${encodeURIComponent(filtroAtual || "")}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return parseResponse(response, "Erro ao carregar encontros.");
  }

  async function fetchImpacto(id) {
    const response = await fetch(`${API_URL}/impacto?id=${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return parseResponse(response, "Erro ao buscar impacto do encontro.");
  }

  async function fetchResponsaveis(id) {
    const response = await fetch(`${API_URL}/responsaveis?id=${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return parseResponse(response, "Erro ao carregar funcionarios responsaveis.");
  }

  async function fetchSubstitutos(id, funIdAtual) {
    const params = new URLSearchParams({
      id: String(id),
      funIdAtual: String(funIdAtual),
    });

    const response = await fetch(`${API_URL}/substitutos?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return parseResponse(response, "Erro ao carregar substitutos.");
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

  async function handleOpenSubstituir(encontro) {
    try {
      const listaResponsaveis = await fetchResponsaveis(encontro.id);
      setSelectedEncontroSubstituicao(encontro);
      setResponsaveis(listaResponsaveis);
      setResponsavelSelecionado(null);
      setSubstitutos([]);
      setSubstituicaoError(null);
    } catch (error) {
      setSubstituicaoError(error.message);
    }
  }

  async function handleSelectResponsavel(funcionario) {
    if (!selectedEncontroSubstituicao) {
      return;
    }

    try {
      const listaSubstitutos = await fetchSubstitutos(
        selectedEncontroSubstituicao.id,
        funcionario.id
      );

      setResponsavelSelecionado(funcionario);
      setSubstitutos(listaSubstitutos);
      setSubstituicaoError(null);
    } catch (error) {
      setSubstituicaoError(error.message);
    }
  }

  async function handleConfirmarSubstituicao(substituto) {
    if (!selectedEncontroSubstituicao || !responsavelSelecionado) {
      return;
    }

    const confirmar = confirm(
      `Substituir ${responsavelSelecionado.nome} por ${substituto.nome} neste encontro?`
    );
    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/substituir-tutor`, {
        method: "POST",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          encId: selectedEncontroSubstituicao.id,
          funIdAtual: responsavelSelecionado.id,
          funIdNovo: substituto.id,
        }),
      });

      await parseResponse(response, "Nao foi possivel substituir o tutor.");
      alert("Tutor substituido com sucesso.");

      const listaResponsaveis = await fetchResponsaveis(selectedEncontroSubstituicao.id);
      setResponsaveis(listaResponsaveis);
      setResponsavelSelecionado(null);
      setSubstitutos([]);
      setSubstituicaoError(null);
    } catch (error) {
      setSubstituicaoError(error.message || "Erro de rede ao substituir tutor.");
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
      const response = await fetch(`${API_URL}/cancelar`, {
        method: "POST",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          id: selectedEncontro.id,
          motivo: cancelReason,
          detalhes: cancelDetails,
          opcao: cancelOption,
          novaData: reagendamentoDate,
        }),
      });

      const json = await parseResponse(response, "Erro ao cancelar encontro.");

      let mensagem = "Encontro cancelado com sucesso.\n";
      mensagem += `Beneficiarios liberados: ${json.liberados?.beneficiarios ?? 0}\n`;
      mensagem += `Responsaveis liberados: ${json.liberados?.responsaveis ?? 0}\n`;
      mensagem += `Materiais liberados: ${json.liberados?.materiais ?? 0}`;

      if (json.reagendamento) {
        mensagem += `\nNovo encontro criado para ${formatDate(json.reagendamento.novaData)}.`;
        if (json.reagendamento.transferencia) {
          mensagem += " Inscritos transferidos automaticamente.";
        }
      }

      alert(mensagem);
      setSelectedEncontro(null);
      setSelectedHistorico(null);
      setImpacto(null);
      setCancelError(null);
      setFiltro("");
      setActiveView(views.cancelados);
    } catch (error) {
      setCancelError(error.message || "Erro de rede ao cancelar encontro.");
    } finally {
      setCancelLoading(false);
    }
  }

  function handleCloseCancelamento() {
    setSelectedEncontro(null);
    setImpacto(null);
    setCancelError(null);
  }

  function handleCloseSubstituicao() {
    setSelectedEncontroSubstituicao(null);
    setResponsaveis([]);
    setResponsavelSelecionado(null);
    setSubstitutos([]);
    setSubstituicaoError(null);
  }

  function handleChangeView(nextView) {
    setActiveView(nextView);
    setSelectedEncontro(null);
    setSelectedHistorico(null);
    setImpacto(null);
    setCancelError(null);
    setSelectedEncontroSubstituicao(null);
    setResponsaveis([]);
    setResponsavelSelecionado(null);
    setSubstitutos([]);
    setSubstituicaoError(null);
    setFiltro("");
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
          <button
            type="button"
            className={activeView === views.substituir ? "active" : ""}
            onClick={() => handleChangeView(views.substituir)}>
            Substituir Tutor
          </button>
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

        {activeView === views.substituir && (
          <Styled.ModeMessage>
            Selecione abaixo o encontro para substituir tutor.
          </Styled.ModeMessage>
        )}

        {activeView === views.cancelados && (
          <Styled.ModeMessage>
            Consulte o historico de cancelamentos, o motivo registrado e a acao tomada apos
            cada evento.
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
              <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
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
              <button type="button" onClick={handleSubmitCancelamento} disabled={cancelLoading}>
                {cancelLoading ? "Cancelando..." : "Confirmar cancelamento"}
              </button>
              <button type="button" className="secondary" onClick={handleCloseCancelamento}>
                Fechar
              </button>
            </Styled.CancelActions>
          </Styled.CancelCard>
        )}

        {selectedEncontroSubstituicao && (
          <Styled.SubstituteCard>
            <h2>Substituir tutor do encontro #{selectedEncontroSubstituicao.id}</h2>
            <p>
              Local: <strong>{selectedEncontroSubstituicao.local}</strong>
            </p>
            <p>
              Data: <strong>{formatDate(selectedEncontroSubstituicao.data)}</strong>
            </p>

            <Styled.SubstituteSection>
              <h3>Funcionarios responsaveis atuais</h3>
              <p>Selecione um funcionario abaixo para listar os substitutos disponiveis.</p>
              {responsaveis.length === 0 ? (
                <Styled.EmptyState>
                  Nenhum funcionario responsavel esta vinculado a este encontro.
                </Styled.EmptyState>
              ) : (
                <Styled.MiniTable>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>nome</th>
                      <th>usuario</th>
                      <th>cargo</th>
                      <th>cpf</th>
                      <th>telefone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responsaveis.map((funcionario) => (
                      <tr
                        key={funcionario.id}
                        className={responsavelSelecionado?.id === funcionario.id ? "selected" : ""}
                        onClick={() => handleSelectResponsavel(funcionario)}>
                        <td>{funcionario.id}</td>
                        <td>{funcionario.nome}</td>
                        <td>{funcionario.usuario}</td>
                        <td>{funcionario.cargo}</td>
                        <td>{funcionario.cpf}</td>
                        <td>{funcionario.telefone}</td>
                      </tr>
                    ))}
                  </tbody>
                </Styled.MiniTable>
              )}
            </Styled.SubstituteSection>

            {responsavelSelecionado && (
              <Styled.SubstituteSection>
                <h3>Substitutos disponiveis para {responsavelSelecionado.nome}</h3>
                <p>
                  A lista abaixo exclui funcionarios ja vinculados a outro encontro ativo na
                  mesma data.
                </p>
                {substitutos.length === 0 ? (
                  <Styled.EmptyState>
                    Nenhum funcionario disponivel foi encontrado para substituir este tutor.
                  </Styled.EmptyState>
                ) : (
                  <Styled.MiniTable>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>nome</th>
                        <th>usuario</th>
                        <th>cargo</th>
                        <th>cpf</th>
                        <th>telefone</th>
                        <th>acao</th>
                      </tr>
                    </thead>
                    <tbody>
                      {substitutos.map((funcionario) => (
                        <tr key={funcionario.id}>
                          <td>{funcionario.id}</td>
                          <td>{funcionario.nome}</td>
                          <td>{funcionario.usuario}</td>
                          <td>{funcionario.cargo}</td>
                          <td>{funcionario.cpf}</td>
                          <td>{funcionario.telefone}</td>
                          <td>
                            <Styled.SelectButton
                              type="button"
                              onClick={() => handleConfirmarSubstituicao(funcionario)}>
                              Substituir
                            </Styled.SelectButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Styled.MiniTable>
                )}
              </Styled.SubstituteSection>
            )}

            {substituicaoError && <Styled.InlineError>{substituicaoError}</Styled.InlineError>}

            <Styled.CancelActions>
              <button type="button" className="secondary" onClick={handleCloseSubstituicao}>
                Fechar
              </button>
            </Styled.CancelActions>
          </Styled.SubstituteCard>
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

        {loadingImpacto && (
          <Styled.ModeMessage>Carregando impacto do cancelamento...</Styled.ModeMessage>
        )}

        {encontros.length === 0 ? (
          <Styled.EmptyState>Nenhum encontro encontrado para o filtro atual.</Styled.EmptyState>
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
                    {(activeView === views.cancelar || activeView === views.substituir) && (
                      <th>Acoes</th>
                    )}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {encontros.map((encontro) => (
                <tr key={encontro.id} onClick={() => handleRowClick(encontro)}>
                  <td>{encontro.id}</td>
                  <td>{encontro.local}</td>
                  <td>{formatDate(encontro.data)}</td>
                  {activeView === views.cancelados ? (
                    <>
                      <td>{formatDate(encontro.dataCancelamento, true)}</td>
                      <td>{encontro.motivoCancelamento || "-"}</td>
                      <td>{getAcaoCancelamentoLabel(encontro.acaoCancelamento)}</td>
                      <td>
                        <Styled.TableSecondaryButton
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedHistorico(encontro);
                          }}>
                          Ver historico
                        </Styled.TableSecondaryButton>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{encontro.qtdeMax}</td>
                      <td>{encontro.qtde}</td>
                      <td>{getDisponibilidadeLabel(encontro.disponibilidade)}</td>
                      {activeView === views.cancelar && (
                        <td>
                          <Styled.TableCancelButton
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenCancelar(encontro);
                            }}>
                            Cancelar
                          </Styled.TableCancelButton>
                        </td>
                      )}
                      {activeView === views.substituir && (
                        <td>
                          <Styled.TableSelectButton
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenSubstituir(encontro);
                            }}>
                            Selecionar
                          </Styled.TableSelectButton>
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
