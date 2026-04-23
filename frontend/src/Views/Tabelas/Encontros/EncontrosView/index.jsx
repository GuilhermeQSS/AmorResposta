import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const motivos = [
  "falta de beneficiários mínimos",
  "ausência de tutor/funcionário responsável",
  "indisponibilidade do local",
  "problema climático",
  "falta de materiais/itens necessários",
  "conflito de agenda",
  "motivo emergencial/outros",
];

function EncontrosView() {
  function fetchEncontroLista(filtro, status = "ativos") {
    return fetch(
      `http://localhost:3000/encontros/listar?status=${status}&filtro=${encodeURIComponent(
        filtro
      )}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .catch((error) => alert(error));
  }

  function fetchImpacto(id) {
    return fetch(`http://localhost:3000/encontros/impacto?id=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .catch((error) => alert(error));
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

      let mensagem = `Encontro cancelado com sucesso. Motivo: ${cancelReason}`;
      if (json.reagendamento) {
        mensagem += `\nNovo encontro criado para ${json.reagendamento.novaData}`;
        if (json.reagendamento.transferencia) {
          mensagem += ` e inscritos transferidos.`;
        }
      }

      alert(mensagem);
      setSelectedEncontro(null);
      setImpacto(null);
      setCancelError(null);
      setFiltro("");
      const info = await fetchEncontroLista("");
      setEncontros(info);
    } catch (error) {
      setCancelError("Erro de rede ao cancelar encontro.");
    }
  }

  function handleCloseCancelamento() {
    setSelectedEncontro(null);
    setImpacto(null);
    setCancelError(null);
  }

  const [encontros, setEncontros] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selectedEncontro, setSelectedEncontro] = useState(null);
  const [impacto, setImpacto] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDetails, setCancelDetails] = useState("");
  const [cancelOption, setCancelOption] = useState("semReposicao");
  const [reagendamentoDate, setReagendamentoDate] = useState("");
  const [cancelError, setCancelError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      const info = await fetchEncontroLista(filtro);
      setEncontros(info);
    }
    carregar();
  }, [filtro]);

  return (
    <>
      <Header />
      <Styled.PageHeader>
        <Styled.PageTitle>Encontros</Styled.PageTitle>
        <Styled.EncontroOptions>
          <button type="button" className="active">
            Encontros
          </button>
          <button type="button">Finalizar Encontro</button>
          <button type="button">Cancelar Encontro</button>
          <button type="button">Substituir Tutor</button>
          <button
            type="button"
            onClick={async () => {
              const info = await fetchEncontroLista("", "cancelados");
              setEncontros(info);
            }}>
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
          <button onClick={() => navigate("/encontros/cadastro")}>
            + Cadastrar Encontro
          </button>
        </Styled.Actions>

        {selectedEncontro && impacto && (
          <Styled.CancelCard>
            <h2>Cancelar encontro #{selectedEncontro.id}</h2>
            <p>
              Local: <strong>{selectedEncontro.local}</strong>
            </p>
            <p>
              Data: <strong>{selectedEncontro.data?.split("T")[0].split("-").reverse().join("/")}</strong>
            </p>
            <Styled.Summary>
              <div>
                <strong>Beneficiários inscritos:</strong> {impacto.beneficiarios}
              </div>
              <div>
                <strong>Responsáveis vinculados:</strong> {impacto.responsaveis}
              </div>
              <div>
                <strong>Materiais vinculados:</strong> {impacto.materiais}
              </div>
              <div>
                <strong>Documentos vinculados:</strong> {impacto.documentos}
              </div>
              <div>
                <strong>Observações vinculadas:</strong> {impacto.observacoes}
              </div>
              <div>
                <strong>Próximo da data:</strong>{" "}
                {impacto.proximo ? "Sim" : "Não"}
              </div>
            </Styled.Summary>
            <label>
              Motivo obrigatório:
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
              <strong>Opção após cancelamento:</strong>
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

        <Styled.Table>
          <thead>
            <tr>
              <th>#</th>
              <th>local</th>
              <th>data</th>
              <th>qtdeMax</th>
              <th>qtde</th>
              <th>disponibilidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {encontros.map((f) => (
              <tr key={f.id} onClick={() => navigate(`/encontros/${f.id}`)}>
                <td>{f.id}</td>
                <td>{f.local}</td>
                <td>
                  {f.data
                    ? f.data.split("T")[0].split("-").reverse().join("/")
                    : ""}
                </td>
                <td>{f.qtdeMax}</td>
                <td>{f.qtde}</td>
                <td>
                  {f.disponibilidade === "A"
                    ? "Ativo"
                    : f.disponibilidade === "E"
                    ? "Em Andamento"
                    : f.disponibilidade === "F"
                    ? "Finalizado"
                    : f.disponibilidade === "C"
                    ? "Cancelado"
                    : "Desconhecido"}
                </td>
                <td>
                  {f.disponibilidade !== "C" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCancelar(f);
                      }}>
                      Cancelar
                    </button>
                  )}
                </td>
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
