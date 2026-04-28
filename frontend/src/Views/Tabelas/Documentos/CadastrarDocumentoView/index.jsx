import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    try {
        return new URL(link).hostname.replace("www.", "");
    } catch {
        return "";
    }
}

function CadastrarDocumentoView() {
    const navigate = useNavigate();
    const [erros, setErros] = useState({});
    const [modoFonte, setModoFonte] = useState("arquivo");
    const [arquivo, setArquivo] = useState(null);
    const [form, setForm] = useState({
        titulo: "",
        tipo: "",
        dataCriacao: new Date().toISOString().slice(0, 10),
        descricao: "",
        link: "",
    });

    const dominio = useMemo(() => obterDominio(form.link), [form.link]);

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
        if (modoFonte === "arquivo" && !arquivo) {
            novosErros.link = "Selecione um arquivo";
        }
        if (modoFonte === "link" && !form.link.trim()) {
            novosErros.link = "Informe o link de acesso";
        } else if (modoFonte === "link" && !dominio) {
            novosErros.link = "Informe uma URL valida";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    async function fetchCadastrarDocumento() {
        if (!validarLocalmente()) return;

        try {
            const payload = {
                ...form,
                link: modoFonte === "link" ? form.link : "",
            };

            if (modoFonte === "arquivo" && arquivo) {
                payload.arquivo = await arquivoParaDocumento(arquivo);
                if (!payload.titulo.trim()) payload.titulo = arquivo.name;
            }

            const response = await fetch(`${API_URL}/gravar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (response.ok) {
                navigate("/tabelas/documentos");
                return;
            }

            setErros(data.campos || {});
            alert(data.Erro || "Erro ao cadastrar documento");
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
                        <h2>Novo documento</h2>
                        <p>Envie um arquivo ou cadastre um link externo para acesso rapido.</p>
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
                                Enviar arquivo
                            </button>
                            <button
                                type="button"
                                className={modoFonte === "link" ? "active" : ""}
                                onClick={() => setModoFonte("link")}
                            >
                                Link externo
                            </button>
                        </div>

                        {modoFonte === "arquivo" ? (
                            <label>
                                Arquivo do documento
                                <input type="file" onChange={atualizarArquivo} />
                                {arquivo && <small>{arquivo.name}</small>}
                                {erros.link && <span>{erros.link}</span>}
                            </label>
                        ) : (
                            <label>
                                Link de acesso
                                <input
                                    type="url"
                                    name="link"
                                    placeholder="https://drive.google.com/..."
                                    value={form.link}
                                    onChange={atualizarForm}
                                />
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
                        <strong>{arquivo?.name || dominio || "Escolha arquivo ou cole uma URL"}</strong>
                    </Styled.LinkPreview>

                    <Styled.Actions>
                        <button type="button" className="secondary" onClick={() => navigate("/tabelas/documentos")}>
                            Cancelar
                        </button>
                        <button type="button" onClick={fetchCadastrarDocumento}>
                            Cadastrar documento
                        </button>
                    </Styled.Actions>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default CadastrarDocumentoView;
