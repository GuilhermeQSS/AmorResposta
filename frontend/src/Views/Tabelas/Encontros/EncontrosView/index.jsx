import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const motivos = [
  { value: "falta de beneficiarios minimos", label: "Falta de beneficiários mínimos" },
  { value: "ausencia de tutor/funcionario responsavel", label: "Ausência de tutor/funcionário responsável" },
  { value: "indisponibilidade do local", label: "Indisponibilidade do local" },
  { value: "problema climatico", label: "Problema climático" },
  { value: "falta de materiais/itens necessarios", label: "Falta de materiais/itens necessários" },
  { value: "conflito de agenda", label: "Conflito de agenda" },
  { value: "motivo emergencial/outros", label: "Motivo emergencial/outros" },
];

const views = {
  encontros: "encontros",
  cancelar: "cancelar",
  substituir: "substituir",
  cancelados: "cancelados",
  tutoresModificados: "tutoresModificados",
  finalizar: "finalizar",
};

const disponibilidades = [
  { value: "", label: "Todas" },
  { value: "A", label: "Ativo" },
  { value: "E", label: "Em andamento" },
  { value: "F", label: "Finalizado" },
  { value: "C", label: "Cancelado" },
];

const API_URL = "http://localhost:3000/api/encontros";
const ITENS_API_URL = "http://localhost:3000/itens";

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

  if (
    !includeTime &&
    typeof value === "string" &&
    value.match(/^\d{4}-\d{2}-\d{2}$/)
  ) {
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

function formatTime(value) {
  if (!value) return "-";
  return String(value).slice(0, 5);
}

function getDateInputValue(value) {
  if (!value) return "";
  if (typeof value === "string") {
    return value.includes("T") ? value.split("T")[0] : value.slice(0, 10);
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
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
  return "Cancelar sem reposição";
}

function getAcaoTutorLabel(value) {
  if (value === "excluido") return "excluido";
  if (value === "substituido") return "substituido";
  if (value === "adicionado") return "adicionado";
  return value || "-";
}

function getMotivoCancelamentoLabel(value) {
  return motivos.find((motivo) => motivo.value === value)?.label || value;
}

function formatCanceladoPor(encontro) {
  if (encontro?.canceladoPorNome && encontro?.canceladoPorUsuario) {
    return `${encontro.canceladoPorNome} (${encontro.canceladoPorUsuario})`;
  }

  if (encontro?.canceladoPorNome) {
    return encontro.canceladoPorNome;
  }

  if (encontro?.canceladoPorUsuario) {
    return encontro.canceladoPorUsuario;
  }

  return "Nao identificado";
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
      "Este cancelamento afeta participantes, responsáveis ou materiais vinculados.",
    );
  }

  if (impacto.exigeDetalhes) {
    alertas.push(
      "Uma justificativa detalhada e obrigatória é necessária para este cancelamento.",
    );
  }

  if (impacto.proximo) {
    alertas.push("O encontro esta muito próximo da data planejada.");
  }

  return alertas;
}

async function parseResponse(response, fallbackMessage) {
  const text = await response.text();
  let json = {};

  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = {};
    }
  }

  if (!response.ok) {
    throw new Error(
      json.err ||
        json.Erro ||
        json.erro ||
        json.message ||
        text ||
        `${fallbackMessage} HTTP ${response.status}`,
    );
  }

  return json;
}

