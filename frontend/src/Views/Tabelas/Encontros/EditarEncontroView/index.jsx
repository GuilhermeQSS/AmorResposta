import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditarEncontroView() {
  function validar() {
    let novosErros = {};
    if (!form.data) novosErros.data = "Data obrigatória";
    if (!form.disponibilidade)
      novosErros.disponibilidade = "Selecione uma opção";
    if (!form.local) novosErros.local = "Local obrigatório";
    if (form.qtdeMax === 0) novosErros.qtdeMax = "Informe a quantidade máxima";
    if (form.qtdeMax <= 0) {
      novosErros.qtdeMax = "Deve ser maior que 0";
    }
    if (form.qtde > form.qtdeMax) {
      novosErros.qtde = "Não pode ser maior que a máxima";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  function fetchEncontro(id) {
    return fetch(`http://localhost:3000/encontros/buscar?id=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .catch((error) => alert(error));
  }

  async function fetchAlterarEncontro() {
    if (!validar()) return;
    try {
      const response = await fetch("http://localhost:3000/encontros/alterar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: form.id,
          data: form.data,
          disponibilidade: form.disponibilidade,
          qtdeMax: form.qtdeMax,
          qtde: form.qtde,
          local: form.local,
          camposAlterados: {
            data: form.data !== formOriginal.data,
            disponibilidade:
              form.disponibilidade !== formOriginal.disponibilidade,
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
    } catch (error) {
      alert("Erro ao atualizar");
    }
  }

  async function fetchExcluirEncontro() {
    const confirmar = confirm("Tem certeza que deseja excluir?");
    if (!confirmar) return;

    try {
      await fetch("http://localhost:3000/encontros/excluir", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: form.id,
        }),
      });
      navigate("/tabelas/encontros");
    } catch (error) {
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
    disponibilidade: "",
    qtdeMax: 0,
    qtde: 0,
    local: "",
  });
  const [formOriginal, setFormOriginal] = useState({
    id: 0,
    data: "",
    disponibilidade: "",
    qtdeMax: 0,
    qtde: 0,
    local: "",
  });
  const [editado, setEditado] = useState(false);

  useEffect(() => {
    async function carregar() {
      const data = await fetchEncontro(id);
      data.data = data.data?.split("T")[0];
      setForm(data);
      setFormOriginal(data);
    }
    carregar();
  }, [id]);

  useEffect(() => {
    setEditado(JSON.stringify(form) !== JSON.stringify(formOriginal));
  }, [form, formOriginal]);

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
              style={{ border: erros.data ? "2px solid red" : "" }}
            />
            {erros.data && <span style={{ color: "red" }}>{erros.data}</span>}
          </div>

          <div>
            <label>Disponibilidade:</label>
            <select
              name="disponibilidade"
              value={form.disponibilidade}
              onChange={atualizarForm}
              style={{ border: erros.disponibilidade ? "2px solid red" : "" }}>
              <option value="">Selecione</option>
              <option value="A">Ativo</option>
              <option value="E">Em andamento</option>
              <option value="F">Finalizado</option>
            </select>
            {erros.disponibilidade && (
              <span style={{ color: "red" }}>{erros.disponibilidade}</span>
            )}
          </div>

          <div>
            <label>Quantidade Máxima:</label>
            <input
              type="number"
              name="qtdeMax"
              value={form.qtdeMax}
              onChange={atualizarForm}
              style={{ border: erros.qtdeMax ? "2px solid red" : "" }}
            />
            {erros.qtdeMax && (
              <span style={{ color: "red" }}>{erros.qtdeMax}</span>
            )}
          </div>

          <div>
            <label>Quantidade Atual:</label>
            <input
              type="number"
              name="qtde"
              value={form.qtde}
              onChange={atualizarForm}
              style={{ border: erros.qtde ? "2px solid red" : "" }}
            />
            {erros.qtde && <span style={{ color: "red" }}>{erros.qtde}</span>}
          </div>

          <div>
            <label>Local:</label>
            <input
              name="local"
              value={form.local}
              onChange={atualizarForm}
              style={{ border: erros.local ? "2px solid red" : "" }}
            />
            {erros.local && <span style={{ color: "red" }}>{erros.local}</span>}
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
