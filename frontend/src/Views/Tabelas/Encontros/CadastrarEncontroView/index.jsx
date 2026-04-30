import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/encontros";
const ITENS_API_URL = "http://localhost:3000/itens";
const LOCAL_REGEX = /^[A-Za-zÀ-ÿ0-9\s.,ºª°\-()]{3,80}$/;

function criarDataHora(data, hora) {
  if (!data || !hora) return null;
  const dataHora = new Date(`${data}T${hora}`);
  return Number.isNaN(dataHora.getTime()) ? null : dataHora;
}

function formatarResumoData(data, hora, horaFim) {
  const dataHora = criarDataHora(data, hora);
  if (!dataHora) return "Data e hora ainda não definidas";

  const inicio = dataHora.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return horaFim ? `${inicio} até ${horaFim}` : inicio;
}

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("token");
  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`,
  };
}

function CadastrarEncontroView() {
  const [erros, setErros] = useState({});
  const [funcionariosDisponiveis, setFuncionariosDisponiveis] = useState([]);
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState([]);
  const [itensDisponiveis, setItensDisponiveis] = useState([]);
  const [materiaisSelecionados, setMateriaisSelecionados] = useState([]);
  const [materialDraft, setMaterialDraft] = useState({ itemId: "", qtde: 1 });
  const [form, setForm] = useState({
    id: 0,
    data: "",
    hora: "",
    horaFim: "",
    disponibilidade: "",
    qtdeMax: 0,
    local: "",
  });
  const navigate = useNavigate();

  const dataHoraSelecionada = criarDataHora(form.data, form.hora);
  const horaInicioMinutos = form.hora ? Number(form.hora.split(":")[0]) * 60 + Number(form.hora.split(":")[1]) : null;
  const horaFimMinutos = form.horaFim ? Number(form.horaFim.split(":")[0]) * 60 + Number(form.horaFim.split(":")[1]) : null;
  const encontroNoPassado = dataHoraSelecionada ? dataHoraSelecionada < new Date() : false;
  const terminoInvalido = horaInicioMinutos !== null && horaFimMinutos !== null && horaFimMinutos <= horaInicioMinutos;
  const vagasRestantes = Math.max(Number(form.qtdeMax || 0), 0);
  const responsaveisSelecionados = funcionariosDisponiveis.filter((funcionario) =>
    funcionariosSelecionados.includes(funcionario.id)
  );
  const materiaisResumo = materiaisSelecionados.map((material) => {
    const item = itensDisponiveis.find((itemDisponivel) => itemDisponivel.id === material.itemId);
    return {
      ...material,
      nome: item?.nome || `Item #${material.itemId}`,
      tipo: item?.tipo || "Item",
    };
  });
  const criteriosPlanejamento = [
    { texto: "Data e hora futuras", pronto: Boolean(form.data && form.hora && form.horaFim && !encontroNoPassado && !terminoInvalido) },
    { texto: "Local definido", pronto: form.local.trim().length >= 3 },
    { texto: "Capacidade válida", pronto: form.qtdeMax > 0 },
    { texto: "Pelo menos um responsável", pronto: funcionariosSelecionados.length > 0 },
  ];
  const prontidao = Math.round(
    (criteriosPlanejamento.filter((criterio) => criterio.pronto).length / criteriosPlanejamento.length) * 100
  );

  function validar() {
    const novosErros = {};
    if (!form.data) novosErros.data = "Data obrigatória";
    if (!form.hora) novosErros.hora = "Hora obrigatória";
    if (!form.horaFim) novosErros.horaFim = "Horário de término obrigatório";
    if (terminoInvalido) novosErros.horaFim = "Término precisa ser depois do início";
    if (!form.disponibilidade) novosErros.disponibilidade = "Selecione uma opção";
    if (!form.local.trim()) novosErros.local = "Local obrigatório";
    if (form.local.trim() && form.local.trim().length < 3) novosErros.local = "Informe um local mais detalhado";
    if (form.local.trim() && !LOCAL_REGEX.test(form.local.trim())) {
      novosErros.local = "Use apenas letras, numeros e pontuacao simples";
    }
    if (encontroNoPassado) novosErros.data = "Agende para uma data e hora futuras";
    if (!Number.isInteger(form.qtdeMax) || form.qtdeMax === 0) novosErros.qtdeMax = "Informe a quantidade máxima";
    if (form.qtdeMax <= 0) {
      novosErros.qtdeMax = "Deve ser maior que 0";
    }
    if (form.qtdeMax > 500) {
      novosErros.qtdeMax = "Informe no maximo 500 vagas";
    }
    if (funcionariosSelecionados.length === 0) {
      novosErros.responsaveis = "Selecione pelo menos um funcionário responsável";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function fetchFuncionariosDisponiveis(data, hora, horaFim) {
    try {
      const params = new URLSearchParams({ data, hora, horaFim });
      const response = await fetch(`${API_URL}/funcionarios-disponiveis?${params.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.err || "Erro ao carregar funcionários disponíveis");
      }

      const dataJson = await response.json();
      setFuncionariosDisponiveis(Array.isArray(dataJson) ? dataJson : []);
    } catch (error) {
      setFuncionariosDisponiveis([]);
      alert(error.message || "Erro ao carregar funcionários");
    }
  }

  async function fetchCadastrarEncontro() {
    if (!validar()) return;
    try {
      const response = await fetch(`${API_URL}/gravar`, {
        method: "POST",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          data: form.data,
          hora: form.hora,
          horaFim: form.horaFim,
          disponibilidade: form.disponibilidade,
          qtdeMax: form.qtdeMax,
          qtde: 0,
          local: form.local.trim(),
          responsaveis: funcionariosSelecionados,
          materiais: materiaisSelecionados,
        }),
      });
      if (response.ok) {
        navigate("/tabelas/encontros");
      } else {
        const json = await response.json();
        setErros(json.campos || {});
        alert(json.err || "Erro desconhecido no servidor");
      }
    } catch {
      alert("Erro ao atualizar");
    }
  }

  function atualizarForm(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "qtdeMax" ? Number(value) : value,
    }));
  }

  function alternarFuncionario(funId) {
    setFuncionariosSelecionados((prev) =>
      prev.includes(funId) ? prev.filter((id) => id !== funId) : [...prev, funId]
    );
  }

  async function fetchItensDisponiveis() {
    try {
      const response = await fetch(`${ITENS_API_URL}/listar?nome=&tipo=`, { method: "GET" });
      const dataJson = await response.json();

      if (!response.ok) {
        throw new Error(dataJson.err || "Erro ao carregar itens");
      }

      setItensDisponiveis(Array.isArray(dataJson) ? dataJson : []);
    } catch (error) {
      setItensDisponiveis([]);
      alert(error.message || "Erro ao carregar itens");
    }
  }

  function adicionarMaterial() {
    const itemId = Number(materialDraft.itemId);
    const qtde = Number(materialDraft.qtde);

    if (!itemId || !Number.isInteger(qtde) || qtde <= 0 || qtde > 999) {
      setErros((prev) => ({ ...prev, materiais: "Selecione um item e uma quantidade entre 1 e 999" }));
      return;
    }

    setMateriaisSelecionados((prev) => {
      const existente = prev.find((material) => material.itemId === itemId);
      if (existente) {
        return prev.map((material) =>
          material.itemId === itemId ? { ...material, qtde: material.qtde + qtde } : material
        );
      }

      return [...prev, { itemId, qtde }];
    });
    setMaterialDraft({ itemId: "", qtde: 1 });
    setErros((prev) => ({ ...prev, materiais: "" }));
  }

  function removerMaterial(itemId) {
    setMateriaisSelecionados((prev) => prev.filter((material) => material.itemId !== itemId));
  }

  function atualizarQuantidadeMaterial(itemId, qtde) {
    const quantidade = Math.max(Math.min(Number(qtde), 999), 1);
    setMateriaisSelecionados((prev) =>
      prev.map((material) => (material.itemId === itemId ? { ...material, qtde: quantidade } : material))
    );
  }

  useEffect(() => {
    fetchItensDisponiveis();
  }, []);

  useEffect(() => {
    if (!form.data || !form.hora || !form.horaFim || terminoInvalido) {
      setFuncionariosDisponiveis([]);
      setFuncionariosSelecionados([]);
      return;
    }

    fetchFuncionariosDisponiveis(form.data, form.hora, form.horaFim);
  }, [form.data, form.hora, form.horaFim, terminoInvalido]);

  useEffect(() => {
    setFuncionariosSelecionados((prev) =>
      prev.filter((id) => funcionariosDisponiveis.some((funcionario) => funcionario.id === id))
    );
  }, [funcionariosDisponiveis]);

  return (
    <>
      <Header />
      <main>
        <Styled.BackBtn>
          <Link to={"/tabelas/encontros"}>
            <div>Voltar</div>
          </Link>
        </Styled.BackBtn>
        <Styled.Form noValidate>
          <Styled.SectionTitle>
            <h2>Agendar encontro</h2>
            <p>Planeje data, local, capacidade e equipe responsável antes de confirmar.</p>
          </Styled.SectionTitle>

          <Styled.FormGrid>
          <div>
            <label htmlFor="data">Data: </label>
            <input
              name="data"
              value={form.data}
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              onChange={atualizarForm}
              style={{ border: erros.data || erros.enc_data ? "2px solid red" : "" }}
            />
            {(erros.data || erros.enc_data) && <span style={{ color: "red" }}>{erros.data || erros.enc_data}</span>}
          </div>

          <div>
            <label htmlFor="hora">Hora de início: </label>
            <input
              name="hora"
              value={form.hora}
              type="time"
              step="300"
              onChange={atualizarForm}
              style={{ border: erros.hora || erros.enc_hora ? "2px solid red" : "" }}
            />
            {(erros.hora || erros.enc_hora) && <span style={{ color: "red" }}>{erros.hora || erros.enc_hora}</span>}
          </div>

          <div>
            <label htmlFor="horaFim">Hora de término: </label>
            <input
              name="horaFim"
              value={form.horaFim}
              type="time"
              step="300"
              onChange={atualizarForm}
              style={{ border: erros.horaFim || erros.enc_hora_fim ? "2px solid red" : "" }}
            />
            {(erros.horaFim || erros.enc_hora_fim) && (
              <span style={{ color: "red" }}>{erros.horaFim || erros.enc_hora_fim}</span>
            )}
          </div>

          <div>
            <label>Disponibilidade:</label>
            <select
              style={{ border: erros.disponibilidade || erros.enc_disponibilidade ? "2px solid red" : "" }}
              name="disponibilidade"
              value={form.disponibilidade}
              onChange={atualizarForm}>
              <option value="">Selecione</option>
              <option value="A">Ativo</option>
              <option value="E">Em andamento</option>
              <option value="F">Finalizado</option>
            </select>
            {(erros.disponibilidade || erros.enc_disponibilidade) && (
              <span style={{ color: "red" }}>{erros.disponibilidade || erros.enc_disponibilidade}</span>
            )}
          </div>

          <div>
            <label>Quantidade Máxima:</label>
            <input
              type="number"
              name="qtdeMax"
              min="1"
              max="500"
              step="1"
              value={form.qtdeMax}
              onChange={atualizarForm}
              style={{ border: erros.qtdeMax || erros.enc_qtdeMax ? "2px solid red" : "" }}
            />
            {(erros.qtdeMax || erros.enc_qtdeMax) && (
              <span style={{ color: "red" }}>{erros.qtdeMax || erros.enc_qtdeMax}</span>
            )}
          </div>

          <div>
            <label>Local:</label>
            <input
              name="local"
              maxLength="80"
              pattern={LOCAL_REGEX.source}
              value={form.local}
              onChange={atualizarForm}
              style={{ border: erros.local || erros.enc_local ? "2px solid red" : "" }}
            />
            {(erros.local || erros.enc_local) && <span style={{ color: "red" }}>{erros.local || erros.enc_local}</span>}
          </div>
          </Styled.FormGrid>

          <Styled.PlanningPanel>
            <Styled.PlanningHeader>
              <div>
                <strong>Prontidao do agendamento</strong>
                <span>{prontidao}% completo</span>
              </div>
              <Styled.ProgressBar aria-label="Prontidao do agendamento">
                <span style={{ width: `${prontidao}%` }} />
              </Styled.ProgressBar>
            </Styled.PlanningHeader>

            <Styled.Checklist>
              {criteriosPlanejamento.map((criterio) => (
                <li key={criterio.texto} className={criterio.pronto ? "ready" : ""}>
                  <span>{criterio.pronto ? "OK" : "!"}</span>
                  {criterio.texto}
                </li>
              ))}
            </Styled.Checklist>

            <Styled.SummaryGrid>
              <div>
                <small>Quando</small>
                <strong>{formatarResumoData(form.data, form.hora, form.horaFim)}</strong>
              </div>
              <div>
                <small>Vagas restantes</small>
                <strong>{vagasRestantes}</strong>
              </div>
              <div>
                <small>Responsáveis</small>
                <strong>{funcionariosSelecionados.length}</strong>
              </div>
              <div>
                <small>Materiais</small>
                <strong>{materiaisSelecionados.length}</strong>
              </div>
            </Styled.SummaryGrid>
          </Styled.PlanningPanel>

          <Styled.FunctionariosPanel>
            <h3>Funcionários disponíveis</h3>
            <p>Selecione data, início e término para listar quem está livre nesse intervalo.</p>
            {erros.responsaveis && <Styled.ErrorText>{erros.responsaveis}</Styled.ErrorText>}
            {!form.data || !form.hora || !form.horaFim || terminoInvalido ? (
              <Styled.EmptyState>Preencha data, início e término válido para carregar os funcionários disponíveis.</Styled.EmptyState>
            ) : funcionariosDisponiveis.length === 0 ? (
              <Styled.EmptyState>Nenhum funcionário disponível encontrado para este horário.</Styled.EmptyState>
            ) : (
              <Styled.Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>nome</th>
                    <th>usuário</th>
                    <th>cargo</th>
                    <th>cpf</th>
                    <th>telefone</th>
                    <th>selecionar</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionariosDisponiveis.map((funcionario) => {
                    const selecionado = funcionariosSelecionados.includes(funcionario.id);
                    return (
                      <tr
                        key={funcionario.id}
                        className={selecionado ? "selected" : ""}
                        onClick={() => alternarFuncionario(funcionario.id)}>
                        <td>{funcionario.id}</td>
                        <td>{funcionario.nome}</td>
                        <td>{funcionario.usuario}</td>
                        <td>{funcionario.cargo}</td>
                        <td>{funcionario.cpf}</td>
                        <td>{funcionario.telefone}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={selecionado}
                            onChange={() => alternarFuncionario(funcionario.id)}
                            onClick={(event) => event.stopPropagation()}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Styled.Table>
            )}
            <Styled.SelectionInfo>
              Responsáveis selecionados: <strong>{funcionariosSelecionados.length}</strong>
              {responsaveisSelecionados.length > 0 && (
                <span>
                  {responsaveisSelecionados.map((funcionario) => funcionario.nome).join(", ")}
                </span>
              )}
            </Styled.SelectionInfo>
          </Styled.FunctionariosPanel>

          <Styled.MaterialsPanel>
            <h3>Materiais e ferramentas</h3>
            <p>Reserve itens cadastrados no banco caso o encontro precise de equipamentos ou materiais.</p>
            {erros.materiais && <Styled.ErrorText>{erros.materiais}</Styled.ErrorText>}

            <Styled.MaterialPicker>
              <label>
                Item
                <select
                  value={materialDraft.itemId}
                  onChange={(event) => setMaterialDraft((prev) => ({ ...prev, itemId: event.target.value }))}
                >
                  <option value="">Selecione um item cadastrado</option>
                  {itensDisponiveis.map((item) => (
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
                  value={materialDraft.qtde}
                  onChange={(event) => setMaterialDraft((prev) => ({ ...prev, qtde: event.target.value }))}
                />
              </label>

              <button type="button" onClick={adicionarMaterial}>
                Adicionar
              </button>
            </Styled.MaterialPicker>

            {itensDisponiveis.length === 0 ? (
              <Styled.EmptyState>Nenhum item cadastrado foi encontrado.</Styled.EmptyState>
            ) : materiaisResumo.length === 0 ? (
              <Styled.EmptyState>Nenhum material reservado para este encontro.</Styled.EmptyState>
            ) : (
              <Styled.MaterialList>
                {materiaisResumo.map((material) => (
                  <li key={material.itemId}>
                    <div>
                      <strong>{material.nome}</strong>
                      <span>{material.tipo}</span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      step="1"
                      value={material.qtde}
                      onChange={(event) => atualizarQuantidadeMaterial(material.itemId, event.target.value)}
                    />
                    <button type="button" onClick={() => removerMaterial(material.itemId)}>
                      Remover
                    </button>
                  </li>
                ))}
              </Styled.MaterialList>
            )}
          </Styled.MaterialsPanel>

          <button type="button" onClick={fetchCadastrarEncontro}>
            Cadastrar
          </button>
        </Styled.Form>
      </main>
      <Footer />
    </>
  );
}

export default CadastrarEncontroView;
