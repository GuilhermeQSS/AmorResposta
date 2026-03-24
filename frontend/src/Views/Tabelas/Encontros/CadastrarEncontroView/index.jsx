import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function CadastrarEncontroView() {
  async function fetchCadastrarEncontro() {
    if (form.qtde > form.qtdeMax) {
      alert("Quantidade atual não pode ser maior que a máxima");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/encontros/gravar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: form.data,
          disponibilidade: form.disponibilidade,
          qtdeMax: form.qtdeMax,
          qtde: form.qtde,
          local: form.local,
        }),
      });
      if (response.ok) {
        navigate("/tabelas/encontros");
      } else {
        const json = await response.json();
        setErros(json.campos || {});
        alert(json.err || "Erro desconhecido no servidor");
      }
    } catch (error) {
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
  const [erros, setErros] = useState({});
  const [form, setForm] = useState({
    id: 0,
    data: "",
    disponibilidade: "A",
    qtdeMax: 0,
    qtde: 0,
    local: "",
  });
  const navigate = useNavigate();

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
              style={{ border: erros.enc_data ? "2px solid red" : "" }}
            />
          </div>

          <div>
            <label>Disponibilidade:</label>
            <select
              name="disponibilidade"
              value={form.disponibilidade}
              onChange={atualizarForm}>
              <option value="A">Selecione</option>
              <option value="A">Ativo</option>
              <option value="E">Em andamento</option>
              <option value="F">Finalizado</option>
            </select>
          </div>

          <div>
            <label>Quantidade Máxima:</label>
            <input
              type="number"
              name="qtdeMax"
              value={form.qtdeMax}
              onChange={atualizarForm}
            />
          </div>

          <div>
            <label>Quantidade Atual:</label>
            <input
              type="number"
              name="qtde"
              value={form.qtde}
              onChange={atualizarForm}
            />
          </div>

          <div>
            <label>Local:</label>
            <input name="local" value={form.local} onChange={atualizarForm} />
          </div>

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
