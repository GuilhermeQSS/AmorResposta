import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/encontros";

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("token");
  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`,
  };
}

function CadastrarEncontroView() {
  function validar() {
    const novosErros = {};
    if (!form.data) novosErros.data = "Data obrigatoria";
    if (!form.hora) novosErros.hora = "Hora obrigatoria";
    if (!form.disponibilidade) novosErros.disponibilidade = "Selecione uma opcao";
    if (!form.local) novosErros.local = "Local obrigatorio";
    if (form.qtdeMax === 0) novosErros.qtdeMax = "Informe a quantidade maxima";
    if (form.qtdeMax <= 0) {
      novosErros.qtdeMax = "Deve ser maior que 0";
    }
    if (form.qtde > form.qtdeMax) {
      novosErros.qtde = "Nao pode ser maior que a maxima";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function fetchFuncionariosDisponiveis(data, hora) {
    try {
      const params = new URLSearchParams({ data, hora });
      const response = await fetch(`${API_URL}/funcionarios-disponiveis?${params.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.err || "Erro ao carregar funcionarios disponiveis");
      }

      const dataJson = await response.json();
      setFuncionariosDisponiveis(Array.isArray(dataJson) ? dataJson : []);
    } catch (error) {
      setFuncionariosDisponiveis([]);
      alert(error.message || "Erro ao carregar funcionarios");
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
          disponibilidade: form.disponibilidade,
          qtdeMax: form.qtdeMax,
          qtde: form.qtde,
          local: form.local,
          responsaveis: funcionariosSelecionados,
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
      [name]: name.includes("qtde") ? Number(value) : value,
    }));
  }

  function alternarFuncionario(funId) {
    setFuncionariosSelecionados((prev) =>
      prev.includes(funId) ? prev.filter((id) => id !== funId) : [...prev, funId]
    );
  }

  const [erros, setErros] = useState({});
  const [funcionariosDisponiveis, setFuncionariosDisponiveis] = useState([]);
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    data: "",
    hora: "",
    disponibilidade: "",
    qtdeMax: 0,
    qtde: 0,
    local: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!form.data || !form.hora) {
      setFuncionariosDisponiveis([]);
      setFuncionariosSelecionados([]);
      return;
    }

    fetchFuncionariosDisponiveis(form.data, form.hora);
  }, [form.data, form.hora]);

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
          <div>
            <label htmlFor="data">Data: </label>
            <input
              name="data"
              value={form.data}
              type="date"
              onChange={atualizarForm}
              style={{ border: erros.data || erros.enc_data ? "2px solid red" : "" }}
            />
            {(erros.data || erros.enc_data) && <span style={{ color: "red" }}>{erros.data || erros.enc_data}</span>}
          </div>

          <div>
            <label htmlFor="hora">Hora: </label>
            <input
              name="hora"
              value={form.hora}
              type="time"
              onChange={atualizarForm}
              style={{ border: erros.hora || erros.enc_hora ? "2px solid red" : "" }}
            />
            {(erros.hora || erros.enc_hora) && <span style={{ color: "red" }}>{erros.hora || erros.enc_hora}</span>}
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
            <label>Quantidade Maxima:</label>
            <input
              type="number"
              name="qtdeMax"
              value={form.qtdeMax}
              onChange={atualizarForm}
              style={{ border: erros.qtdeMax || erros.enc_qtdeMax ? "2px solid red" : "" }}
            />
            {(erros.qtdeMax || erros.enc_qtdeMax) && (
              <span style={{ color: "red" }}>{erros.qtdeMax || erros.enc_qtdeMax}</span>
            )}
          </div>

          <div>
            <label>Quantidade Atual:</label>
            <input
              type="number"
              name="qtde"
              value={form.qtde}
              onChange={atualizarForm}
              style={{ border: erros.qtde || erros.enc_qtde ? "2px solid red" : "" }}
            />
            {(erros.qtde || erros.enc_qtde) && <span style={{ color: "red" }}>{erros.qtde || erros.enc_qtde}</span>}
          </div>

          <div>
            <label>Local:</label>
            <input
              name="local"
              value={form.local}
              onChange={atualizarForm}
              style={{ border: erros.local || erros.enc_local ? "2px solid red" : "" }}
            />
            {(erros.local || erros.enc_local) && <span style={{ color: "red" }}>{erros.local || erros.enc_local}</span>}
          </div>

          <Styled.FunctionariosPanel>
            <h3>Funcionarios disponiveis</h3>
            <p>Selecione a data e a hora do encontro para listar quem esta livre nesse horario.</p>
            {!form.data || !form.hora ? (
              <Styled.EmptyState>Preencha data e hora para carregar os funcionarios disponiveis.</Styled.EmptyState>
            ) : funcionariosDisponiveis.length === 0 ? (
              <Styled.EmptyState>Nenhum funcionario disponivel encontrado para este horario.</Styled.EmptyState>
            ) : (
              <Styled.Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>nome</th>
                    <th>usuario</th>
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
              Responsaveis selecionados: <strong>{funcionariosSelecionados.length}</strong>
            </Styled.SelectionInfo>
          </Styled.FunctionariosPanel>

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
