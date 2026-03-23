import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DoacoesView() {
    function fetchDoacoes(filtroAtual, tipoFiltroAtual) {
        const params = new URLSearchParams();

        if (filtroAtual) {
            params.set("filtro", filtroAtual);
        }

        params.set("tipoFiltro", tipoFiltroAtual);

        return fetch(`http://localhost:3000/doacoes/listar?${params.toString()}`, {
            method: "GET"
        })
            .then((response) => response.json())
            .catch((error) => alert(error));
    }

    function handleTipoFiltroChange(e) {
        setTipoFiltro(e.target.value);
        setFiltro("");
    }

    const [doacoes, setDoacoes] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("doador");
    const navigate = useNavigate();

    useEffect(() => {
        async function carregar() {
            const data = await fetchDoacoes(filtro, tipoFiltro);
            setDoacoes(Array.isArray(data) ? data : []);
        }

        carregar();
    }, [filtro, tipoFiltro]);

    return (
        <>
            <Header />
            <main>
                <Styled.Filters>
                    <Styled.FilterSelect
                        value={tipoFiltro}
                        onChange={handleTipoFiltroChange}
                    >
                        <option value="doador">Pesquisar por doador</option>
                        <option value="data">Pesquisar por data</option>
                    </Styled.FilterSelect>

                    <Styled.Busca
                        type={tipoFiltro === "data" ? "date" : "text"}
                        placeholder={tipoFiltro === "data" ? "" : "Buscar doacao por doador..."}
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </Styled.Filters>

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
                            <th>quantidade</th>
                            <th>data</th>
                            <th>origem</th>
                            <th>entrega</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doacoes.map((doacao) => (
                            <tr
                                key={doacao.id}
                                onClick={() => navigate(`/doacoes/${doacao.id}`)}
                            >
                                <td>{doacao.id}</td>
                                <td>{doacao.doadorNome || "anonimo"}</td>
                                <td>{doacao.tipo}</td>
                                <td>{doacao.quantidadeItens || "-"}</td>
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
