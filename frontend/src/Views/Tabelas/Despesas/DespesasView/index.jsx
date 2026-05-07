import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DespesasView() {
    function fetchDespesaLista(filtro) {
        const params = new URLSearchParams({
            filtro
        });

        return fetch(`http://localhost:3000/despesas/listar?${params.toString()}`, {
            method: "GET"
        })
            .then((response) => response.json())
            .catch((error) => alert(error));
    }

    const [despesas, setDespesas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function carregar() {
            const data = await fetchDespesaLista(filtro);
            setDespesas(data);
        }

        carregar();
    }, [filtro]);

    return (
        <>
            <Header />
            <main>
                <Styled.PageTitle>Gerenciamento de Despesas</Styled.PageTitle>
                <Styled.Filtros>
                    <Styled.Busca
                        type="text"
                        placeholder="Buscar por descrição..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </Styled.Filtros>
                <Styled.Actions>
                    <button onClick={() => navigate("/despesas/cadastro")}>
                        + Cadastrar Tipo de Despesa
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>descricao</th>
                            <th>categoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {despesas.map((d) => (
                            <tr
                                key={d.id}
                                onClick={() => navigate(`/despesas/${d.id}`)}
                            >
                                <td>{d.id}</td>
                                <td>{d.descricao}</td>
                                <td>{d.categoria}</td>
                            </tr>
                        ))}
                    </tbody>
                </Styled.Table>
            </main>
            <Footer />
        </>
    );
}

export default DespesasView;
