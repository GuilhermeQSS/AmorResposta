import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/documentos";

function formatarData(value) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("pt-BR");
}

function obterDominio(link) {
    if (!link) return "Sem link";

    if (link.startsWith("uploads/")) return "Arquivo local";

    try {
        return new URL(link).hostname.replace("www.", "");
    } catch {
        return "Link invalido";
    }
}

function resolverLink(link) {
    if (!link) return "";
    if (link.startsWith("uploads/")) return `http://localhost:3000/${link}`;
    return link;
}

function DocumentosView() {
    const [documentos, setDocumentos] = useState([]);
    const [filtroTitulo, setFiltroTitulo] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    const documentosComLink = useMemo(
        () => documentos.filter((documento) => documento.link).length,
        [documentos]
    );

    async function fetchDocumentoLista() {
        try {
            const params = new URLSearchParams();
            if (filtroTitulo) params.append("filtroTitulo", filtroTitulo);
            if (filtroTipo) params.append("filtroTipo", filtroTipo);

            const response = await fetch(`${API_URL}/listar?${params.toString()}`, {
                method: "GET",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.Erro || "Erro ao carregar documentos");
            }

            setDocumentos(Array.isArray(data) ? data : []);
            setErro("");
        } catch (error) {
            setDocumentos([]);
            setErro(error.message || "Erro ao conectar com o servidor");
        }
    }

    function abrirDocumento(event, link) {
        event.stopPropagation();
        if (!link) return;
        window.open(resolverLink(link), "_blank", "noopener,noreferrer");
    }

    function editarDocumento(event, id) {
        event.stopPropagation();
        navigate(`/documentos/${id}`);
    }

    async function excluirDocumento(event, documento) {
        event.stopPropagation();

        const confirmar = window.confirm(`Deseja excluir o documento "${documento.titulo}"?`);
        if (!confirmar) return;

        try {
            const response = await fetch(`${API_URL}/excluir`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: documento.id }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.Erro || "Erro ao excluir documento");
            }

            await fetchDocumentoLista();
        } catch (error) {
            setErro(error.message || "Erro ao conectar com o servidor");
        }
    }

    useEffect(() => {
        fetchDocumentoLista();
    }, [filtroTitulo, filtroTipo]);

    return (
        <>
            <Header />
            <main>
                <Styled.Page>
                    <Styled.HeaderRow>
                        <div>
                            <h1>Documentos</h1>
                            <p>Organize registros, termos, comprovantes e arquivos externos da instituicao.</p>
                        </div>
                        <button type="button" onClick={() => navigate("/documentos/cadastro")}>
                            Novo documento
                        </button>
                    </Styled.HeaderRow>

                    <Styled.SummaryGrid>
                        <div>
                            <small>Total</small>
                            <strong>{documentos.length}</strong>
                        </div>
                        <div>
                            <small>Com acesso</small>
                            <strong>{documentosComLink}</strong>
                        </div>
                        <div>
                            <small>Filtro de tipo</small>
                            <strong>{filtroTipo || "Todos"}</strong>
                        </div>
                    </Styled.SummaryGrid>

                    <Styled.Filters>
                        <label>
                            Buscar documento
                            <input
                                type="text"
                                placeholder="Título, termo, comprovante..."
                                value={filtroTitulo}
                                onChange={(e) => setFiltroTitulo(e.target.value)}
                            />
                        </label>
                        <label>
                            Tipo
                            <input
                                type="text"
                                placeholder="PDF, DOCX, Planilha..."
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                            />
                        </label>
                    </Styled.Filters>

                    {erro && <Styled.Alert>{erro}</Styled.Alert>}

                    {documentos.length === 0 ? (
                        <Styled.EmptyState>Nenhum documento encontrado para o filtro atual.</Styled.EmptyState>
                    ) : (
                        <Styled.TableWrap>
                            <Styled.Table>
                                <thead>
                                    <tr>
                                        <th>Documento</th>
                                        <th>Tipo</th>
                                        <th>Data</th>
                                        <th>Descrição</th>
                                        <th>Acesso</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documentos.map((documento) => (
                                        <tr key={documento.id} onClick={() => navigate(`/documentos/${documento.id}`)}>
                                            <td>
                                                <strong>{documento.titulo}</strong>
                                                <span>#{documento.id}</span>
                                            </td>
                                            <td>
                                                <Styled.TypeBadge>{documento.tipo}</Styled.TypeBadge>
                                            </td>
                                            <td>{formatarData(documento.dataCriacao)}</td>
                                            <td>{documento.descricao || "-"}</td>
                                            <td>
                                                {documento.link ? (
                                                    <Styled.LinkButton
                                                        type="button"
                                                        onClick={(event) => abrirDocumento(event, documento.link)}
                                                    >
                                                        {documento.link.startsWith("uploads/") ? "Abrir arquivo" : `Abrir em ${obterDominio(documento.link)}`}
                                                    </Styled.LinkButton>
                                                ) : (
                                                    <Styled.Muted>Sem link</Styled.Muted>
                                                )}
                                            </td>
                                            <td>
                                                <Styled.ActionGroup>
                                                    <Styled.ActionButton
                                                        type="button"
                                                        onClick={(event) => editarDocumento(event, documento.id)}
                                                    >
                                                        Editar
                                                    </Styled.ActionButton>
                                                    <Styled.ActionButton
                                                        type="button"
                                                        className="danger"
                                                        onClick={(event) => excluirDocumento(event, documento)}
                                                    >
                                                        Excluir
                                                    </Styled.ActionButton>
                                                </Styled.ActionGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Styled.Table>
                        </Styled.TableWrap>
                    )}
                </Styled.Page>
            </main>
            <Footer />
        </>
    );
}

export default DocumentosView;
