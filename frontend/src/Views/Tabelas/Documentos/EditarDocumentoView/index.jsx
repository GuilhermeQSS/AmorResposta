import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:3000/documentos";
const TIPOS_DOCUMENTO = ["PDF", "DOCX", "XLSX", "IMAGEM", "CONTRATO", "TERMO", "COMPROVANTE", "OUTRO"];
const TEXTO_REGEX = /^[A-Za-zÀ-ÿ0-9\s.,;:!?ºª°'"()/_-]{3,255}$/;
const NOME_ARQUIVO_REGEX = /^[A-Za-zÀ-ÿ0-9\s._()-]+\.[A-Za-z0-9]{1,10}$/;
const TAMANHO_MAXIMO_ARQUIVO = 10 * 1024 * 1024;
const ACCEPT_POR_TIPO = {
    PDF: ".pdf,application/pdf",
    DOCX: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    XLSX: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    IMAGEM: "image/*",
    CONTRATO: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    TERMO: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    COMPROVANTE: ".pdf,image/*",
    OUTRO: "",
};

function arquivoParaDocumento(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => {
            const resultado = String(leitor.result || "");
            resolve({
                nomeArquivo: arquivo.name,
                tipoMime: arquivo.type,
                tamanho: arquivo.size,
                conteudoBase64: resultado.includes(",") ? resultado.split(",")[1] : resultado,
            });
        };
        leitor.onerror = () => reject(new Error("Não foi possível ler o arquivo selecionado"));
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

function dataNoFuturo(data) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const informada = new Date(`${data}T00:00:00`);
    return informada > hoje;
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
    const acceptArquivo = ACCEPT_POR_TIPO[form.tipo] || "";
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

        if (name === "tipo") {
            setArquivo(null);
            setErros((prev) => ({ ...prev, link: "" }));
        }
    }

    function atualizarArquivo(e) {
        const arquivoSelecionado = e.target.files?.[0] || null;
        setArquivo(arquivoSelecionado);
        setErros((prev) => ({ ...prev, link: "" }));
    }

    function validarLocalmente() {
        const novosErros = {};
        if (!form.titulo.trim()) novosErros.titulo = "Título obrigatório";
        if (form.titulo.trim() && !TEXTO_REGEX.test(form.titulo.trim())) {
            novosErros.titulo = "Use pelo menos 3 caracteres e apenas texto válido";
        }
        if (!form.tipo.trim()) novosErros.tipo = "Tipo obrigatório";
        if (form.tipo && !TIPOS_DOCUMENTO.includes(form.tipo)) {
            novosErros.tipo = "Tipo invalido";
        }
        if (!form.dataCriacao) novosErros.dataCriacao = "Data obrigatória";
        if (form.dataCriacao && dataNoFuturo(form.dataCriacao)) {
            novosErros.dataCriacao = "Data não pode estar no futuro";
        }
        if (!form.descricao.trim()) novosErros.descricao = "Descrição obrigatória";
        if (form.descricao.trim() && !TEXTO_REGEX.test(form.descricao.trim())) {
            novosErros.descricao = "Use pelo menos 3 caracteres e apenas texto válido";
        }
        if (modoFonte === "arquivo" && !arquivo && !form.link?.startsWith("uploads/")) {
            novosErros.link = "Selecione um arquivo";
        } else if (modoFonte === "arquivo" && arquivo) {
            if (!NOME_ARQUIVO_REGEX.test(arquivo.name)) novosErros.link = "Nome de arquivo invalido";
            if (arquivo.size <= 0 || arquivo.size > TAMANHO_MAXIMO_ARQUIVO) {
                novosErros.link = "Arquivo deve ter até 10MB";
            }
        }
        if (modoFonte === "link" && !form.link.trim()) {
            novosErros.link = "Informe o link de acesso";
        } else if (modoFonte === "link" && (form.link.startsWith("uploads/") || !dominio)) {
            novosErros.link = "Informe uma URL válida";
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
                            Título
                            <input
                                type="text"
                                name="titulo"
                                maxLength="120"
                                pattern={TEXTO_REGEX.source}
                                value={form.titulo}
                                onChange={atualizarForm}
                            />
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
                            Data de criação
                            <input
                                type="date"
                                name="dataCriacao"
                                max={new Date().toISOString().slice(0, 10)}
                                value={form.dataCriacao}
                                onChange={atualizarForm}
                            />
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
                                <input type="file" accept={acceptArquivo} onChange={atualizarArquivo} />
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
                        Descrição
                        <textarea
                            name="descricao"
                            rows="4"
                            maxLength="255"
                            value={form.descricao}
                            onChange={atualizarForm}
                        />
                        {erros.descricao && <span>{erros.descricao}</span>}
                    </label>

                    <Styled.LinkPreview className={dominio || arquivo ? "valid" : ""}>
                        <small>Destino do documento</small>
                        <strong>{arquivo?.name || dominio || "Link ainda não validado"}</strong>
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
