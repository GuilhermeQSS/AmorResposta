import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LotesView() {
    async function fetchLotesLista(nome, filtroData) {
        const response = await fetch(
            `http://localhost:3000/lotes/listarComItens?nome=${nome}&data=${filtroData}`,
            { method: "GET" }
        );
        const resultado = await response.json();

        if (!response.ok) {
            alert("Erro:", resultado);
            return [];
        }

        return resultado;
    }

    async function fetchExcluirLote(id) {
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if (!confirmar) return;

        try {
            await fetch(`http://localhost:3000/lotes/excluir?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setLotes((prev) => prev.filter(l => l.lot_id !== id));
        } catch (error) {
            alert("Erro ao excluir: " + error);
        }
    }

    const [lotes, setLotes] = useState([]);
    const [nome, setNome] = useState("");
    const [data, setData] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function carregar() {
            const resultado = await fetchLotesLista(nome, data);
            setLotes(resultado);
        }
        carregar();
    }, [nome, data]);

    return (
        <>
            <Header />
            <main>
                <Styled.Busca
                    type="text"
                    placeholder="Buscar por nome do item..."
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <Styled.Busca
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />
                <Styled.Actions>
                    <button onClick={() => navigate("/lotes/cadastro")}>
                        + Cadastrar Lote
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th>Tipo</th>
                            <th>Unidade de Medida</th>
                            <th>Quantidade</th>
                            <th>Validade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lotes.map((e) => (
                            <tr key={e.lot_id}>
                                <td>{e.lot_id}</td>
                                <td>{e.item_nome}</td>
                                <td>{e.item_tipo}</td>
                                <td>{e.lot_unidadeMedida}</td>
                                <td>{e.lot_qtde}</td>
                                <td>{e.lot_validade
                                    ? new Date(e.lot_validade).toLocaleDateString("pt-BR")
                                    : "—"}
                                </td>
                                <td>
                                    <button onClick={() => navigate(`/lotes/${e.lot_id}`)}>
                                        Editar
                                    </button>
                                    <button onClick={() => fetchExcluirLote(e.lot_id)}>
                                        Excluir
                                    </button>
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

export default LotesView;