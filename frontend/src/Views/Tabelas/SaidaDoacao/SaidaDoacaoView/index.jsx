import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SaidaDoacaoListaView() {

    async function fetchSaidaLista(benNome, data) {
        const response = await fetch(
            `http://localhost:3000/saidaDoacao/listar?benNome=${benNome}&data=${data}`,
            { method: "GET" }
        );
        const resultado = await response.json();
        if (!response.ok) {
            console.log("Erro:", resultado);
            return [];
        }
        return resultado;
    }

    async function fetchLotesDaSaida(lotdId) {
        // Se já está aberto, fecha
        if (lotesAbertos[lotdId]) {
            setLotesAbertos(prev => ({ ...prev, [lotdId]: null }));
            return;
        }
        // Se não está aberto, busca e abre
        try {
            const response = await fetch(`http://localhost:3000/saidaDoacao/buscarLotes/${lotdId}`);
            const data = await response.json();
            if (response.ok)
                setLotesAbertos(prev => ({ ...prev, [lotdId]: data }));
        } catch (error) {
            alert("Erro ao carregar lotes da saída");
        }
    }

    async function fetchExcluir(id) {
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if (!confirmar) return;
        try {
            const response = await fetch(`http://localhost:3000/saidaDoacao/excluir?id=${id}`, {
                method: "DELETE",
            });
            if (response.ok)
                setSaidas(prev => prev.filter(s => s.lotd_id !== id));
            else {
                const json = await response.json();
                alert(json.err || "Erro ao excluir");
            }
        } catch (error) {
            alert("Erro ao excluir: " + error);
        }
    }

    const [saidas, setSaidas] = useState([]);
    const [lotesAbertos, setLotesAbertos] = useState({}); // { [lotd_id]: [...lotes] ou null }
    const [benNome, setBenNome] = useState("");
    const [data, setData] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function carregar() {
            const resultado = await fetchSaidaLista(benNome, data);
            setSaidas(resultado);
        }
        carregar();
    }, [benNome, data]);

    return (
        <>
            <Header />
            <main>
                <Styled.PageTitle>Gerenciamento de Saida de Doação</Styled.PageTitle>
                <Styled.Busca
                    type="text"
                    placeholder="Buscar por beneficiário..."
                    value={benNome}
                    onChange={(e) => setBenNome(e.target.value)}
                />
                <Styled.Busca
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />
                <Styled.Actions>
                    <button onClick={() => navigate("/saidaDoacao/cadastro")}>
                        + Registrar Saída
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Beneficiário</th>
                            <th>CPF</th>
                            <th>Data</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {saidas.map(s => (
                            <React.Fragment key={s.lotd_id}>
                                <tr key={s.lotd_id}>
                                    <td>{s.lotd_id}</td>
                                    <td>{s.ben_nome}</td>
                                    <td>{s.ben_cpf}</td>
                                    <td>{s.data
                                        ? new Date(s.data).toLocaleDateString("pt-BR")
                                        : "—"}
                                    </td>
                                    <td>
                                        <button onClick={() => fetchLotesDaSaida(s.lotd_id)}>
                                            {lotesAbertos[s.lotd_id] ? "▲" : "▼"}
                                        </button>
                                        <button onClick={() => navigate(`/saidaDoacao/${s.lotd_id}`)}>
                                            Editar
                                        </button>
                                        <button onClick={() => fetchExcluir(s.lotd_id)}>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                                {lotesAbertos[s.lotd_id] && (
                                    <tr key={`lotes-${s.lotd_id}`}>
                                        <td colSpan={5}>
                                            <Styled.LotesExpandidos>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Lote #</th>
                                                            <th>Item</th>
                                                            <th>Quantidade</th>
                                                            <th>Unidade</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lotesAbertos[s.lotd_id].map(l => (
                                                            <tr key={l.id}>
                                                                <td>{l.id}</td>
                                                                <td>{l.loteInfo?.item_nome ?? "—"}</td>
                                                                <td>{l.qtde}</td>
                                                                <td>{l.loteInfo?.item_unidadeMedida ?? "—"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </Styled.LotesExpandidos>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </Styled.Table>
            </main>
            <Footer />
        </>
    );
}

export default SaidaDoacaoListaView;