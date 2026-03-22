import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DoacoesView() {
    function fetchDoacoes(filtro) {
        return fetch(`http://localhost:3000/doacoes/listar?filtro=${filtro}`, {
            method: "GET"
        })
            .then((response) => response.json())
            .catch((error) => alert(error));
    }

    const [doacoes, setDoacoes] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function carregar() {
            const data = await fetchDoacoes(filtro);
            setDoacoes(Array.isArray(data) ? data : []);
        }

        carregar();
    }, [filtro]);

    return (
        <>
            <Header />
            <main>
                <Styled.Busca
                    type="text"
                    placeholder="Buscar doacao por doador..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />

                <Styled.Actions>
                    <button onClick={() => navigate("/doacoes/cadastro")}>
                        + Cadastrar Doacao
                    </button>
                </Styled.Actions>

                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>doador</th>
                            <th>tipo</th>
                            <th>data</th>
                            <th>origem</th>
                            <th>entrega</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doacoes.map((doacao) => (
                            <tr key={doacao.id}>
                                <td>{doacao.id}</td>
                                <td>{doacao.doadorNome || "Nao informado"}</td>
                                <td>{doacao.tipo}</td>
                                <td>{doacao.dataEntrega ? new Date(doacao.dataEntrega).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "-"}</td>
                                <td>{doacao.origem || "-"}</td>
                                <td>{doacao.formaEntrega}</td>
                            </tr>
                        ))}
                    </tbody>
                </Styled.Table>
            </main>
            <Footer />
        </>
    );
}

export default DoacoesView;