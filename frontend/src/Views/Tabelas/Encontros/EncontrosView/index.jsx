import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function EncontrosView() {
  function fetchEncontroLista(filtro) {
    return fetch(
      `http://localhost:3000/encontros/listar?filtroLocal=${filtro}`,
      {
        method: "GET",
      },
    )
      .then((response) => response.json())
      .catch((error) => alert(error));
  }
  const [encontros, setEncontros] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      const info = await fetchEncontroLista(filtro);
      setEncontros(info);
    }
    carregar();
  }, [filtro]);

  async function fetchFinalizarEncontro(encontro) {
    const confirmar = confirm("Tem certeza que deseja finalizar?");
    if (!confirmar) return;

    try {
      await fetch("http://localhost:3000/encontros/finalizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: encontro.id,
          data: encontro.data,
          qtdeMax: encontro.qtdeMax,
          qtde: encontro.qtde,
          local: encontro.local,
        }),
      });
      const info = await fetchEncontroLista(filtro);
      setEncontros(info);
    } catch (error) {
      alert("Erro ao finalizar");
    }
  }

  async function fetchExcluirEncontro(encontro) {
    const confirmar = confirm("Tem certeza que deseja excluir?");
    if (!confirmar) return;

    try {
      await fetch(`http://localhost:3000/encontros/excluir?id=${encontro.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: encontro.id,
        }),
      });
      const info = await fetchEncontroLista(filtro);
      setEncontros(info);
    } catch (error) {
      alert("Erro ao excluir");
    }
  }

  return (
    <>
      <Header />
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
              <tr key={f.id} >
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
                  {f.disponibilidade == "A"
                    ? "Ativo"
                    : f.disponibilidade == "E"
                      ? "Em Andamento"
                      : "Finalizado"}
                </td>
                <td>
                  <Styled.Finals>
                    <button
                      type="button"
                      style={{ backgroundColor: "#0091ff", marginRight: "5px" }}
                      onClick={() => navigate(`/encontros/${f.id}`)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      style={{ backgroundColor: "#dc1414" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchExcluirEncontro(f);
                      }}>
                      Excluir
                    </button>
                  </Styled.Finals>
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
