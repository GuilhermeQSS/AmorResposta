import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:3000/api/encontros";

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("token");
  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`,
  };
}

function EditarEncontroView() {
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

  function fetchEncontro(id) {
    return fetch(`${API_URL}/buscar?id=${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar encontro.");
        }
        return response.json();
      })
      .catch((error) => {
        alert(error.message || error);
        return null;
      });
  }

  async function fetchAlterarEncontro() {
    if (!validar()) return;
    try {
      const response = await fetch(`${API_URL}/alterar`, {
        method: "PUT",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          id: form.id,
          data: form.data,
          hora: form.hora,
          disponibilidade: form.disponibilidade,
          qtdeMax: form.qtdeMax,
          qtde: form.qtde,
          local: form.local,
          camposAlterados: {
            data: form.data !== formOriginal.data,
            hora: form.hora !== formOriginal.hora,
            disponibilidade: form.disponibilidade !== formOriginal.disponibilidade,
            qtdeMax: form.qtdeMax !== formOriginal.qtdeMax,
            qtde: form.qtde !== formOriginal.qtde,
            local: form.local !== formOriginal.local,
          },
        }),
      });
      if (response.ok) {
        setFormOriginal(form);
      } else {
        const json = await response.json();
        setErros(json.campos || {});
        alert(json.err || "Erro desconhecido no servidor");
      }
    } catch {
      alert("Erro ao atualizar");
    }
  }

  async function fetchExcluirEncontro() {
    const confirmar = confirm("Tem certeza que deseja excluir?");
    if (!confirmar) return;

    try {
      await fetch(`${API_URL}/excluir`, {
        method: "DELETE",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          id: form.id,
        }),
      });
      navigate("/tabelas/encontros");
    } catch {
      alert("Erro ao excluir");
    }
  }

  function atualizarForm(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name.includes("qtde") ? Number(value) : value,
    }));
  }

  const [erros, setErros] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    id: 0,
    data: "",
    hora: "",
    disponibilidade: "",
    qtdeMax: 0,
    qtde: 0,
    local: "",
  });
  const [formOriginal, setFormOriginal] = useState({
    id: 0,
    data: "",
    hora: "",
    disponibilidade: "",
    qtdeMax: 0,
    qtde: 0,
    local: "",
  });
  const editado = JSON.stringify(form) !== JSON.stringify(formOriginal);

  useEffect(() => {
    async function carregar() {
      const data = await fetchEncontro(id);
      if (!data) return;
      data.data = data.data?.split("T")[0];
      data.hora = String(data.hora || "").slice(0, 5);
      setForm(data);
      setFormOriginal(data);
    }
    carregar();
  }, [id]);

  return (
    <>
      <Header />
      <main>
        <Styled.BackBtn>
          <Link to={"/tabelas/encontros"}>
            <div>Voltar</div>
          </Link>
        </Styled.BackBtn>
        <Styled.Form>
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
              name="disponibilidade"
              value={form.disponibilidade}
              onChange={atualizarForm}
              style={{ border: erros.disponibilidade || erros.enc_disponibilidade ? "2px solid red" : "" }}>
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

          <button
            type="button"
            disabled={!editado}
            onClick={fetchAlterarEncontro}>
            Editar
          </button>

          <button type="button" onClick={fetchExcluirEncontro}>
            Excluir
          </button>
        </Styled.Form>
      </main>
      <Footer />
    </>
  );
}

export default EditarEncontroView;
