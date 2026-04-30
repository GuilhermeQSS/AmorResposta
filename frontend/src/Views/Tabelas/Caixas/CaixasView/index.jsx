import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatarData(data) {
    if (!data) return "";
    const [ano, mes, dia] = String(data).split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function CaixasView() {
    function fetchCaixasLista(filtro) {
        const params = new URLSearchParams({
            filtro
        });

        return fetch(`http://localhost:3000/caixas/listar?${params.toString()}`, {
            method: "GET"
        })
            .then((response) => response.json())
            .catch((error) => alert(error));
    }

    const [caixas, setCaixas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function carregar() {
            const data = await fetchCaixasLista(filtro);
            setCaixas(data);
        }

        carregar();
    }, [filtro]);

    return (
        <>
            <Header />
            <main>
                <Styled.Filtros>
                    <Styled.Busca
                        type="text"
                        placeholder="Buscar por turno..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </Styled.Filtros>
                <Styled.Actions>
                    <button onClick={() => navigate("/caixas/cadastro")}>
                        + Abrir Caixa
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Data</th>
                            <th>Turno</th>
                            <th>Valor inicial</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {caixas.map((c) => (
                            <tr
                                key={c.id}
                                onClick={() => navigate(`/caixas/${c.id}`)}
                            >
                                <td>{c.id}</td>
                                <td>{formatarData(c.data)}</td>
                                <td>{c.turno}</td>
                                <td>{formatarMoeda(c.suprimentoInicial)}</td>
                                <td>{c.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Styled.Table>
            </main>
            <Footer />
        </>
    );
}

export default CaixasView;
