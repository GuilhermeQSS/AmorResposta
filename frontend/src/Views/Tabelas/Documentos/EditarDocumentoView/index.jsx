import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:3000/documentos";
const TIPOS_DOCUMENTO = ["PDF", "DOCX", "XLSX", "Imagem", "Contrato", "Termo", "Comprovante", "Outro"];

function arquivoParaDocumento(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => {
            const resultado = String(leitor.result || "");
            resolve({
                nomeArquivo: arquivo.name,
                tipoMime: arquivo.type,
                conteudoBase64: resultado.includes(",") ? resultado.split(",")[1] : resultado,
            });
        };
        leitor.onerror = () => reject(new Error("Nao foi possivel ler o arquivo selecionado"));
        leitor.readAsDataURL(arquivo);
    });
}

function obterDominio(link) {
    if (link?.startsWith("uploads/")) return "Arquivo local";

    try {
        return new URL(link).hostname.replace("www.", "");
    } catch {
        return "";
    }
}

function resolverLink(link) {
    if (!link) return "";
    if (link.startsWith("uploads/")) return `http://localhost:3000/${link}`;
    return link;
}

function EditarDocumentoView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [erros, setErros] = useState({});
    const [modoFonte, setModoFonte] = useState("arquivo");
    const [arquivo, setArquivo] = useState(null);
    const [form, setForm] = useState({
        id,
        titulo: "",
        tipo: "",
        dataCriacao: "",
        descricao: "",
        link: "",
    });
    const [formOriginal, setFormOriginal] = useState(null);

    const dominio = useMemo(() => obterDominio(form.link), [form.link]);
    const editado = formOriginal ? JSON.stringify(form) !== JSON.stringify(formOriginal) || Boolean(arquivo) : false;

    useEffect(() => {
        async function fetchDocumento() {
            try {
                const response = await fetch(`${API_URL}/buscar?id=${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.Erro || "Erro ao buscar documento");
                }

                const dataFormatada = data.dataCriacao ? new Date(data.dataCriacao).toISOString().split("T")[0] : "";
                const formData = { ...data, dataCriacao: dataFormatada };
                setForm(formData);
                setFormOriginal(formData);
                setModoFonte(data.link?.startsWith("uploads/") ? "arquivo" : "link");
            } catch (error) {
                alert(error.message || "Erro ao conectar com o servidor");
            }
        }

        fetchDocumento();
    }, [id]);

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErros((prev) => ({ ...prev, [name]: "" }));
    }

    function atualizarArquivo(e) {
        const arquivoSelecionado = e.target.files?.[0] || null;
        setArquivo(arquivoSelecionado);
        setErros((prev) => ({ ...prev, link: "" }));
    }

    function validarLocalmente() {
        const novosErros = {};
        if (!form.titulo.trim()) novosErros.titulo = "Titulo obrigatorio";
        if (!form.tipo.trim()) novosErros.tipo = "Tipo obrigatorio";
        if (!form.dataCriacao) novosErros.dataCriacao = "Data obrigatoria";
        if (!form.descricao.trim()) novosErros.descricao = "Descricao obrigatoria";
        if (modoFonte === "arquivo" && !arquivo && !form.link?.startsWith("uploads/")) {
            novosErros.link = "Selecione um arquivo";
        }
        if (modoFonte === "link" && !form.link.trim()) {
            novosErros.link = "Informe o link de acesso";
        } else if (modoFonte === "link" && (form.link.startsWith("uploads/") || !dominio)) {
            novosErros.link = "Informe uma URL valida";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    async function fetchAlterarDocumento() {
        if (!validarLocalmente()) return;

        try {
            const payload = {
                ...form,
                link: modoFonte === "link" ? form.link : form.link,
            };

            if (modoFonte === "arquivo" && arquivo) {
                payload.arquivo = await arquivoParaDocumento(arquivo);
            }

            const response = await fetch(`${API_URL}/alterar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (response.ok) {
                navigate("/tabelas/documentos");
                return;
            }

            setErros(data.campos || {});
            alert(data.Erro || "Erro ao alterar documento");
        } catch {
            alert("Erro na conexao com o servidor");
        }
    }

    async function fetchExcluirDocumento() {
        if (!window.confirm("Deseja realmente excluir este documento?")) return;

        try {
            const response = await fetch(`${API_URL}/excluir`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: form.id }),
            });
            const data = await response.json();

            if (response.ok) {
                navigate("/tabelas/documentos");
                return;
            }

            alert(data.Erro || "Erro ao excluir documento");
        } catch {
            alert("Erro na conexao com o servidor");
        }
    }

    return (
        <>
            <Header />
            <main>
                <Styled.BackBtn type="button" onClick={() => navigate("/tabelas/documentos")}>
                    Voltar
                </Styled.BackBtn>
                <Styled.Form>
                    <Styled.FormHeader>
                        <div>
                            <h2>Editar documento</h2>
                            <p>#{form.id} no acervo de documentos</p>
                        </div>
                        {dominio && (
                            <button type="button" className="linkAction" onClick={() => window.open(resolverLink(form.link), "_blank")}>
                                Abrir documento
                            </button>
                        )}
                    </Styled.FormHeader>

                    <Styled.Grid>
                        <label>
                            Titulo
                            <input type="text" name="titulo" value={form.titulo} onChange={atualizarForm} />
                            {erros.titulo && <span>{erros.titulo}</span>}
                        </label>

                        <label>
                            Tipo
                            <select name="tipo" value={form.tipo} onChange={atualizarForm}>
                                <option value="">Selecione</option>
                                {TIPOS_DOCUMENTO.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {tipo}
                                    </option>
                                ))}
                            </select>
                            {erros.tipo && <span>{erros.tipo}</span>}
                        </label>

                        <label>
                            Data de criacao
                            <input type="date" name="dataCriacao" value={form.dataCriacao} onChange={atualizarForm} />
                            {erros.dataCriacao && <span>{erros.dataCriacao}</span>}
                        </label>

                        <div />
                    </Styled.Grid>

                    <Styled.SourcePanel>
                        <div>
                            <button
                                type="button"
                                className={modoFonte === "arquivo" ? "active" : ""}
                                onClick={() => setModoFonte("arquivo")}
                            >
                                Arquivo
                            </button>
                            <button
                                type="button"
                                className={modoFonte === "link" ? "active" : ""}
                                onClick={() => {
                                    setModoFonte("link");
                                    if (form.link?.startsWith("uploads/")) {
                                        setForm((prev) => ({ ...prev, link: "" }));
                                    }
                                }}
                            >
                                Link externo
                            </button>
                        </div>

                        {modoFonte === "arquivo" ? (
                            <label>
                                Substituir arquivo
                                <input type="file" onChange={atualizarArquivo} />
                                <small>{arquivo?.name || (form.link?.startsWith("uploads/") ? "Arquivo atual mantido" : "Selecione um arquivo")}</small>
                                {erros.link && <span>{erros.link}</span>}
                            </label>
                        ) : (
                            <label>
                                Link de acesso
                                <input type="url" name="link" value={form.link} onChange={atualizarForm} />
                                {erros.link && <span>{erros.link}</span>}
                            </label>
                        )}
                    </Styled.SourcePanel>

                    <label>
                        Descricao
                        <textarea name="descricao" rows="4" value={form.descricao} onChange={atualizarForm} />
                        {erros.descricao && <span>{erros.descricao}</span>}
                    </label>

                    <Styled.LinkPreview className={dominio || arquivo ? "valid" : ""}>
                        <small>Destino do documento</small>
                        <strong>{arquivo?.name || dominio || "Link ainda nao validado"}</strong>
                    </Styled.LinkPreview>

                    <Styled.Actions>
                        <button type="button" className="danger" onClick={fetchExcluirDocumento}>
                            Excluir
                        </button>
                        <button type="button" className="secondary" onClick={() => navigate("/tabelas/documentos")}>
                            Cancelar
                        </button>
                        <button type="button" onClick={fetchAlterarDocumento} disabled={!editado}>
                            Salvar alteracoes
                        </button>
                    </Styled.Actions>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default EditarDocumentoView;
