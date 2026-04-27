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

function formatarData(data) {
  return data ? data.split("T")[0].split("-").reverse().join("/") : "";
}

function EncontrosView() {
  function fetchEncontroLista(filtroBusca, status = "ativos") {
    return fetch(
      `${API_URL}/listar?status=${status}&filtro=${encodeURIComponent(filtroBusca)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar encontros.");
        }
        return response.json();
      })
      .catch((error) => {
        alert(error.message || error);
        return [];
      });
  }

  function fetchImpacto(id) {
    return fetch(`${API_URL}/impacto?id=${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar impacto do encontro.");
        }
        return response.json();
      })
      .catch((error) => {
        alert(error.message || error);
        return null;
      });
  }

  function fetchResponsaveis(id) {
    return fetch(`${API_URL}/responsaveis?id=${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })
      .then(async (response) => {
        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.err || "Erro ao carregar funcionarios responsaveis.");
        }
        return response.json();
      })
      .catch((error) => {
        alert(error.message || error);
        return [];
      });
  }

  function fetchSubstitutos(id, funIdAtual) {
    const params = new URLSearchParams({
      id: String(id),
      funIdAtual: String(funIdAtual),
    });

    return fetch(`${API_URL}/substitutos?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })
      .then(async (response) => {
        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.err || "Erro ao carregar substitutos.");
        }
        return response.json();
      })
      .catch((error) => {
        alert(error.message || error);
        return [];
      });
  }

  async function handleOpenCancelar(encontro) {
    const impactoInfo = await fetchImpacto(encontro.id);
    setSelectedEncontro(encontro);
    setImpacto(impactoInfo);
    setCancelReason("");
    setCancelDetails("");
    setCancelOption("semReposicao");
    setReagendamentoDate("");
    setCancelError(null);
  }

  async function handleOpenSubstituir(encontro) {
    const listaResponsaveis = await fetchResponsaveis(encontro.id);
    setSelectedEncontroSubstituicao(encontro);
    setResponsaveis(listaResponsaveis);
    setResponsavelSelecionado(null);
    setSubstitutos([]);
    setSubstituicaoError(null);
  }

  async function handleSelectResponsavel(funcionario) {
    if (!selectedEncontroSubstituicao) {
      return;
    }

    const listaSubstitutos = await fetchSubstitutos(
      selectedEncontroSubstituicao.id,
      funcionario.id
    );

    setResponsavelSelecionado(funcionario);
    setSubstitutos(listaSubstitutos);
    setSubstituicaoError(null);
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

      const json = await response.json();
      if (!response.ok) {
        setSubstituicaoError(json.err || "Nao foi possivel substituir o tutor.");
        return;
      }

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
    if (!selectedEncontro) return;
    if (!cancelReason) {
      setCancelError("Selecione um motivo de cancelamento.");
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

      const json = await response.json();
      if (!response.ok) {
        setCancelError(json.err || "Erro ao cancelar encontro.");
        return;
      }

      let mensagem = `Encontro cancelado com sucesso. Motivo: ${cancelReason}`;
      if (json.reagendamento) {
        mensagem += `\nNovo encontro criado para ${json.reagendamento.novaData}`;
        if (json.reagendamento.transferencia) {
          mensagem += " e inscritos transferidos.";
        }
      }

      alert(mensagem);
      setSelectedEncontro(null);
      setImpacto(null);
      setCancelError(null);
      setFiltro("");
      const info = await fetchEncontroLista("", "ativos");
      setEncontros(info);
    } catch {
      setCancelError("Erro de rede ao cancelar encontro.");
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

  async function handleChangeView(nextView) {
    setActiveView(nextView);
    setSelectedEncontro(null);
    setImpacto(null);
    setCancelError(null);
    setSelectedEncontroSubstituicao(null);
    setResponsaveis([]);
    setResponsavelSelecionado(null);
    setSubstitutos([]);
    setSubstituicaoError(null);
    setFiltro("");

    const status = nextView === views.cancelados ? "cancelados" : "ativos";
    const info = await fetchEncontroLista("", status);
    setEncontros(info);
  }

  function handleClickEncontro(encontro) {
    if (activeView === views.cancelar) {
      handleOpenCancelar(encontro);
      return;
    }

    if (activeView === views.substituir) {
      handleOpenSubstituir(encontro);
      return;
    }

    navigate(`/encontros/${encontro.id}`);
  }

  const [encontros, setEncontros] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [activeView, setActiveView] = useState(views.encontros);
  const [selectedEncontro, setSelectedEncontro] = useState(null);
  const [impacto, setImpacto] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDetails, setCancelDetails] = useState("");
  const [cancelOption, setCancelOption] = useState("semReposicao");
  const [reagendamentoDate, setReagendamentoDate] = useState("");
  const [cancelError, setCancelError] = useState(null);
  const [selectedEncontroSubstituicao, setSelectedEncontroSubstituicao] = useState(null);
  const [responsaveis, setResponsaveis] = useState([]);
  const [responsavelSelecionado, setResponsavelSelecionado] = useState(null);
  const [substitutos, setSubstitutos] = useState([]);
  const [substituicaoError, setSubstituicaoError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      const status = activeView === views.cancelados ? "cancelados" : "ativos";
      const info = await fetchEncontroLista(filtro, status);
      setEncontros(info);
    }
    carregar();
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
          placeholder="Buscar encontros..."
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
            Selecione abaixo o encontro que deseja cancelar.
          </Styled.ModeMessage>
        )}

        {activeView === views.substituir && (
          <Styled.ModeMessage>
            Selecione abaixo o encontro para substituir tutor.
          </Styled.ModeMessage>
        )}

        {selectedEncontro && impacto && (
          <Styled.CancelCard>
            <h2>Cancelar encontro #{selectedEncontro.id}</h2>
            <p>
              Local: <strong>{selectedEncontro.local}</strong>
            </p>
            <p>
              Data: <strong>{formatarData(selectedEncontro.data)}</strong>
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
                <strong>Documentos vinculados:</strong> {impacto.documentos}
              </div>
              <div>
                <strong>Observacoes vinculadas:</strong> {impacto.observacoes}
              </div>
              <div>
                <strong>Proximo da data:</strong> {impacto.proximo ? "Sim" : "Nao"}
              </div>
            </Styled.Summary>
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
                placeholder="Contexto operacional do cancelamento"
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
            {cancelError && <p style={{ color: "red" }}>{cancelError}</p>}
            <Styled.CancelActions>
              <button type="button" onClick={handleSubmitCancelamento}>
                Confirmar cancelamento
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
              Data: <strong>{formatarData(selectedEncontroSubstituicao.data)}</strong>
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
                  A lista abaixo exclui funcionarios ja vinculados a outro encontro ativo na mesma data.
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

            {substituicaoError && <p style={{ color: "red" }}>{substituicaoError}</p>}

            <Styled.CancelActions>
              <button type="button" className="secondary" onClick={handleCloseSubstituicao}>
                Fechar
              </button>
            </Styled.CancelActions>
          </Styled.SubstituteCard>
        )}

        <Styled.Table>
          <thead>
            <tr>
              <th>#</th>
              <th>local</th>
              <th>data</th>
              <th>qtdeMax</th>
              <th>qtde</th>
              <th>disponibilidade</th>
              {(activeView === views.cancelar || activeView === views.substituir) && <th>Acoes</th>}
            </tr>
          </thead>
          <tbody>
            {encontros.map((encontro) => (
              <tr key={encontro.id} onClick={() => handleClickEncontro(encontro)}>
                <td>{encontro.id}</td>
                <td>{encontro.local}</td>
                <td>{formatarData(encontro.data)}</td>
                <td>{encontro.qtdeMax}</td>
                <td>{encontro.qtde}</td>
                <td>
                  {encontro.disponibilidade === "A"
                    ? "Ativo"
                    : encontro.disponibilidade === "E"
                    ? "Em Andamento"
                    : encontro.disponibilidade === "F"
                    ? "Finalizado"
                    : encontro.disponibilidade === "C"
                    ? "Cancelado"
                    : "Desconhecido"}
                </td>
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
              </tr>
            ))}
          </tbody>
        </Styled.Table>
      </main>
      <Footer />
    </>
  );
}

export default EncontrosView;
