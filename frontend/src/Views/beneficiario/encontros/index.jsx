import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BeneficiarioEncontrosView() {
    const [filtroTitulo, setFiltroTitulo] = useState("");
    const [filtro, setFiltro] = useState("nDias");
    const [dias, setDias] = useState(7);
    const [mesAno, setMesAno] = useState(
        new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0")
    );
    const [encontros, setEncontros] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [loadingParticipacao, setLoadingParticipacao] = useState(false);
    const [loadingLista, setLoadingLista] = useState(true); // Adicionado para UX
    const navigate = useNavigate();

    // Formata a data para enviar ao backend (YYYY-MM-DD)
    function formatarData(date) {
        const ano = date.getFullYear();
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const dia = String(date.getDate()).padStart(2, "0");
        return `${ano}-${mes}-${dia}`;
    }

    // Formata a data para exibir na tela de forma amigável
    function formatarDataExibicao(dataStr) {
        if (!dataStr) return "";
        const date = new Date(dataStr);
        return date.toLocaleDateString("pt-BR", {
            timeZone: "UTC", // Evita que o fuso horário atrase a data em 1 dia
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    function isLotado(enc) {
        return enc.qtdeMax > 0 && enc.qtde >= enc.qtdeMax;
    }

    useEffect(() => {
        async function carregar() {
            setLoadingLista(true);
            let dataInicio, dataFim;

            if (filtro === "nDias") {
                dataInicio = new Date();
                dataFim = new Date();
                dataFim.setDate(dataFim.getDate() + Number(dias));
            } else {
                const [ano, mes] = mesAno.split("-").map(Number);
                dataInicio = new Date(ano, mes - 1, 1);
                dataFim = new Date(ano, mes, 0); // Último dia do mês
            }

            const data = await fetchEncontrosLista(
                filtroTitulo,
                formatarData(dataInicio),
                formatarData(dataFim)
            );
            
            setEncontros(Array.isArray(data) ? data : []);
            setLoadingLista(false);
        }

        carregar();
    }, [filtroTitulo, filtro, dias, mesAno]);

    async function fetchEncontrosLista(titulo, dataInicio, dataFim) {
        const token = localStorage.getItem("token");
        try {
            const params = new URLSearchParams();
            if (titulo) params.append("titulo", titulo);
            params.append("dataInicio", dataInicio);
            params.append("dataFim", dataFim);

            const response = await fetch(
                `http://localhost:3000/api/encontros/listar-como-beneficiario?${params}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return [];
            }

            if (!response.ok) {
    const erroBackend = await response.json().catch(() => ({})); // Tenta ler o json do backend
    console.error("Detalhes do erro:", erroBackend);
    throw new Error(erroBackend.message || erroBackend.err || `Status do erro: ${response.status}`);
}
            return await response.json();
        } catch (err) {
            alert("Erro ao conectar com o servidor: " + err.message);
            return [];
        }
    }

    async function confirmarParticipacao() {
        if (!selecionado) return;
        const token = localStorage.getItem("token");
        setLoadingParticipacao(true);
        
        try {
            const response = await fetch(
                `http://localhost:3000/api/encontros/cadastrar-beneficiario?idEncontro=${selecionado.encontro.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return;
            }

            if (response.ok) {
                // Atualiza o estado local para evitar uma nova requisição na API
                setEncontros((prev) =>
                    prev.map((item) =>
                        item.encontro.id === selecionado.encontro.id
                            ? { 
                                ...item, 
                                beneficiario: selecionado.encontro.id, // Simulando inscrição ativa
                                participou: 0,
                                encontro: { 
                                    ...item.encontro, 
                                    qtde: item.encontro.qtde + 1
                                }
                            }
                            : item
                    )
                );
                setSelecionado(null);
                alert("Inscrição realizada com sucesso!");
            } else {
                const erro = await response.json();
                alert("Erro ao confirmar participação: " + (erro.err || "Tente novamente."));
            }
        } catch (err) {
            alert("Erro ao conectar com o servidor: " + err.message);
        } finally {
            setLoadingParticipacao(false);
        }
    }

    async function retirarParticipacao() {
        if (!selecionado) return;
        const token = localStorage.getItem("token");
        setLoadingParticipacao(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/encontros/retirar-beneficiario?idEncontro=${selecionado.encontro.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return;
            }

            if (response.ok) {
                // Atualiza o estado local para retirar a inscrição
                setEncontros((prev) =>
                    prev.map((item) =>
                        item.encontro.id === selecionado.encontro.id
                            ? { 
                                ...item, 
                                beneficiario: null, 
                                participou: null,
                                encontro: { 
                                    ...item.encontro, 
                                    qtde: Math.max(0, item.encontro.qtde - 1)
                                }
                            }
                            : item
                    )
                );
                setSelecionado(null);
                alert("Inscrição cancelada com sucesso!");
            } else {
                const erro = await response.json();
                alert("Erro ao cancelar inscrição: " + (erro.err || "Tente novamente."));
            }
        } catch (err) {
            alert("Erro ao conectar com o servidor: " + err.message);
        } finally {
            setLoadingParticipacao(false);
        }
    }

    function getStatusCard(item) {
        if (item.beneficiario !== null) {
            return item.participou === 1 ? "Você participou" : "Inscrito";
        }
        if (isLotado(item.encontro)) return "Lotado";
        return "Vagas disponíveis";
    }

    return (
        <>
            <Header />

            <Styled.Container>
                <Styled.Filtros>
                    <label>Buscar encontros por:</label>
                    <select
                        value={filtro}
                        onChange={(e) => {
                            setDias(7);
                            setFiltro(e.target.value);
                        }}
                    >
                        <option value="nDias">Próximos dias</option>
                        <option value="mesAno">Mês e ano</option>
                    </select>

                    {filtro === "nDias" && (
                        <>
                            <label>Dias:</label>
                            <input
                                type="number"
                                value={dias}
                                onChange={(e) => setDias(e.target.value)}
                                inputMode="numeric"
                                min={1}
                            />
                        </>
                    )}

                    {filtro === "mesAno" && (
                        <>
                            <label>Mês e ano:</label>
                            <input
                                type="month"
                                value={mesAno}
                                onChange={(e) => setMesAno(e.target.value)}
                            />
                        </>
                    )}
                </Styled.Filtros>

                <Styled.Busca
                    value={filtroTitulo}
                    onChange={(e) => setFiltroTitulo(e.target.value)}
                    placeholder="Buscar por título..."
                />

                <Styled.Lista>
                    {loadingLista ? (
                        <Styled.Vazio>Carregando encontros...</Styled.Vazio>
                    ) : encontros.length > 0 ? (
                        encontros.map((item) => (
                            <li key={item.encontro.id}>
                                <Styled.CardEncontro
                                    onClick={() => setSelecionado(item)}
                                    $inscrito={item.beneficiario !== null}
                                    $lotado={isLotado(item.encontro) && item.beneficiario === null}
                                >
                                    <strong>{item.encontro.titulo}</strong>
                                    {item.encontro.data && (
                                        <span>{formatarDataExibicao(item.encontro.data)}</span>
                                    )}
                                    {item.encontro.local && (
                                        <span>{item.encontro.local}</span>
                                    )}
                                    <span className="status">{getStatusCard(item)}</span>
                                </Styled.CardEncontro>
                            </li>
                        ))
                    ) : (
                        <Styled.Vazio>Nenhum encontro encontrado para este período.</Styled.Vazio>
                    )}
                </Styled.Lista>
            </Styled.Container>

            {/* Modal */}
            {selecionado && (
                <Styled.ModalOverlay
                    onClick={() => !loadingParticipacao && setSelecionado(null)}
                >
                    <Styled.Modal onClick={(e) => e.stopPropagation()}>
                        <h2>{selecionado.encontro.titulo}</h2>

                        <Styled.ModalInfo>
                            <p><strong>Data:</strong> {formatarDataExibicao(selecionado.encontro.data)}</p>
                            <p><strong>Local:</strong> {selecionado.encontro.local}</p>
                            <p><strong>Detalhes:</strong> {selecionado.encontro.descricao}</p>
                            <p><strong>Vagas preenchidas:</strong> {selecionado.encontro.qtde}/{selecionado.encontro.qtdeMax}</p>
                        </Styled.ModalInfo>

                        {/* Caso: Inscrito, mas ainda não participou */}
                        {selecionado.beneficiario !== null && selecionado.participou !== 1 && (
                            <>
                                <Styled.ModalMensagem $tipo="inscrito">
                                    Você já está inscrito neste encontro.
                                </Styled.ModalMensagem>
                                <Styled.ModalActions>
                                    <button
                                        className="btn-cancelar"
                                        onClick={() => setSelecionado(null)}
                                        disabled={loadingParticipacao}
                                    >
                                        Fechar
                                    </button>
                                    <button
                                        className="btn-retirar"
                                        onClick={retirarParticipacao}
                                        disabled={loadingParticipacao}
                                    >
                                        {loadingParticipacao ? "Cancelando..." : "Cancelar inscrição"}
                                    </button>
                                </Styled.ModalActions>
                            </>
                        )}

                        {/* Caso: Já Participou (Status finalizado para o beneficiário) */}
                        {selecionado.beneficiario !== null && selecionado.participou === 1 && (
                            <>
                                <Styled.ModalMensagem $tipo="inscrito">
                                    Você já participou deste encontro.
                                </Styled.ModalMensagem>
                                <Styled.ModalActions>
                                    <button
                                        className="btn-cancelar"
                                        onClick={() => setSelecionado(null)}
                                    >
                                        Fechar
                                    </button>
                                </Styled.ModalActions>
                            </>
                        )}

                        {/* Caso: Não inscrito e Lotado */}
                        {selecionado.beneficiario === null && isLotado(selecionado.encontro) && (
                            <>
                                <Styled.ModalMensagem $tipo="lotado">
                                    Este encontro está com as vagas esgotadas.
                                </Styled.ModalMensagem>
                                <Styled.ModalActions>
                                    <button
                                        className="btn-cancelar"
                                        onClick={() => setSelecionado(null)}
                                    >
                                        Fechar
                                    </button>
                                </Styled.ModalActions>
                            </>
                        )}

                        {selecionado.beneficiario === null && !isLotado(selecionado.encontro) && (
                            <>
                                <p>Deseja confirmar sua inscrição neste encontro?</p>
                                <Styled.ModalActions>
                                    <button
                                        className="btn-cancelar"
                                        onClick={() => setSelecionado(null)}
                                        disabled={loadingParticipacao}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn-confirmar"
                                        onClick={confirmarParticipacao}
                                        disabled={loadingParticipacao}
                                    >
                                        {loadingParticipacao ? "Inscrevendo..." : "Sim, quero participar"}
                                    </button>
                                </Styled.ModalActions>
                            </>
                        )}
                    </Styled.Modal>
                </Styled.ModalOverlay>
            )}

            <Footer />
        </>
    );
}

export default BeneficiarioEncontrosView;