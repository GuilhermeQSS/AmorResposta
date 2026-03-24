import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CadastrarDoacaoView() {
    function arquivoParaBase64(arquivo) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const conteudo = String(reader.result || "");
                const [, base64 = ""] = conteudo.split(",");
                resolve(base64);
            };

            reader.onerror = () => reject(new Error("Nao foi possivel ler o documento selecionado."));
            reader.readAsDataURL(arquivo);
        });
    }

    function validarFormulario(dados) {
        const novosErros = {};

        if (!dados.dataEntrega) {
            novosErros.dataEntrega = "Informe a data de entrada.";
        }

        if (!dados.tipo) {
            novosErros.tipo = "Selecione o tipo da doacao.";
        }

        if (!dados.origem.trim()) {
            novosErros.origem = "Informe a origem da doacao.";
        }

        if (!dados.formaEntrega) {
            novosErros.formaEntrega = "Selecione a forma de entrega.";
        }

        const quantidade = Number(dados.quantidadeItens);
        if (!dados.quantidadeItens || !Number.isInteger(quantidade) || quantidade <= 0) {
            novosErros.quantidadeItens = "Informe uma quantidade de itens valida.";
        }

        return novosErros;
    }

    async function prepararPayload(dados) {
        let documentoPayload = null;

        if (documento) {
            documentoPayload = {
                nomeArquivo: documento.name,
                tipoMime: documento.type || null,
                conteudoBase64: await arquivoParaBase64(documento)
            };
        }

        return {
            ...dados,
            doadorNome: dados.doadorNome.trim() || "anonimo",
            quantidadeItens: Number(dados.quantidadeItens),
            documento: documentoPayload
        };
    }

    async function fetchCadastrarDoacao() {
        const novosErros = validarFormulario(form);
        setErros(novosErros);

        if (Object.keys(novosErros).length > 0) {
            const primeiroCampoComErro = Object.keys(novosErros)[0];
            fieldRefs.current[primeiroCampoComErro]?.focus();
            return;
        }

        try {
            const payload = await prepararPayload(form);
            const response = await fetch("http://localhost:3000/doacoes/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.erro || "Erro ao cadastrar doacao");
            }

            navigate("/tabelas/doacoes");
        } catch (error) {
            alert(error.message);
        }
    }

    function atualizarForm(e) {
        const { name, value } = e.target;
        const nextValue = name === "quantidadeItens" ? value.replace(/\D/g, "") : value;
        const nextForm = {
            ...form,
            [name]: nextValue
        };

        setForm(nextForm);
        setErros((prev) => {
            if (!prev[name]) {
                return prev;
            }

            const errosAtualizados = validarFormulario(nextForm);
            if (!errosAtualizados[name]) {
                const { [name]: _campoRemovido, ...restante } = prev;
                return restante;
            }

            return {
                ...prev,
                [name]: errosAtualizados[name]
            };
        });
    }

    function atualizarDocumento(e) {
        const arquivoSelecionado = e.target.files?.[0] || null;
        setDocumento(arquivoSelecionado);
        setNomeDocumento(arquivoSelecionado?.name || "");
    }

    const [form, setForm] = useState({
        doadorNome: "",
        dataEntrega: "",
        origem: "",
        formaEntrega: "",
        tipo: "",
        quantidadeItens: "",
        observacao: ""
    });
    const [documento, setDocumento] = useState(null);
    const [nomeDocumento, setNomeDocumento] = useState("");
    const [erros, setErros] = useState({});
    const fieldRefs = useRef({});
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <main>
                <Styled.BackBtn>
                    <Link to={"/tabelas/doacoes"}>
                        <div>Voltar</div>
                    </Link>
                </Styled.BackBtn>

                <Styled.Form>
                    <div data-error={Boolean(erros.doadorNome)}>
                        <label htmlFor="doadorNome">Doador (opcional):</label>
                        <input
                            ref={(elemento) => {
                                fieldRefs.current.doadorNome = elemento;
                            }}
                            name="doadorNome"
                            value={form.doadorNome}
                            onChange={atualizarForm}
                            placeholder="Se vazio, sera registrado como anonimo"
                        />
                    </div>

                    <div data-error={Boolean(erros.dataEntrega)}>
                        <label htmlFor="dataEntrega">Data de entrada:</label>
                        <input
                            ref={(elemento) => {
                                fieldRefs.current.dataEntrega = elemento;
                            }}
                            type="date"
                            name="dataEntrega"
                            value={form.dataEntrega}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div data-error={Boolean(erros.tipo)}>
                        <label htmlFor="tipo">Tipo:</label>
                        <select
                            ref={(elemento) => {
                                fieldRefs.current.tipo = elemento;
                            }}
                            name="tipo"
                            value={form.tipo}
                            onChange={atualizarForm}
                        >
                            <option value="">Selecione</option>
                            <option value="Alimentos">Alimentos</option>
                            <option value="Roupas">Roupas</option>
                            <option value="Higiene">Higiene</option>
                            <option value="Materiais">Materiais diversos</option>
                            <option value="Financeira">Financeira</option>
                        </select>
                    </div>

                    <div data-error={Boolean(erros.origem)}>
                        <label htmlFor="origem">Origem:</label>
                        <input
                            ref={(elemento) => {
                                fieldRefs.current.origem = elemento;
                            }}
                            name="origem"
                            value={form.origem}
                            onChange={atualizarForm}
                            placeholder="Campanha, parceiro, coleta..."
                        />
                    </div>

                    <div data-error={Boolean(erros.formaEntrega)}>
                        <label htmlFor="formaEntrega">Forma de entrega:</label>
                        <select
                            ref={(elemento) => {
                                fieldRefs.current.formaEntrega = elemento;
                            }}
                            name="formaEntrega"
                            value={form.formaEntrega}
                            onChange={atualizarForm}
                        >
                            <option value="">Selecione</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Coleta">Coleta</option>
                            <option value="Transferencia">Transferencia</option>
                            <option value="Entrega externa">Entrega externa</option>
                        </select>
                    </div>

                    <div data-error={Boolean(erros.quantidadeItens)}>
                        <label htmlFor="quantidadeItens">Quantidade de itens:</label>
                        <input
                            ref={(elemento) => {
                                fieldRefs.current.quantidadeItens = elemento;
                            }}
                            type="number"
                            min="1"
                            step="1"
                            name="quantidadeItens"
                            value={form.quantidadeItens}
                            onChange={atualizarForm}
                            placeholder="Informe a quantidade"
                        />
                    </div>

                    <div data-error={Boolean(erros.observacao)}>
                        <label htmlFor="observacao">Observacao:</label>
                        <textarea
                            ref={(elemento) => {
                                fieldRefs.current.observacao = elemento;
                            }}
                            name="observacao"
                            value={form.observacao}
                            onChange={atualizarForm}
                            rows="4"
                            placeholder="Detalhes importantes da doacao"
                        />
                    </div>

                    <div data-error={Boolean(erros.documento)}>
                        <label htmlFor="documento">Documento (opcional):</label>
                        <input
                            ref={(elemento) => {
                                fieldRefs.current.documento = elemento;
                            }}
                            type="file"
                            name="documento"
                            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                            onChange={atualizarDocumento}
                        />
                        <small>
                            {nomeDocumento || "Voce pode anexar comprovante, recibo ou outro documento."}
                        </small>
                    </div>

                    <button
                        type="button"
                        onClick={fetchCadastrarDoacao}
                    >
                        Cadastrar
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default CadastrarDoacaoView;
