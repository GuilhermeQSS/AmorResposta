import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DespesasView() {
    function formatarValor(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function fetchDespesaLista(filtro, valor) {
        const params = new URLSearchParams({
            filtro,
            valor
        });

        return fetch(`http://localhost:3000/despesas/listar?${params.toString()}`, {
            method: "GET"
        })
            .then((response) => response.json())
            .catch((error) => alert(error));
    }

    const [despesas, setDespesas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [filtroValor, setFiltroValor] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function carregar() {
            const data = await fetchDespesaLista(filtro, filtroValor);
            setDespesas(data);
        }

        carregar();
    }, [filtro, filtroValor]);

    return (
        <>
            <Header />
            <main>
                <Styled.Filtros>
                    <Styled.Busca
                        type="text"
                        placeholder="Buscar por descricao..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <Styled.Busca
                        type="text"
                        inputMode="decimal"
                        placeholder="Buscar por valor..."
                        value={filtroValor}
                        onChange={(e) => setFiltroValor(e.target.value)}
                    />
                </Styled.Filtros>
                <Styled.Actions>
                    <button onClick={() => navigate("/despesas/cadastro")}>
                        + Cadastrar Despesa
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>valor</th>
                            <th>descricao</th>
                        </tr>
                    </thead>
                    <tbody>
                        {despesas.map((d) => (
                            <tr
                                key={d.id}
                                onClick={() => navigate(`/despesas/${d.id}`)}
                            >
                                <td>{d.id}</td>
                                <td>{formatarValor(d.valor)}</td>
                                <td>{d.descricao}</td>
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
