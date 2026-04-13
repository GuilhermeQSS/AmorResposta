import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    calcularQuantidadeDetalhada,
    criarDetalhesDoacaoVazios,
    obterHigieneDisponiveis,
    montarDetalhesPayload,
    obterAlimentosDisponiveis,
    obterItensDetalhados,
    obterRoupasDisponiveis,
    usaQuantidadeAutomatica
} from "../detalhesDoacao";

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

    function validarFormulario(dados, detalhes) {
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

        if (dados.tipo === "Alimentos") {
            if (calcularQuantidadeDetalhada(dados.tipo, detalhes) <= 0) {
                novosErros.itensDetalhados = "Informe ao menos uma quantidade para os alimentos.";
            }

            const alimentoSemValidade = detalhes.alimentosSelecionados.some((chave) => {
                const quantidade = Number(detalhes.itens[chave]);
                return quantidade > 0 && !String(detalhes.validadePorAlimento?.[chave] || "").trim();
            });

            if (alimentoSemValidade) {
                novosErros.validade = "Informe a validade de cada alimento com quantidade maior que zero.";
            }
        }

        if (dados.tipo === "Roupas") {
            if (!detalhes.categoriaRoupas) {
                novosErros.categoriaRoupas = "Escolha se a doacao e para verao ou inverno.";
            }

            if (calcularQuantidadeDetalhada(dados.tipo, detalhes) <= 0) {
                novosErros.itensDetalhados = "Informe ao menos uma quantidade para as roupas.";
            }
        }

        if (dados.tipo === "Higiene" && calcularQuantidadeDetalhada(dados.tipo, detalhes) <= 0) {
            novosErros.itensDetalhados = "Informe ao menos uma quantidade para os itens de higiene.";
        }

        if (dados.tipo === "Materiais" && !String(detalhes.materialDescricao || "").trim()) {
            novosErros.materialDescricao = "Informe qual e o material diverso.";
        }

        if (dados.tipo === "Financeira") {
            const valorFinanceiro = Number(detalhes.valorFinanceiro);
            if (!Number.isFinite(valorFinanceiro) || valorFinanceiro <= 0) {
                novosErros.valorFinanceiro = "Informe um valor valido para a doacao.";
            }
        }

        return novosErros;
    }

    async function prepararPayload(dados, detalhes) {
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
            detalhes: montarDetalhesPayload(dados.tipo, detalhes),
            documento: documentoPayload
        };
    }

    async function fetchCadastrarDoacao() {
        const novosErros = validarFormulario(form, detalhesDoacao);
        setErros(novosErros);

        if (Object.keys(novosErros).length > 0) {
            const primeiroCampoComErro = Object.keys(novosErros)[0];
            fieldRefs.current[primeiroCampoComErro]?.focus();
            return;
        }

        try {
            const payload = await prepararPayload(form, detalhesDoacao);
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

        if (name === "tipo" && usaQuantidadeAutomatica(value)) {
            nextForm.quantidadeItens = String(calcularQuantidadeDetalhada(value, detalhesDoacao));
        }

        if (name === "tipo" && !usaQuantidadeAutomatica(value) && usaQuantidadeAutomatica(form.tipo)) {
            nextForm.quantidadeItens = "";
        }

        setForm(nextForm);
        setErros((prev) => {
            if (!prev[name] && !(name === "tipo" && (prev.validade || prev.categoriaRoupas || prev.itensDetalhados))) {
                return prev;
            }

            return validarFormulario(nextForm, detalhesDoacao);
        });
    }

    function atualizarDocumento(e) {
        const arquivoSelecionado = e.target.files?.[0] || null;
        setDocumento(arquivoSelecionado);
        setNomeDocumento(arquivoSelecionado?.name || "");
    }

    function atualizarDetalhes(e) {
        const { name, value } = e.target;
        const nextDetalhes = {
            ...detalhesDoacao,
            [name]: name === "valorFinanceiro" ? value.replace(",", ".") : value
        };

        setDetalhesDoacao(nextDetalhes);
        setErros((prev) => {
            if (!prev[name] && !prev.itensDetalhados && !prev.quantidadeItens && !prev.valorFinanceiro) {
                return prev;
            }

            return validarFormulario(form, nextDetalhes);
        });
    }

    function atualizarQuantidadeDetalhada(chave, valor) {
        const valorLimpo = valor.replace(/\D/g, "");
        const nextDetalhes = {
            ...detalhesDoacao,
            itens: {
                ...detalhesDoacao.itens,
                [chave]: valorLimpo
            }
        };

        setDetalhesDoacao(nextDetalhes);
        setErros((prev) => {
            if (!prev.itensDetalhados && !prev.quantidadeItens && !prev.validade) {
                return prev;
            }

            return validarFormulario(form, nextDetalhes);
        });
    }

    function atualizarValidadeAlimento(chave, valor) {
        const nextDetalhes = {
            ...detalhesDoacao,
            validadePorAlimento: {
                ...detalhesDoacao.validadePorAlimento,
                [chave]: valor
            }
        };

        setDetalhesDoacao(nextDetalhes);
        setErros((prev) => {
            if (!prev.validade) {
                return prev;
            }

            return validarFormulario(form, nextDetalhes);
        });
    }

    function adicionarAlimento() {
        if (!alimentoParaAdicionar) {
            return;
        }

        const nextDetalhes = {
            ...detalhesDoacao,
            alimentosSelecionados: [...detalhesDoacao.alimentosSelecionados, alimentoParaAdicionar],
            validadePorAlimento: {
                ...detalhesDoacao.validadePorAlimento,
                [alimentoParaAdicionar]: detalhesDoacao.validadePorAlimento?.[alimentoParaAdicionar] || ""
            }
        };

        setDetalhesDoacao(nextDetalhes);
        setAlimentoParaAdicionar("");
        setErros((prev) => {
            if (!prev.itensDetalhados && !prev.quantidadeItens && !prev.validade) {
                return prev;
            }

            return validarFormulario(form, nextDetalhes);
        });
    }

    function adicionarRoupa() {
        if (!roupaParaAdicionar) {
            return;
        }

        const nextDetalhes = {
            ...detalhesDoacao,
            roupasSelecionadas: [...detalhesDoacao.roupasSelecionadas, roupaParaAdicionar]
        };

        setDetalhesDoacao(nextDetalhes);
        setRoupaParaAdicionar("");
        setErros((prev) => {
            if (!prev.itensDetalhados && !prev.quantidadeItens) {
                return prev;
            }

            return validarFormulario(form, nextDetalhes);
        });
    }

    function adicionarHigiene() {
        if (!higieneParaAdicionar) {
            return;
        }

        const nextDetalhes = {
            ...detalhesDoacao,
            higieneSelecionados: [...detalhesDoacao.higieneSelecionados, higieneParaAdicionar]
        };

        setDetalhesDoacao(nextDetalhes);
        setHigieneParaAdicionar("");
        setErros((prev) => {
            if (!prev.itensDetalhados && !prev.quantidadeItens) {
                return prev;
            }

            return validarFormulario(form, nextDetalhes);
        });
    }

    function removerAlimento(chave) {
        const nextDetalhes = {
            ...detalhesDoacao,
            alimentosSelecionados: detalhesDoacao.alimentosSelecionados.filter((item) => item !== chave),
            validadePorAlimento: {
                ...detalhesDoacao.validadePorAlimento,
                [chave]: ""
            },
            itens: {
                ...detalhesDoacao.itens,
                [chave]: ""
            }
        };

        setDetalhesDoacao(nextDetalhes);
        setErros((prev) => {
            if (!prev.itensDetalhados && !prev.quantidadeItens && !prev.validade) {
                return prev;
            }

            return validarFormulario(form, nextDetalhes);
        });
    }

    function removerRoupa(chave) {
        const nextDetalhes = {
            ...detalhesDoacao,
            roupasSelecionadas: detalhesDoacao.roupasSelecionadas.filter((item) => item !== chave),
            itens: {
                ...detalhesDoacao.itens,
                [chave]: ""
            }
        };

        setDetalhesDoacao(nextDetalhes);
        setErros((prev) => {
            if (!prev.itensDetalhados && !prev.quantidadeItens) {
                return prev;
            }

            return validarFormulario(form, nextDetalhes);
        });
    }

    function removerHigiene(chave) {
        const nextDetalhes = {
            ...detalhesDoacao,
            higieneSelecionados: detalhesDoacao.higieneSelecionados.filter((item) => item !== chave),
            itens: {
                ...detalhesDoacao.itens,
                [chave]: ""
            }
        };

        setDetalhesDoacao(nextDetalhes);
        setErros((prev) => {
            if (!prev.itensDetalhados && !prev.quantidadeItens) {
                return prev;
            }

            return validarFormulario(form, nextDetalhes);
        });
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
    const [detalhesDoacao, setDetalhesDoacao] = useState(criarDetalhesDoacaoVazios());
    const [alimentoParaAdicionar, setAlimentoParaAdicionar] = useState("");
    const [roupaParaAdicionar, setRoupaParaAdicionar] = useState("");
    const [higieneParaAdicionar, setHigieneParaAdicionar] = useState("");
    const [documento, setDocumento] = useState(null);
    const [nomeDocumento, setNomeDocumento] = useState("");
    const [erros, setErros] = useState({});
    const fieldRefs = useRef({});
    const navigate = useNavigate();
    const itensDetalhados = obterItensDetalhados(
        form.tipo,
        detalhesDoacao.categoriaRoupas,
        detalhesDoacao.alimentosSelecionados,
        detalhesDoacao.roupasSelecionadas,
        detalhesDoacao.higieneSelecionados
    );
    const alimentosDisponiveis = obterAlimentosDisponiveis(detalhesDoacao.alimentosSelecionados);
    const roupasDisponiveis = obterRoupasDisponiveis(detalhesDoacao.categoriaRoupas, detalhesDoacao.roupasSelecionadas);
    const higieneDisponiveis = obterHigieneDisponiveis(detalhesDoacao.higieneSelecionados);
    const quantidadeAutomatica = usaQuantidadeAutomatica(form.tipo);

    useEffect(() => {
        if (!quantidadeAutomatica) {
            return;
        }

        const quantidadeCalculada = String(calcularQuantidadeDetalhada(form.tipo, detalhesDoacao));
        setForm((prev) => {
            if (prev.quantidadeItens === quantidadeCalculada) {
                return prev;
            }

            return {
                ...prev,
                quantidadeItens: quantidadeCalculada
            };
        });
    }, [form.tipo, detalhesDoacao, quantidadeAutomatica]);

    useEffect(() => {
        if (form.tipo !== "Alimentos") {
            setAlimentoParaAdicionar("");
        }
    }, [form.tipo]);

    useEffect(() => {
        if (form.tipo !== "Roupas") {
            setRoupaParaAdicionar("");
        }
    }, [form.tipo]);

    useEffect(() => {
        if (form.tipo !== "Higiene") {
            setHigieneParaAdicionar("");
        }
    }, [form.tipo]);

    useEffect(() => {
        setDetalhesDoacao((prev) => {
            if (prev.categoriaRoupas !== "verao" && prev.categoriaRoupas !== "inverno") {
                if (prev.roupasSelecionadas.length === 0) {
                    return prev;
                }

                return {
                    ...prev,
                    roupasSelecionadas: []
                };
            }

            const roupasDaCategoria = prev.categoriaRoupas === "verao"
                ? ["chinelo", "shorts", "regata", "camiseta", "roupasDeBaixo", "bone"]
                : ["moletom", "calcas", "meias", "toucas"];
            const roupasSelecionadasValidas = prev.roupasSelecionadas.filter((chave) => roupasDaCategoria.includes(chave));

            if (roupasSelecionadasValidas.length === prev.roupasSelecionadas.length) {
                return prev;
            }

            return {
                ...prev,
                roupasSelecionadas: roupasSelecionadasValidas
            };
        });
        setRoupaParaAdicionar("");
    }, [detalhesDoacao.categoriaRoupas]);

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

                    {form.tipo === "Alimentos" && (
                        <Styled.Section data-error={Boolean(erros.validade) || Boolean(erros.itensDetalhados)}>
                            <Styled.SectionTitle>Adicionar alimentos</Styled.SectionTitle>
                            <Styled.ActionRow>
                                <select
                                    ref={(elemento) => {
                                        fieldRefs.current.itensDetalhados = elemento;
                                    }}
                                    value={alimentoParaAdicionar}
                                    onChange={(e) => setAlimentoParaAdicionar(e.target.value)}
                                >
                                    <option value="">Selecione um alimento</option>
                                    {alimentosDisponiveis.map((item) => (
                                        <option key={item.chave} value={item.chave}>
                                            {item.rotulo}
                                        </option>
                                    ))}
                                </select>
                                <Styled.SmallButton
                                    type="button"
                                    onClick={adicionarAlimento}
                                    disabled={!alimentoParaAdicionar}
                                >
                                    Adicionar
                                </Styled.SmallButton>
                            </Styled.ActionRow>

                            {itensDetalhados.length > 0 && (
                                <Styled.Grid>
                                    {itensDetalhados.map((item) => (
                                        <div key={item.chave}>
                                            <Styled.ItemHeader>
                                                <label htmlFor={item.chave}>{item.rotulo}:</label>
                                                <Styled.RemoveButton
                                                    type="button"
                                                    onClick={() => removerAlimento(item.chave)}
                                                >
                                                    Remover
                                                </Styled.RemoveButton>
                                            </Styled.ItemHeader>
                                            <input
                                                id={item.chave}
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={detalhesDoacao.itens[item.chave]}
                                                onChange={(e) => atualizarQuantidadeDetalhada(item.chave, e.target.value)}
                                                placeholder="0"
                                            />
                                            <label htmlFor={`${item.chave}-validade`}>Validade:</label>
                                            <input
                                                ref={(elemento) => {
                                                    if (!fieldRefs.current.validade) {
                                                        fieldRefs.current.validade = elemento;
                                                    }
                                                }}
                                                id={`${item.chave}-validade`}
                                                type="date"
                                                value={detalhesDoacao.validadePorAlimento[item.chave] || ""}
                                                onChange={(e) => atualizarValidadeAlimento(item.chave, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </Styled.Grid>
                            )}
                        </Styled.Section>
                    )}

                    {form.tipo === "Roupas" && (
                        <Styled.Section data-error={Boolean(erros.categoriaRoupas) || Boolean(erros.itensDetalhados)}>
                            <label htmlFor="categoriaRoupas">Categoria das roupas:</label>
                            <select
                                ref={(elemento) => {
                                    fieldRefs.current.categoriaRoupas = elemento;
                                }}
                                name="categoriaRoupas"
                                value={detalhesDoacao.categoriaRoupas}
                                onChange={atualizarDetalhes}
                            >
                                <option value="">Selecione</option>
                                <option value="verao">Roupas de verao</option>
                                <option value="inverno">Roupas de inverno</option>
                            </select>

                            {detalhesDoacao.categoriaRoupas && (
                                <>
                                    <Styled.SectionTitle>Adicionar roupas</Styled.SectionTitle>
                                    <Styled.ActionRow>
                                        <select
                                            ref={(elemento) => {
                                                fieldRefs.current.itensDetalhados = elemento;
                                            }}
                                            value={roupaParaAdicionar}
                                            onChange={(e) => setRoupaParaAdicionar(e.target.value)}
                                        >
                                            <option value="">Selecione uma roupa</option>
                                            {roupasDisponiveis.map((item) => (
                                                <option key={item.chave} value={item.chave}>
                                                    {item.rotulo}
                                                </option>
                                            ))}
                                        </select>
                                        <Styled.SmallButton
                                            type="button"
                                            onClick={adicionarRoupa}
                                            disabled={!roupaParaAdicionar}
                                        >
                                            Adicionar
                                        </Styled.SmallButton>
                                    </Styled.ActionRow>
                                </>
                            )}

                            {itensDetalhados.length > 0 && (
                                <>
                                    <Styled.SectionTitle>Itens da doacao</Styled.SectionTitle>
                                    <Styled.Grid>
                                        {itensDetalhados.map((item, index) => (
                                            <div key={item.chave}>
                                                <Styled.ItemHeader>
                                                    <label htmlFor={item.chave}>{item.rotulo}:</label>
                                                    <Styled.RemoveButton
                                                        type="button"
                                                        onClick={() => removerRoupa(item.chave)}
                                                    >
                                                        Remover
                                                    </Styled.RemoveButton>
                                                </Styled.ItemHeader>
                                                <input
                                                    ref={(elemento) => {
                                                        if (index === 0) {
                                                            fieldRefs.current.itensDetalhados = elemento;
                                                        }
                                                    }}
                                                    id={item.chave}
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={detalhesDoacao.itens[item.chave]}
                                                    onChange={(e) => atualizarQuantidadeDetalhada(item.chave, e.target.value)}
                                                    placeholder="0"
                                                />
                                            </div>
                                        ))}
                                    </Styled.Grid>
                                </>
                            )}
                        </Styled.Section>
                    )}

                    {form.tipo === "Higiene" && (
                        <Styled.Section data-error={Boolean(erros.itensDetalhados)}>
                            <Styled.SectionTitle>Adicionar itens de higiene</Styled.SectionTitle>
                            <Styled.ActionRow>
                                <select
                                    ref={(elemento) => {
                                        fieldRefs.current.itensDetalhados = elemento;
                                    }}
                                    value={higieneParaAdicionar}
                                    onChange={(e) => setHigieneParaAdicionar(e.target.value)}
                                >
                                    <option value="">Selecione um item</option>
                                    {higieneDisponiveis.map((item) => (
                                        <option key={item.chave} value={item.chave}>
                                            {item.rotulo}
                                        </option>
                                    ))}
                                </select>
                                <Styled.SmallButton
                                    type="button"
                                    onClick={adicionarHigiene}
                                    disabled={!higieneParaAdicionar}
                                >
                                    Adicionar
                                </Styled.SmallButton>
                            </Styled.ActionRow>

                            {itensDetalhados.length > 0 && (
                                <>
                                    <Styled.SectionTitle>Itens de higiene</Styled.SectionTitle>
                                    <Styled.Grid>
                                        {itensDetalhados.map((item, index) => (
                                            <div key={item.chave}>
                                                <Styled.ItemHeader>
                                                    <label htmlFor={item.chave}>{item.rotulo}:</label>
                                                    <Styled.RemoveButton
                                                        type="button"
                                                        onClick={() => removerHigiene(item.chave)}
                                                    >
                                                        Remover
                                                    </Styled.RemoveButton>
                                                </Styled.ItemHeader>
                                                <input
                                                    ref={(elemento) => {
                                                        if (index === 0) {
                                                            fieldRefs.current.itensDetalhados = elemento;
                                                        }
                                                    }}
                                                    id={item.chave}
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={detalhesDoacao.itens[item.chave]}
                                                    onChange={(e) => atualizarQuantidadeDetalhada(item.chave, e.target.value)}
                                                    placeholder="0"
                                                />
                                            </div>
                                        ))}
                                    </Styled.Grid>
                                </>
                            )}
                        </Styled.Section>
                    )}

                    {form.tipo === "Financeira" && (
                        <Styled.Section data-error={Boolean(erros.valorFinanceiro)}>
                            <label htmlFor="valorFinanceiro">Valor da doacao (R$):</label>
                            <input
                                ref={(elemento) => {
                                    fieldRefs.current.valorFinanceiro = elemento;
                                }}
                                id="valorFinanceiro"
                                type="number"
                                min="0"
                                step="0.01"
                                name="valorFinanceiro"
                                value={detalhesDoacao.valorFinanceiro}
                                onChange={atualizarDetalhes}
                                placeholder="0.00"
                            />
                        </Styled.Section>
                    )}

                    {form.tipo === "Materiais" && (
                        <Styled.Section data-error={Boolean(erros.materialDescricao)}>
                            <label htmlFor="materialDescricao">Qual e o material diverso?</label>
                            <input
                                ref={(elemento) => {
                                    fieldRefs.current.materialDescricao = elemento;
                                }}
                                id="materialDescricao"
                                name="materialDescricao"
                                value={detalhesDoacao.materialDescricao}
                                onChange={atualizarDetalhes}
                                placeholder="Ex.: cobertor, brinquedo, livro, utensilio..."
                            />
                        </Styled.Section>
                    )}

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

                    {form.tipo !== "Financeira" && (
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
                                placeholder={quantidadeAutomatica ? "Calculada automaticamente" : "Informe a quantidade"}
                                readOnly={quantidadeAutomatica}
                            />
                            {quantidadeAutomatica && (
                                <Styled.HelperText>
                                    A quantidade total e somada automaticamente a partir dos itens acima.
                                </Styled.HelperText>
                            )}
                        </div>
                    )}

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