function EncontrosView() {
  const [encontros, setEncontros] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [filtrosSubstituir, setFiltrosSubstituir] = useState({
    data: "",
    local: "",
    disponibilidade: "",
  });
  const [activeView, setActiveView] = useState(views.encontros);
  const [selectedEncontro, setSelectedEncontro] = useState(null);
  const [selectedHistorico, setSelectedHistorico] = useState(null);
  const [historicoTutores, setHistoricoTutores] = useState([]);
  const [selectedHistoricoTutor, setSelectedHistoricoTutor] = useState(null);
  const [impacto, setImpacto] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDetails, setCancelDetails] = useState("");
  const [cancelOption, setCancelOption] = useState("semReposicao");
  const [reagendamentoDate, setReagendamentoDate] = useState("");
  const [reagendamentoHora, setReagendamentoHora] = useState("");
  const [reagendamentoHoraFim, setReagendamentoHoraFim] = useState("");
  const [funcionariosReagendamento, setFuncionariosReagendamento] = useState([]);
  const [responsaveisReagendamento, setResponsaveisReagendamento] = useState([]);
  const [loadingFuncionariosReagendamento, setLoadingFuncionariosReagendamento] = useState(false);
  const [itensReagendamento, setItensReagendamento] = useState([]);
  const [materiaisReagendamento, setMateriaisReagendamento] = useState([]);
  const [materialReagendamentoDraft, setMaterialReagendamentoDraft] = useState({
    itemId: "",
    qtde: 1,
  });
  const [cancelError, setCancelError] = useState(null);
  const [listError, setListError] = useState(null);
  const [loadingImpacto, setLoadingImpacto] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedEncontroSubstituicao, setSelectedEncontroSubstituicao] =
    useState(null);
  const [responsaveis, setResponsaveis] = useState([]);
  const [responsavelSelecionado, setResponsavelSelecionado] = useState(null);
  const [substitutos, setSubstitutos] = useState([]);
  const [substituicaoModo, setSubstituicaoModo] = useState(null);
  const [filtroFuncionariosDisponiveis, setFiltroFuncionariosDisponiveis] =
    useState("");
  const [acaoJustificativaTutor, setAcaoJustificativaTutor] = useState(null);
  const [justificativaTutor, setJustificativaTutor] = useState("");
  const [funcionarioExclusaoPendente, setFuncionarioExclusaoPendente] =
    useState(null);
  const [funcionarioAdicaoSelecionado, setFuncionarioAdicaoSelecionado] =
    useState(null);
  const [funcionarioSubstitutoSelecionado, setFuncionarioSubstitutoSelecionado] =
    useState(null);
  const [substituicaoError, setSubstituicaoError] = useState(null);
  const navigate = useNavigate();

  async function fetchEncontroLista(
    filtroAtual,
    status = "ativos",
    dataInicialAtual = "",
    dataFinalAtual = "",
    filtrosEspecificos = {},
  ) {
    const params = new URLSearchParams({
      status,
      filtro: filtroAtual || "",
    });

    if (dataInicialAtual) {
      params.set("dataInicial", dataInicialAtual);
    }

    if (dataFinalAtual) {
      params.set("dataFinal", dataFinalAtual);
    }

    if (filtrosEspecificos.data) {
      params.set("data", filtrosEspecificos.data);
    }

    if (filtrosEspecificos.local) {
      params.set("local", filtrosEspecificos.local);
    }

    if (filtrosEspecificos.disponibilidade) {
      params.set("disponibilidade", filtrosEspecificos.disponibilidade);
    }

    const response = await fetch(
      `${API_URL}/listar?${params.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
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

    return parseResponse(
      response,
      "Erro ao carregar funcionários responsáveis.",
    );
  }

  async function fetchMateriais(id) {
    const response = await fetch(`${API_URL}/materiais?id=${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return parseResponse(response, "Erro ao carregar materiais do encontro.");
  }

  async function fetchItensReagendamento() {
    const response = await fetch(`${ITENS_API_URL}/listar?nome=&tipo=`, {
      method: "GET",
    });

    return parseResponse(response, "Erro ao carregar itens cadastrados.");
  }

  async function fetchFuncionariosDisponiveisReagendamento(data, hora, horaFim, ignorarId) {
    const params = new URLSearchParams({
      data,
      hora,
      horaFim,
      ignorarId: String(ignorarId),
    });

    const response = await fetch(`${API_URL}/funcionarios-disponiveis?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return parseResponse(response, "Erro ao carregar funcionarios disponiveis.");
  }

  async function fetchSubstitutos(id, funIdAtual) {
    const params = new URLSearchParams({
      id: String(id),
      funIdAtual: String(funIdAtual),
    });

    const response = await fetch(
      `${API_URL}/substitutos?${params.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    return parseResponse(response, "Erro ao carregar substitutos.");
  }

  async function fetchFuncionariosDisponiveisParaEncontro(encontro) {
    return fetchFuncionariosDisponiveisReagendamento(
      getDateInputValue(encontro.data),
      formatTime(encontro.hora),
      formatTime(encontro.horaFim || encontro.hora),
      encontro.id,
    );
  }

  async function fetchModificacoesTutores() {
    const response = await fetch(`${API_URL}/modificacoes-tutores`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return parseResponse(response, "Erro ao carregar modificacoes de tutores.");
  }

  function limparJustificativaTutor() {
    setAcaoJustificativaTutor(null);
    setJustificativaTutor("");
    setFuncionarioExclusaoPendente(null);
    setFuncionarioAdicaoSelecionado(null);
    setFuncionarioSubstitutoSelecionado(null);
  }

  function getMensagemJustificativaTutor(acao) {
    if (acao === "substituicao") return "Explique o porque da substituição";
    if (acao === "adicao") return "Explique o porque da adição";
    if (acao === "exclusao") return "Explique o porque da exclusão";
    return "";
  }

  function validarJustificativaTutor() {
    if (justificativaTutor.trim()) {
      return true;
    }

    setSubstituicaoError("Informe a justificativa antes de enviar.");
    return false;
  }

  async function carregarLista(
    filtroAtual,
    viewAtual,
    dataInicialAtual = "",
    dataFinalAtual = "",
    filtrosEspecificos = {},
  ) {
    try {
      setListError(null);
      if (viewAtual === views.tutoresModificados) {
        const info = await fetchModificacoesTutores();
        setHistoricoTutores(Array.isArray(info) ? info : []);
        setEncontros([]);
        return;
      }

      setHistoricoTutores([]);
      const status = viewAtual === views.cancelados ? "cancelados" : "ativos";
      const usarPeriodo = viewAtual === views.cancelar;
      const usarFiltrosSubstituir = viewAtual === views.substituir;
      const info = await fetchEncontroLista(
        usarFiltrosSubstituir ? "" : filtroAtual,
        status,
        usarPeriodo ? dataInicialAtual : "",
        usarPeriodo ? dataFinalAtual : "",
        usarFiltrosSubstituir ? filtrosEspecificos : {},
      );
      setEncontros(info);
    } catch (error) {
      setEncontros([]);
      setListError(error.message);
    }
  }

  async function handleOpenCancelar(encontro) {
    if (encontro.disponibilidade === "F") {
      alert("Um encontro finalizado nao pode ser cancelado.");
      return;
    }

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
      setReagendamentoDate(getDateInputValue(encontro.data));
      setReagendamentoHora(formatTime(encontro.hora) === "-" ? "" : formatTime(encontro.hora));
      setReagendamentoHoraFim(formatTime(encontro.horaFim || encontro.hora) === "-" ? "" : formatTime(encontro.horaFim || encontro.hora));
      const [responsaveisAtuais, materiaisAtuais, itensCadastrados] = await Promise.all([
        fetchResponsaveis(encontro.id),
        fetchMateriais(encontro.id),
        fetchItensReagendamento(),
      ]);
      setResponsaveisReagendamento(responsaveisAtuais.map((funcionario) => funcionario.id));
      setMateriaisReagendamento(
        materiaisAtuais.map((material) => ({
          itemId: Number(material.itemId),
          qtde: Number(material.qtde),
        })),
      );
      setItensReagendamento(Array.isArray(itensCadastrados) ? itensCadastrados : []);
      setMaterialReagendamentoDraft({ itemId: "", qtde: 1 });
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
      setSubstituicaoModo(null);
      setFiltroFuncionariosDisponiveis("");
      limparJustificativaTutor();
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
        funcionario.id,
      );

      setResponsavelSelecionado(funcionario);
      setSubstitutos(listaSubstitutos);
      setSubstituicaoModo("substituir");
      setFiltroFuncionariosDisponiveis("");
      setAcaoJustificativaTutor("substituicao");
      setJustificativaTutor("");
      setFuncionarioExclusaoPendente(null);
      setFuncionarioAdicaoSelecionado(null);
      setFuncionarioSubstitutoSelecionado(null);
      setSubstituicaoError(null);
    } catch (error) {
      setSubstituicaoError(error.message);
    }
  }

  async function handleOpenAdicionarTutor() {
    if (!selectedEncontroSubstituicao) {
      return;
    }

    try {
      const funcionarios = await fetchFuncionariosDisponiveisParaEncontro(
        selectedEncontroSubstituicao,
      );
      const responsaveisIds = new Set(
        responsaveis.map((funcionario) => Number(funcionario.id)),
      );
      const funcionariosParaAdicionar = Array.isArray(funcionarios)
        ? funcionarios.filter(
            (funcionario) => !responsaveisIds.has(Number(funcionario.id)),
          )
        : [];

      setResponsavelSelecionado(null);
      setSubstitutos(funcionariosParaAdicionar);
      setSubstituicaoModo("adicionar");
      setFiltroFuncionariosDisponiveis("");
      setAcaoJustificativaTutor("adicao");
      setJustificativaTutor("");
      setFuncionarioExclusaoPendente(null);
      setFuncionarioAdicaoSelecionado(null);
      setFuncionarioSubstitutoSelecionado(null);
      setSubstituicaoError(null);
    } catch (error) {
      setSubstituicaoError(error.message);
    }
  }

  function handleSelecionarSubstituto(funcionario) {
    setFuncionarioSubstitutoSelecionado(funcionario);
    setSubstituicaoError(null);
  }

  async function handleConfirmarSubstituicao() {
    if (
      !selectedEncontroSubstituicao ||
      !responsavelSelecionado ||
      !funcionarioSubstitutoSelecionado
    ) {
      setSubstituicaoError("Selecione um funcionario para substituir.");
      return;
    }

    if (!validarJustificativaTutor()) {
      return;
    }

    const confirmar = confirm(
      `Substituir ${responsavelSelecionado.nome} por ${funcionarioSubstitutoSelecionado.nome} neste encontro?`,
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
          funIdNovo: funcionarioSubstitutoSelecionado.id,
          justificativa: justificativaTutor.trim(),
        }),
      });

      await parseResponse(response, "Não foi possível substituir o tutor.");
      alert("Tutor substituído com sucesso.");

      const listaResponsaveis = await fetchResponsaveis(
        selectedEncontroSubstituicao.id,
      );
      setResponsaveis(listaResponsaveis);
      setResponsavelSelecionado(null);
      setSubstitutos([]);
      setSubstituicaoModo(null);
      setFiltroFuncionariosDisponiveis("");
      limparJustificativaTutor();
      setSubstituicaoError(null);
    } catch (error) {
      setSubstituicaoError(
        error.message || "Erro de rede ao substituir tutor.",
      );
    }
  }

  function handleSelecionarAdicaoTutor(funcionario) {
    setFuncionarioAdicaoSelecionado(funcionario);
    setSubstituicaoError(null);
  }

  async function handleConfirmarAdicaoTutor() {
    if (!selectedEncontroSubstituicao || !funcionarioAdicaoSelecionado) {
      setSubstituicaoError("Selecione um funcionario para adicionar.");
      return;
    }

    if (!validarJustificativaTutor()) {
      return;
    }

    const confirmar = confirm(
      `Adicionar ${funcionarioAdicaoSelecionado.nome} como tutor neste encontro?`,
    );
    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/adicionar-tutor`, {
        method: "POST",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          encId: selectedEncontroSubstituicao.id,
          funId: funcionarioAdicaoSelecionado.id,
          justificativa: justificativaTutor.trim(),
        }),
      });

      await parseResponse(response, "Não foi possível adicionar o tutor.");
      alert("Tutor adicionado com sucesso.");

      const listaResponsaveis = await fetchResponsaveis(
        selectedEncontroSubstituicao.id,
      );
      setResponsaveis(listaResponsaveis);
      setSubstitutos((lista) =>
        lista.filter(
          (item) =>
            Number(item.id) !== Number(funcionarioAdicaoSelecionado.id),
        ),
      );
      setSubstituicaoModo("adicionar");
      setFuncionarioAdicaoSelecionado(null);
      setJustificativaTutor("");
      setSubstituicaoError(null);
    } catch (error) {
      setSubstituicaoError(error.message || "Erro de rede ao adicionar tutor.");
    }
  }

  function handleSolicitarRemocaoTutor(event, funcionario) {
    event.stopPropagation();

    if (!selectedEncontroSubstituicao) {
      return;
    }

    setFuncionarioExclusaoPendente(funcionario);
    setResponsavelSelecionado(null);
    setSubstitutos([]);
    setSubstituicaoModo(null);
    setFiltroFuncionariosDisponiveis("");
    setFuncionarioAdicaoSelecionado(null);
    setFuncionarioSubstitutoSelecionado(null);
    setAcaoJustificativaTutor("exclusao");
    setJustificativaTutor("");
    setSubstituicaoError(null);
  }

  async function handleConfirmarRemocaoTutor() {
    if (!selectedEncontroSubstituicao || !funcionarioExclusaoPendente) {
      return;
    }

    if (!validarJustificativaTutor()) {
      return;
    }

    const confirmar = confirm(
      `Excluir ${funcionarioExclusaoPendente.nome} dos tutores deste encontro?`,
    );
    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/remover-tutor`, {
        method: "DELETE",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          encId: selectedEncontroSubstituicao.id,
          funId: funcionarioExclusaoPendente.id,
          justificativa: justificativaTutor.trim(),
        }),
      });

      await parseResponse(response, "Nao foi possivel remover o tutor.");
      alert("Tutor removido com sucesso.");

      const listaResponsaveis = await fetchResponsaveis(
        selectedEncontroSubstituicao.id,
      );
      setResponsaveis(listaResponsaveis);

      if (responsavelSelecionado?.id === funcionarioExclusaoPendente.id) {
        setResponsavelSelecionado(null);
        setSubstitutos([]);
        setSubstituicaoModo(null);
        setFiltroFuncionariosDisponiveis("");
      }

      limparJustificativaTutor();
      setSubstituicaoError(null);
    } catch (error) {
      setSubstituicaoError(error.message || "Erro de rede ao remover tutor.");
    }
  }

  function handleEditarEncontro(event, encontro) {
    event.stopPropagation();
    navigate(`/encontros/${encontro.id}`);
  }

  async function handleExcluirEncontro(event, encontro) {
    event.stopPropagation();

    const confirmar = window.confirm(`Deseja excluir o encontro #${encontro.id} em ${encontro.local}?`);
    if (!confirmar) {
      return;
    }

    try {
      setListError(null);
      const response = await fetch(`${API_URL}/excluir`, {
        method: "DELETE",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ id: encontro.id }),
      });

      await parseResponse(response, "Erro ao excluir encontro.");
      await carregarLista(filtro, activeView);
    } catch (error) {
      setListError(error.message || "Erro de rede ao excluir encontro.");
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
        "Informe pelo menos 15 caracteres de justificativa para concluir o cancelamento.",
      );
      return;
    }

    if (
      (cancelOption === "reagendar" ||
        cancelOption === "transferirInscritos") &&
      !reagendamentoDate
    ) {
      setCancelError("Informe a nova data para reagendamento.");
      return;
    }

    if (
      (cancelOption === "reagendar" ||
        cancelOption === "transferirInscritos") &&
      (!reagendamentoHora || !reagendamentoHoraFim)
    ) {
      setCancelError("Informe o horario de inicio e termino do reagendamento.");
      return;
    }

    if (
      (cancelOption === "reagendar" ||
        cancelOption === "transferirInscritos") &&
      responsaveisReagendamento.length === 0
    ) {
      setCancelError("Selecione pelo menos um responsavel para o reagendamento.");
      return;
    }

    const confirmarCancelamento = window.confirm(
      "Tem certeza de que deseja cancelar este encontro?\n\nUm encontro cancelado nao pode ser revertido.",
    );

    if (!confirmarCancelamento) {
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
          novaHora: reagendamentoHora,
          novaHoraFim: reagendamentoHoraFim,
          responsaveis: responsaveisReagendamento,
          materiais: materiaisReagendamento,
        }),
      });

      const json = await parseResponse(response, "Erro ao cancelar encontro.");

      let mensagem = "Encontro cancelado com sucesso.\n";
      mensagem += `Beneficiarios liberados: ${json.liberados?.beneficiarios ?? 0}\n`;
      mensagem += `Responsaveis liberados: ${json.liberados?.responsaveis ?? 0}\n`;
      mensagem += `Materiais liberados: ${json.liberados?.materiais ?? 0}`;

      if (json.reagendamento) {
        mensagem += `\nNovo encontro criado para ${formatDate(json.reagendamento.novaData)} ${formatTime(json.reagendamento.novaHora)} - ${formatTime(json.reagendamento.novaHoraFim)}.`;
        if (json.reagendamento.transferencia) {
          mensagem += " Inscritos transferidos automaticamente.";
        }
      }

      alert(mensagem);
      setSelectedEncontro(null);
      setSelectedHistorico(null);
      setImpacto(null);
      setCancelError(null);
      setFuncionariosReagendamento([]);
      setResponsaveisReagendamento([]);
      setMateriaisReagendamento([]);
      setMaterialReagendamentoDraft({ itemId: "", qtde: 1 });
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
    setFuncionariosReagendamento([]);
    setResponsaveisReagendamento([]);
    setMateriaisReagendamento([]);
    setMaterialReagendamentoDraft({ itemId: "", qtde: 1 });
  }

  function handleCloseSubstituicao() {
    setSelectedEncontroSubstituicao(null);
    setResponsaveis([]);
    setResponsavelSelecionado(null);
    setSubstitutos([]);
    setSubstituicaoModo(null);
    setFiltroFuncionariosDisponiveis("");
    limparJustificativaTutor();
    setSubstituicaoError(null);
  }

  function handleChangeView(nextView) {
    setActiveView(nextView);
    setSelectedEncontro(null);
    setSelectedHistorico(null);
    setSelectedHistoricoTutor(null);
    setImpacto(null);
    setCancelError(null);
    setFuncionariosReagendamento([]);
    setResponsaveisReagendamento([]);
    setMateriaisReagendamento([]);
    setMaterialReagendamentoDraft({ itemId: "", qtde: 1 });
    setSelectedEncontroSubstituicao(null);
    setResponsaveis([]);
    setResponsavelSelecionado(null);
    setSubstitutos([]);
    setSubstituicaoModo(null);
    setFiltroFuncionariosDisponiveis("");
    limparJustificativaTutor();
    setSubstituicaoError(null);
    setFiltro("");
    setDataInicial("");
    setDataFinal("");
    setFiltrosSubstituir({
      data: "",
      local: "",
      disponibilidade: "",
    });
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

  async function handleFinalizar(encontro) {
    const confirmar = confirm(
      `Finalizar encontro #${encontro.id} no local ${encontro.local}?`,
    );

    if (!confirmar) return;

    try {
      const response = await fetch(`${API_URL}/finalizar`, {
        method: "POST",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          id: encontro.id,
        }),
      });

      await parseResponse(response, "Erro ao finalizar encontro.");

      alert("Encontro finalizado com sucesso");

      carregarLista(filtro, activeView, dataInicial, dataFinal);
    } catch (error) {
      alert(error.message || "Erro ao finalizar encontro.");
    }
  }

  function handleChangeFiltroSubstituir(campo, valor) {
    setFiltrosSubstituir((filtrosAtuais) => ({
      ...filtrosAtuais,
      [campo]: valor,
    }));
  }

  function limparFiltrosSubstituir() {
    setFiltrosSubstituir({
      data: "",
      local: "",
      disponibilidade: "",
    });
  }

  useEffect(() => {
    carregarLista(filtro, activeView, dataInicial, dataFinal, {
      data: filtrosSubstituir.data,
      local: filtrosSubstituir.local.trim(),
      disponibilidade: filtrosSubstituir.disponibilidade,
    });
  }, [
    filtro,
    activeView,
    dataInicial,
    dataFinal,
    filtrosSubstituir.data,
    filtrosSubstituir.local,
    filtrosSubstituir.disponibilidade,
  ]);

  useEffect(() => {
    const deveCarregar =
      selectedEncontro &&
      (cancelOption === "reagendar" || cancelOption === "transferirInscritos") &&
      reagendamentoDate &&
      reagendamentoHora &&
      reagendamentoHoraFim;

    if (!deveCarregar) {
      setFuncionariosReagendamento([]);
      return;
    }

    let ignorarResposta = false;

    async function carregarFuncionariosReagendamento() {
      try {
        setLoadingFuncionariosReagendamento(true);
        const funcionarios = await fetchFuncionariosDisponiveisReagendamento(
          reagendamentoDate,
          reagendamentoHora,
          reagendamentoHoraFim,
          selectedEncontro.id,
        );

        if (ignorarResposta) {
          return;
        }

        const listaFuncionarios = Array.isArray(funcionarios) ? funcionarios : [];
        setFuncionariosReagendamento(listaFuncionarios);
        setResponsaveisReagendamento((selecionados) =>
          selecionados.filter((id) => listaFuncionarios.some((funcionario) => funcionario.id === id)),
        );
      } catch (error) {
        if (!ignorarResposta) {
          setFuncionariosReagendamento([]);
          setCancelError(error.message);
        }
      } finally {
        if (!ignorarResposta) {
          setLoadingFuncionariosReagendamento(false);
        }
      }
    }

    carregarFuncionariosReagendamento();

    return () => {
      ignorarResposta = true;
    };
  }, [
    selectedEncontro,
    cancelOption,
    reagendamentoDate,
    reagendamentoHora,
    reagendamentoHoraFim,
  ]);

  function alternarResponsavelReagendamento(funcionarioId) {
    setResponsaveisReagendamento((selecionados) =>
      selecionados.includes(funcionarioId)
        ? selecionados.filter((id) => id !== funcionarioId)
        : [...selecionados, funcionarioId],
    );
  }

  function adicionarMaterialReagendamento() {
    const itemId = Number(materialReagendamentoDraft.itemId);
    const qtde = Number(materialReagendamentoDraft.qtde);

    if (!itemId || !Number.isInteger(qtde) || qtde <= 0 || qtde > 999) {
      setCancelError("Selecione um material e uma quantidade entre 1 e 999.");
      return;
    }

    setMateriaisReagendamento((materiais) => {
      const existente = materiais.find((material) => material.itemId === itemId);
      if (existente) {
        return materiais.map((material) =>
          material.itemId === itemId
            ? { ...material, qtde: material.qtde + qtde }
            : material,
        );
      }

      return [...materiais, { itemId, qtde }];
    });
    setMaterialReagendamentoDraft({ itemId: "", qtde: 1 });
    setCancelError(null);
  }

  function removerMaterialReagendamento(itemId) {
    setMateriaisReagendamento((materiais) =>
      materiais.filter((material) => material.itemId !== itemId),
    );
  }

  function atualizarQuantidadeMaterialReagendamento(itemId, qtde) {
    const quantidade = Math.max(Math.min(Number(qtde), 999), 1);
    setMateriaisReagendamento((materiais) =>
      materiais.map((material) =>
        material.itemId === itemId ? { ...material, qtde: quantidade } : material,
      ),
    );
  }

  function obterItemReagendamento(itemId) {
    return itensReagendamento.find((item) => Number(item.id) === Number(itemId));
  }

  const encontrosExibidos =
    activeView === views.substituir
      ? encontros.filter((encontro) => {
          const filtroDataOk =
            !filtrosSubstituir.data ||
            getDateInputValue(encontro.data) === filtrosSubstituir.data;
          const filtroLocalOk =
            !filtrosSubstituir.local.trim() ||
            String(encontro.local || "")
              .toLowerCase()
              .includes(filtrosSubstituir.local.trim().toLowerCase());
          const filtroDisponibilidadeOk =
            !filtrosSubstituir.disponibilidade ||
            encontro.disponibilidade === filtrosSubstituir.disponibilidade;

          return filtroDataOk && filtroLocalOk && filtroDisponibilidadeOk;
        })
      : encontros;

  const substitutosExibidos = substitutos.filter((funcionario) => {
    const termo = filtroFuncionariosDisponiveis.trim().toLowerCase();
    if (!termo) {
      return true;
    }

    return (
      String(funcionario.nome || "").toLowerCase().includes(termo) ||
      String(funcionario.usuario || "").toLowerCase().includes(termo)
    );
  });

  function renderFiltroListaEncontros() {
    return (
      <Styled.FilterBar>
        {activeView === views.substituir ? (
          <Styled.DateFilterGroup>
            <label>
              Data
              <input
                type="date"
                value={filtrosSubstituir.data}
                onChange={(e) =>
                  handleChangeFiltroSubstituir("data", e.target.value)
                }
              />
            </label>
            <label>
              Local
              <input
                type="text"
                placeholder="Digite o local"
                value={filtrosSubstituir.local}
                onChange={(e) =>
                  handleChangeFiltroSubstituir("local", e.target.value)
                }
              />
            </label>
            <label>
              Disponibilidade
              <select
                value={filtrosSubstituir.disponibilidade}
                onChange={(e) =>
                  handleChangeFiltroSubstituir(
                    "disponibilidade",
                    e.target.value,
                  )
                }>
                {disponibilidades.map((disponibilidade) => (
                  <option
                    key={disponibilidade.value}
                    value={disponibilidade.value}>
                    {disponibilidade.label}
                  </option>
                ))}
              </select>
            </label>
            {(filtrosSubstituir.data ||
              filtrosSubstituir.local ||
              filtrosSubstituir.disponibilidade) && (
              <button type="button" onClick={limparFiltrosSubstituir}>
                Limpar
              </button>
            )}
          </Styled.DateFilterGroup>
        ) : (
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
        )}

        {activeView === views.cancelar && (
          <Styled.DateFilterGroup>
            <label>
              De
              <input
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </label>
            <label>
              Ate
              <input
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </label>
            {(dataInicial || dataFinal) && (
              <button
                type="button"
                onClick={() => {
                  setDataInicial("");
                  setDataFinal("");
                }}>
                Limpar
              </button>
            )}
          </Styled.DateFilterGroup>
        )}
      </Styled.FilterBar>
    );
  }

  function renderJustificativaTutor(mostrarAcoesExclusao = false) {
    if (!acaoJustificativaTutor) {
      return null;
    }

    return (
      <Styled.JustificationBox>
        <label>
          {getMensagemJustificativaTutor(acaoJustificativaTutor)}
          <textarea
            value={justificativaTutor}
            onChange={(event) => {
              setJustificativaTutor(event.target.value);
              if (event.target.value.trim()) {
                setSubstituicaoError(null);
              }
            }}
          />
        </label>
        {acaoJustificativaTutor === "adicao" && (
          <Styled.JustificationActions>
            <button
              type="button"
              className="success"
              onClick={handleConfirmarAdicaoTutor}>
              Confirmar adição
            </button>
          </Styled.JustificationActions>
        )}
        {acaoJustificativaTutor === "substituicao" && (
          <Styled.JustificationActions>
            <button
              type="button"
              className="success"
              onClick={handleConfirmarSubstituicao}>
              Confirmar substituição
            </button>
          </Styled.JustificationActions>
        )}
        {acaoJustificativaTutor === "exclusao" && mostrarAcoesExclusao && (
          <Styled.JustificationActions>
            <button type="button" onClick={handleConfirmarRemocaoTutor}>
              Confirmar exclusao
            </button>
            <button
              type="button"
              className="secondary"
              onClick={limparJustificativaTutor}>
              Cancelar
            </button>
          </Styled.JustificationActions>
        )}
      </Styled.JustificationBox>
    );
  }

  function getTituloSubstituicaoTutor() {
    if (!selectedEncontroSubstituicao) {
      return "";
    }

    if (substituicaoModo === "adicionar") {
      return `Adicionar tutor do encontro #${selectedEncontroSubstituicao.id}`;
    }

    if (substituicaoModo === "substituir") {
      return `Substituir tutor do encontro #${selectedEncontroSubstituicao.id}`;
    }

    return `Substituir/adicionar tutor do encontro #${selectedEncontroSubstituicao.id}`;
  }

  return (
    <>
      <Header />
      <Styled.PageHeader>
        <Styled.PageTitle>Gerenciamento de Encontros</Styled.PageTitle>
        <Styled.EncontroOptions>
          <button
            type="button"
            className={activeView === views.encontros ? "active" : ""}
            onClick={() => handleChangeView(views.encontros)}>
            Encontros
          </button>

          <button
            type="button"
            className={activeView === views.finalizar ? "active" : ""}
            onClick={() => handleChangeView(views.finalizar)}>
            Finalizar Encontro
          </button>

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
            Substituir/adicionar Tutores
          </button>

          <button
            type="button"
            className={activeView === views.cancelados ? "active" : ""}
            onClick={() => handleChangeView(views.cancelados)}>
            Encontros Cancelados
          </button>

          <button
            type="button"
            className={activeView === views.tutoresModificados ? "active" : ""}
            onClick={() => handleChangeView(views.tutoresModificados)}>
            Tutores substituidos/adicionados
          </button>
        </Styled.EncontroOptions>
      </Styled.PageHeader>
      <main>
        {activeView !== views.tutoresModificados &&
          !(activeView === views.substituir && selectedEncontroSubstituicao) &&
          renderFiltroListaEncontros()}
        <Styled.Actions>
          {activeView !== views.cancelados &&
            activeView !== views.tutoresModificados && (
            <button onClick={() => navigate("/encontros/cadastro")}>
              + Cadastrar Encontro
            </button>
          )}
        </Styled.Actions>

        {activeView === views.finalizar && (
          <Styled.ModeMessage>
            Selecione um encontro para finalizar.
          </Styled.ModeMessage>
        )}

        {activeView === views.cancelar && (
          <Styled.ModeMessage>
            Selecione um encontro ativo para analisar o impacto e executar o
            cancelamento.
          </Styled.ModeMessage>
        )}

        {activeView === views.substituir && !selectedEncontroSubstituicao && (
          <Styled.ModeMessage>
            Selecione abaixo o encontro para substituir tutor.
          </Styled.ModeMessage>
        )}

        {activeView === views.cancelados && (
          <Styled.ModeMessage>
            Consulte o histórico de cancelamentos, o motivo registrado e a ação
            tomada após cada evento.
          </Styled.ModeMessage>
        )}

        {activeView === views.tutoresModificados && !selectedHistoricoTutor && (
          <Styled.ModeMessage>
            Consulte as substituicoes, adicoes e exclusoes de tutores.
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
                <strong>Beneficiários inscritos:</strong>{" "}
                {impacto.beneficiarios}
              </div>
              <div>
                <strong>Responsáveis vinculados:</strong> {impacto.responsaveis}
              </div>
              <div>
                <strong>Materiais vinculados:</strong> {impacto.materiais}
              </div>
              <div>
                <strong>Próximo da data:</strong>{" "}
                {impacto.proximo ? "Sim" : "Nao"}
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
              Motivo obrigatório:
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}>
                <option value="">Selecione</option>
                {motivos.map((motivo) => (
                  <option key={motivo.value} value={motivo.value}>
                    {motivo.label}
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
              <strong>Opcao após cancelamento:</strong>
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
                Cancelar sem reposição
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
            {(cancelOption === "reagendar" ||
              cancelOption === "transferirInscritos") && (
              <Styled.ReagendamentoPanel>
                <h3>Dados do reagendamento</h3>
                <Styled.ReagendamentoGrid>
                  <label>
                    Nova data do encontro:
                    <input
                      type="date"
                      value={reagendamentoDate}
                      onChange={(e) => setReagendamentoDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Horario de inicio:
                    <input
                      type="time"
                      step="300"
                      value={reagendamentoHora}
                      onChange={(e) => setReagendamentoHora(e.target.value)}
                    />
                  </label>
                  <label>
                    Horario de termino:
                    <input
                      type="time"
                      step="300"
                      value={reagendamentoHoraFim}
                      onChange={(e) => setReagendamentoHoraFim(e.target.value)}
                    />
                  </label>
                </Styled.ReagendamentoGrid>

                <Styled.ReagendamentoSectionTitle>
                  Funcionarios responsaveis
                </Styled.ReagendamentoSectionTitle>
                {loadingFuncionariosReagendamento ? (
                  <Styled.EmptyState>Carregando funcionarios disponiveis...</Styled.EmptyState>
                ) : funcionariosReagendamento.length === 0 ? (
                  <Styled.EmptyState>
                    Nenhum funcionario disponivel para a data e horario informados.
                  </Styled.EmptyState>
                ) : (
                  <Styled.CompactTable>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Usuario</th>
                        <th>Cargo</th>
                        <th>Selecionar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funcionariosReagendamento.map((funcionario) => {
                        const selecionado = responsaveisReagendamento.includes(funcionario.id);

                        return (
                          <tr
                            key={funcionario.id}
                            className={selecionado ? "selected" : ""}
                            onClick={() => alternarResponsavelReagendamento(funcionario.id)}>
                            <td>{funcionario.id}</td>
                            <td>{funcionario.nome}</td>
                            <td>{funcionario.usuario}</td>
                            <td>{funcionario.cargo}</td>
                            <td>
                              <input
                                type="checkbox"
                                checked={selecionado}
                                onChange={() => alternarResponsavelReagendamento(funcionario.id)}
                                onClick={(event) => event.stopPropagation()}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Styled.CompactTable>
                )}
                <Styled.SelectionInfo>
                  Responsaveis selecionados: <strong>{responsaveisReagendamento.length}</strong>
                </Styled.SelectionInfo>

                <Styled.ReagendamentoSectionTitle>
                  Materiais reservados
                </Styled.ReagendamentoSectionTitle>
                <Styled.MaterialPicker>
                  <label>
                    Material
                    <select
                      value={materialReagendamentoDraft.itemId}
                      onChange={(event) =>
                        setMaterialReagendamentoDraft((draft) => ({
                          ...draft,
                          itemId: event.target.value,
                        }))
                      }>
                      <option value="">Selecione um item cadastrado</option>
                      {itensReagendamento.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nome} {item.tipo ? `- ${item.tipo}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Quantidade
                    <input
                      type="number"
                      min="1"
                      max="999"
                      step="1"
                      value={materialReagendamentoDraft.qtde}
                      onChange={(event) =>
                        setMaterialReagendamentoDraft((draft) => ({
                          ...draft,
                          qtde: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <button type="button" onClick={adicionarMaterialReagendamento}>
                    Adicionar
                  </button>
                </Styled.MaterialPicker>

                {materiaisReagendamento.length === 0 ? (
                  <Styled.EmptyState>
                    Nenhum material reservado para o encontro reagendado.
                  </Styled.EmptyState>
                ) : (
                  <Styled.MaterialList>
                    {materiaisReagendamento.map((material) => {
                      const item = obterItemReagendamento(material.itemId);

                      return (
                        <li key={material.itemId}>
                          <div>
                            <strong>{item?.nome || `Item #${material.itemId}`}</strong>
                            <span>{item?.tipo || "Item"}</span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="999"
                            step="1"
                            value={material.qtde}
                            onChange={(event) =>
                              atualizarQuantidadeMaterialReagendamento(
                                material.itemId,
                                event.target.value,
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() => removerMaterialReagendamento(material.itemId)}>
                            Remover
                          </button>
                        </li>
                      );
                    })}
                  </Styled.MaterialList>
                )}
              </Styled.ReagendamentoPanel>
            )}
            {cancelError && (
              <Styled.InlineError>{cancelError}</Styled.InlineError>
            )}
            <Styled.CancelActions>
              <button
                type="button"
                onClick={handleSubmitCancelamento}
                disabled={cancelLoading}>
                {cancelLoading ? "Cancelando..." : "Confirmar cancelamento"}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={handleCloseCancelamento}>
                Fechar
              </button>
            </Styled.CancelActions>
          </Styled.CancelCard>
        )}

        {selectedEncontroSubstituicao && (
          <Styled.SubstituteCard>
            <h2>{getTituloSubstituicaoTutor()}</h2>
            <p>
              Local: <strong>{selectedEncontroSubstituicao.local}</strong>
            </p>
            <p>
              Data:{" "}
              <strong>{formatDate(selectedEncontroSubstituicao.data)}</strong>
            </p>

            <Styled.SubstituteSection>
              <h3>Funcionários responsáveis atuais</h3>
              {!responsavelSelecionado && (
                <p>
                  Selecione um funcionário abaixo para listar os substitutos
                  disponíveis.
                </p>
              )}
              {responsaveis.length === 0 ? (
                <Styled.EmptyState>
                  Nenhum funcionário responsável esta vinculado a este encontro.
                </Styled.EmptyState>
              ) : (
                <Styled.MiniTable>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>nome</th>
                      <th>usuário</th>
                      <th>cargo</th>
                      <th>cpf</th>
                      <th>telefone</th>
                      <th>ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responsaveis.map((funcionario) => (
                      <tr
                        key={funcionario.id}
                        className={
                          responsavelSelecionado?.id === funcionario.id
                            ? "selected"
                            : ""
                        }
                        onClick={() => handleSelectResponsavel(funcionario)}>
                        <td>{funcionario.id}</td>
                        <td>{funcionario.nome}</td>
                        <td>{funcionario.usuario}</td>
                        <td>{funcionario.cargo}</td>
                        <td>{funcionario.cpf}</td>
                        <td>{funcionario.telefone}</td>
                        <td>
                          <Styled.TableActionGroup>
                            <Styled.SelectButton
                              type="button"
                              className={
                                responsavelSelecionado?.id === funcionario.id
                                  ? "neutral"
                                  : ""
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                handleSelectResponsavel(funcionario);
                              }}>
                              Substituir
                            </Styled.SelectButton>
                            <Styled.DeleteButton
                              type="button"
                              onClick={(event) =>
                                handleSolicitarRemocaoTutor(event, funcionario)
                              }>
                              Excluir
                            </Styled.DeleteButton>
                          </Styled.TableActionGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Styled.MiniTable>
              )}
              {acaoJustificativaTutor === "exclusao" &&
                renderJustificativaTutor(true)}
            </Styled.SubstituteSection>

            {(responsavelSelecionado || substituicaoModo === "adicionar") && (
              <Styled.SubstituteSection>
                <h3>
                  {substituicaoModo === "adicionar"
                    ? "Funcionários disponíveis para adicionar"
                    : `Substitutos disponíveis para ${responsavelSelecionado.nome}`}
                </h3>
                {substituicaoModo !== "adicionar" && (
                  <p>
                    A lista abaixo exclui funcionários já vinculados a outro
                    encontro ativo na mesma data.
                  </p>
                )}
                {substitutos.length > 0 && (
                  <Styled.MiniFilter>
                    <label>
                      Buscar por nome ou usuario
                      <input
                        type="text"
                        placeholder="Digite nome ou usuario"
                        value={filtroFuncionariosDisponiveis}
                        onChange={(event) =>
                          setFiltroFuncionariosDisponiveis(event.target.value)
                        }
                      />
                    </label>
                  </Styled.MiniFilter>
                )}
                {substitutosExibidos.length === 0 ? (
                  <Styled.EmptyState>
                    {filtroFuncionariosDisponiveis.trim()
                      ? "Nenhum funcionario encontrado para o filtro atual."
                      : substituicaoModo === "adicionar"
                      ? "Nenhum funcionário disponível foi encontrado para adicionar."
                      : "Nenhum funcionário disponível foi encontrado para substituir este tutor."}
                  </Styled.EmptyState>
                ) : (
                  <Styled.MiniTable>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>nome</th>
                        <th>usuário</th>
                        <th>cargo</th>
                        <th>cpf</th>
                        <th>telefone</th>
                        <th>ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {substitutosExibidos.map((funcionario) => (
                        <tr
                          key={funcionario.id}
                          className={
                            (substituicaoModo === "adicionar" &&
                              funcionarioAdicaoSelecionado?.id ===
                                funcionario.id) ||
                            (substituicaoModo === "substituir" &&
                              funcionarioSubstitutoSelecionado?.id ===
                                funcionario.id)
                              ? "selected-neutral"
                              : ""
                          }>
                          <td>{funcionario.id}</td>
                          <td>{funcionario.nome}</td>
                          <td>{funcionario.usuario}</td>
                          <td>{funcionario.cargo}</td>
                          <td>{funcionario.cpf}</td>
                          <td>{funcionario.telefone}</td>
                          <td>
                            <Styled.SelectButton
                              type="button"
                              className={
                                (substituicaoModo === "adicionar" &&
                                  funcionarioAdicaoSelecionado?.id ===
                                    funcionario.id) ||
                                (substituicaoModo === "substituir" &&
                                  funcionarioSubstitutoSelecionado?.id ===
                                    funcionario.id)
                                  ? "neutral"
                                  : ""
                              }
                              onClick={() => {
                                if (substituicaoModo === "adicionar") {
                                  handleSelecionarAdicaoTutor(funcionario);
                                  return;
                                }

                                handleSelecionarSubstituto(funcionario);
                              }}>
                              Selecionar
                            </Styled.SelectButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Styled.MiniTable>
                )}
                {acaoJustificativaTutor !== "exclusao" &&
                  renderJustificativaTutor()}
              </Styled.SubstituteSection>
            )}

            {substituicaoError && (
              <Styled.InlineError>{substituicaoError}</Styled.InlineError>
            )}

            <Styled.CancelActions>
              <button
                type="button"
                className={substituicaoModo === "adicionar" ? "active" : "secondary"}
                onClick={handleOpenAdicionarTutor}>
                Adicionar
              </button>
              <button
                type="button"
                className="secondary"
                onClick={handleCloseSubstituicao}>
                Fechar
              </button>
            </Styled.CancelActions>
          </Styled.SubstituteCard>
        )}

        {activeView === views.substituir &&
          selectedEncontroSubstituicao &&
          renderFiltroListaEncontros()}

        {selectedHistorico && activeView === views.cancelados && (
          <Styled.CancelCard>
            <h2>Histórico do encontro cancelado #{selectedHistorico.id}</h2>
            <p>
              Local: <strong>{selectedHistorico.local}</strong>
            </p>
            <p>
              Data original:{" "}
              <strong>{formatDate(selectedHistorico.data)}</strong>
            </p>
            <Styled.HistoryGrid>
              <div>
                <strong>Quem cancelou:</strong>
                <div>{formatCanceladoPor(selectedHistorico)}</div>
              </div>
              <div>
                <strong>Data e hora do cancelamento:</strong>
                <div>
                  {formatDate(selectedHistorico.dataCancelamento, true)}
                </div>
              </div>
              <div>
                <strong>Motivo:</strong>
                <div>
                  {selectedHistorico.motivoCancelamento
                    ? getMotivoCancelamentoLabel(selectedHistorico.motivoCancelamento)
                    : "Não informado"}
                </div>
              </div>
              <div>
                <strong>Ação após cancelamento:</strong>
                <div>
                  {getAcaoCancelamentoLabel(selectedHistorico.acaoCancelamento)}
                </div>
              </div>
              <div>
                <strong>Novo encontro:</strong>
                <div>
                  {selectedHistorico.reagendadoPara
                    ? `#${selectedHistorico.reagendadoPara}`
                    : "Não houve"}
                </div>
              </div>
              <div>
                <strong>Beneficiários afetados:</strong>
                <div>{selectedHistorico.beneficiariosAfetados ?? 0}</div>
              </div>
              <div>
                <strong>Responsáveis afetados:</strong>
                <div>{selectedHistorico.responsaveisAfetados ?? 0}</div>
              </div>
              <div>
                <strong>Materiais afetados:</strong>
                <div>{selectedHistorico.materiaisAfetados ?? 0}</div>
              </div>
            </Styled.HistoryGrid>
            <label>
              Detalhamento registrado:
              <textarea
                value={selectedHistorico.detalhesCancelamento || ""}
                readOnly
              />
            </label>
          </Styled.CancelCard>
        )}

        {loadingImpacto && (
          <Styled.ModeMessage>
            Carregando impacto do cancelamento...
          </Styled.ModeMessage>
        )}

        {selectedHistoricoTutor && activeView === views.tutoresModificados && (
          <Styled.CancelCard>
            <h2>Detalhes da modificacao #{selectedHistoricoTutor.id}</h2>
            <Styled.HistoryGrid>
              <div>
                <strong>Acao:</strong>
                <div>{getAcaoTutorLabel(selectedHistoricoTutor.acao)}</div>
              </div>
              <div>
                <strong>Data de modificacao:</strong>
                <div>{formatDate(selectedHistoricoTutor.dataModificacao, true)}</div>
              </div>
              <div>
                <strong>Funcionario:</strong>
                <div>
                  {selectedHistoricoTutor.nome} ({selectedHistoricoTutor.usuario})
                </div>
              </div>
              {selectedHistoricoTutor.funcionarioAnteriorNome && (
                <div>
                  <strong>Funcionario substituido:</strong>
                  <div>
                    {selectedHistoricoTutor.funcionarioAnteriorNome} (
                    {selectedHistoricoTutor.funcionarioAnteriorUsuario})
                  </div>
                </div>
              )}
            </Styled.HistoryGrid>
            <label>
              Descricao:
              <textarea
                value={selectedHistoricoTutor.justificativa || ""}
                readOnly
              />
            </label>
            <Styled.CancelActions>
              <button
                type="button"
                className="secondary"
                onClick={() => setSelectedHistoricoTutor(null)}>
                Fechar
              </button>
            </Styled.CancelActions>
          </Styled.CancelCard>
        )}

        {activeView === views.tutoresModificados ? (
          historicoTutores.length === 0 ? (
            <Styled.EmptyState>
              Nenhuma modificacao de tutor encontrada.
            </Styled.EmptyState>
          ) : (
            <Styled.Table>
              <thead>
                <tr>
                  <th>Acao</th>
                  <th>Data de modificacao</th>
                  <th>Nome</th>
                  <th>Usuario</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {historicoTutores.map((item) => (
                  <tr key={item.id}>
                    <td>{getAcaoTutorLabel(item.acao)}</td>
                    <td>{formatDate(item.dataModificacao, true)}</td>
                    <td>{item.nome}</td>
                    <td>{item.usuario}</td>
                    <td>
                      <Styled.TableSecondaryButton
                        type="button"
                        onClick={() => setSelectedHistoricoTutor(item)}>
                        Detalhes
                      </Styled.TableSecondaryButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Styled.Table>
          )
        ) : encontrosExibidos.length === 0 ? (
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
                <th>Horário</th>

                {activeView === views.cancelados ? (
                  <>
                    <th>Data cancelamento</th>
                    <th>Motivo</th>
                    <th>Ação</th>
                    <th>Ações</th>
                  </>
                ) : (
                  <>
                    <th>QtdeMax</th>
                    <th>Qtde</th>
                    <th>Disponibilidade</th>

                    {(activeView === views.cancelar ||
                      activeView === views.substituir ||
                      activeView === views.finalizar ||
                      activeView === views.encontros) && <th>Ações</th>}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {encontrosExibidos.map((encontro) => (
                <tr key={encontro.id} onClick={() => handleRowClick(encontro)}>
                  <td>{encontro.id}</td>
                  <td>{encontro.local}</td>
                  <td>{formatDate(encontro.data)}</td>
                  <td>
                    {formatTime(encontro.hora)}
                    {encontro.horaFim
                      ? ` - ${formatTime(encontro.horaFim)}`
                      : ""}
                  </td>
                  {activeView === views.cancelados ? (
                    <>
                      <td>{formatDate(encontro.dataCancelamento, true)}</td>
                      <td>
                        {encontro.motivoCancelamento
                          ? getMotivoCancelamentoLabel(encontro.motivoCancelamento)
                          : "-"}
                      </td>
                      <td>
                        {getAcaoCancelamentoLabel(encontro.acaoCancelamento)}
                      </td>
                      <td>
                        <Styled.TableSecondaryButton
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedHistorico(encontro);
                          }}>
                          Ver histórico
                        </Styled.TableSecondaryButton>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{encontro.qtdeMax}</td>
                      <td>{encontro.qtde}</td>
                      <td>
                        {getDisponibilidadeLabel(encontro.disponibilidade)}
                      </td>
                      {activeView === views.encontros && (
                        <td>
                          <Styled.TableActionGroup>
                            <Styled.TableSelectButton
                              type="button"
                              onClick={(event) => handleEditarEncontro(event, encontro)}>
                              Editar
                            </Styled.TableSelectButton>
                            <Styled.TableCancelButton
                              type="button"
                              onClick={(event) => handleExcluirEncontro(event, encontro)}>
                              Excluir
                            </Styled.TableCancelButton>
                          </Styled.TableActionGroup>
                        </td>
                      )}
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
                      {activeView === views.finalizar && (
                        <td>
                          <Styled.TableSelectButton
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleFinalizar(encontro);
                            }}>
                            Finalizar
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
