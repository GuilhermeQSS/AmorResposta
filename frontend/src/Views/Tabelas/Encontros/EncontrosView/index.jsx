import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function EncontrosView() {
  function fetchEncontroLista(filtro) {
    return fetch(`http://localhost:3000/encontros/listar?filtro=${filtro}`, {
      method: "GET",
    })
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
            </tr>
          </thead>
          <tbody>
            {encontros.map((f) => (
              <tr onClick={() => navigate(`/encontros/${f.id}`)}>
                <td>{f.id}</td>
                <td>{f.local}</td>
                <td>
                  {f.data
                    ? f.data.split("T")[0].split("-").reverse().join("/")
                    : ""}
                </td>
                <td>{f.qtdeMax}</td>
                <td>{f.qtde}</td>
                <td>{ f.disponibilidade == 'A'? "Ativo": f.disponibilidade == 'E' ? "Em Andamento" : "Finalizado"}</td>
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
