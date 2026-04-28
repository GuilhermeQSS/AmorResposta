import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DoacoesView() {
    function fetchDoacoes(filtroAtual, tipoFiltroAtual, dataInicialAtual, dataFinalAtual) {
        const params = new URLSearchParams();

        if (tipoFiltroAtual === "periodo") {
            if (dataInicialAtual) {
                params.set("dataInicial", dataInicialAtual);
            }

            if (dataFinalAtual) {
                params.set("dataFinal", dataFinalAtual);
            }
        } else if (filtroAtual) {
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
        setDataInicial("");
        setDataFinal("");
    }

    const [doacoes, setDoacoes] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("doador");
    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const navigate = useNavigate();

    async function excluirDoacao(id) {
        return fetch("http://localhost:3000/doacoes/excluir", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        })
            .then((response) => response.json())
            .catch((error) => {
                alert(error);
                return null;
            });
    }

    async function handleDelete(id) {
        setConfirmDeleteId(id);
    }

    async function handleConfirmDelete() {
        if (confirmDeleteId === null) return;

        const resp = await excluirDoacao(confirmDeleteId);
        if (resp) {
            const data = await fetchDoacoes(filtro, tipoFiltro, dataInicial, dataFinal);
            setDoacoes(Array.isArray(data) ? data : []);
        }
        setConfirmDeleteId(null);
    }

    function handleCancelDelete() {
        setConfirmDeleteId(null);
    }

    function handleEdit(id) {
        navigate(`/doacoes/${id}`);
    }

    useEffect(() => {
        async function carregar() {
            if (tipoFiltro === "periodo" && dataInicial && dataFinal && dataInicial > dataFinal) {
                setDoacoes([]);
                return;
            }

            const data = await fetchDoacoes(filtro, tipoFiltro, dataInicial, dataFinal);
            setDoacoes(Array.isArray(data) ? data : []);
        }

        carregar();
    }, [filtro, tipoFiltro, dataInicial, dataFinal]);

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
                        <option value="periodo">Pesquisar por periodo</option>
                    </Styled.FilterSelect>

                    {tipoFiltro === "periodo" ? (
                        <>
                            <Styled.Busca
                                type="date"
                                value={dataInicial}
                                onChange={(e) => setDataInicial(e.target.value)}
                            />
                            <Styled.Busca
                                type="date"
                                value={dataFinal}
                                onChange={(e) => setDataFinal(e.target.value)}
                            />
                        </>
                    ) : (
                        <Styled.Busca
                            type={tipoFiltro === "data" ? "date" : "text"}
                            placeholder={tipoFiltro === "data" ? "" : "Buscar doacao por doador..."}
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    )}
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
                            <th>Ações</th>
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
                                <td>
                                    <Styled.ActionButtons>
                                        <button
                                            type="button"
                                            className="edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(doacao.id);
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(doacao.id);
                                            }}
                                        >
                                            Excluir
                                        </button>
                                    </Styled.ActionButtons>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Styled.Table>

                {confirmDeleteId !== null && (
                    <Styled.ModalOverlay>
                        <Styled.ModalContent>
                            <h2>Excluir doação</h2>
                            <p>Tem certeza que deseja excluir esta doação cadastrada?</p>
                            <Styled.ModalActions>
                                <button type="button" className="secondary" onClick={handleCancelDelete}>
                                    Cancelar
                                </button>
                                <button type="button" className="danger" onClick={handleConfirmDelete}>
                                    Sim, excluir
                                </button>
                            </Styled.ModalActions>
                        </Styled.ModalContent>
                    </Styled.ModalOverlay>
                )}
            </main>
            <Footer />
        </>
    );
}

export default DoacoesView;
