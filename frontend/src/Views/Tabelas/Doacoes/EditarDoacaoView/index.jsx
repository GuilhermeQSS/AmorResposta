import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    calcularQuantidadeDetalhada,
    criarDetalhesDoacaoVazios,
    montarDetalhesPayload,
    normalizarDetalhesDoacao,
    obterAlimentosDisponiveis,
    obterItensDetalhados,
    usaQuantidadeAutomatica
} from "../detalhesDoacao";

function EditarDoacaoView() {
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
            if (!detalhes.validade) {
                novosErros.validade = "Informe a validade dos alimentos.";
            }

            if (calcularQuantidadeDetalhada(dados.tipo, detalhes) <= 0) {
                novosErros.itensDetalhados = "Informe ao menos uma quantidade para os alimentos.";
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

        if (dados.tipo === "Financeira") {
            const valorFinanceiro = Number(detalhes.valorFinanceiro);
            if (!Number.isFinite(valorFinanceiro) || valorFinanceiro <= 0) {
                novosErros.valorFinanceiro = "Informe um valor valido para a doacao.";
            }
        }

        return novosErros;
    }

    function normalizarDoacaoRecebida(dados) {
        return {
            id: dados?.id ?? 0,
            doadorNome: dados?.doadorNome || "anonimo",
            dataEntrega: dados?.dataEntrega ? String(dados.dataEntrega).slice(0, 10) : "",
            origem: dados?.origem || "",
            formaEntrega: dados?.formaEntrega || "",
            tipo: dados?.tipo || "",
            quantidadeItens: dados?.quantidadeItens ? String(dados.quantidadeItens) : "",
            observacao: dados?.observacao || "",
            detalhes: normalizarDetalhesDoacao(dados?.detalhes)
        };
    }

    function prepararPayload(dados, detalhes) {
        return {
            ...dados,
            doadorNome: dados.doadorNome.trim() || "anonimo",
            quantidadeItens: Number(dados.quantidadeItens),
            detalhes: montarDetalhesPayload(dados.tipo, detalhes)
        };
    }

    function fetchDoacao(idDoacao) {
        return fetch(`http://localhost:3000/doacoes/buscar?id=${idDoacao}`, {
            method: "GET"
        })
            .then((response) => response.json())
            .catch((error) => alert(error));
    }

    async function fetchAlterarDoacao() {
        const novosErros = validarFormulario(form, detalhesDoacao);
        setErros(novosErros);

        if (Object.keys(novosErros).length > 0) {
            const primeiroCampoComErro = Object.keys(novosErros)[0];
            fieldRefs.current[primeiroCampoComErro]?.focus();
            return;
        }

        try {
            const payload = prepararPayload(form, detalhesDoacao);
            const response = await fetch("http://localhost:3000/doacoes/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.erro || "Erro ao atualizar");
            }

            const proximoForm = {
                ...payload,
                quantidadeItens: String(payload.quantidadeItens)
            };

            setForm(proximoForm);
            setFormOriginal(proximoForm);
            setDetalhesOriginal(detalhesDoacao);
        } catch (error) {
            alert(error.message);
        }
    }

    async function fetchExcluirDoacao() {
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if (!confirmar) return;

        try {
            const response = await fetch("http://localhost:3000/doacoes/excluir", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id
                })
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir");
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
            if (!prev.itensDetalhados && !prev.quantidadeItens) {
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
            alimentosSelecionados: [...detalhesDoacao.alimentosSelecionados, alimentoParaAdicionar]
        };

        setDetalhesDoacao(nextDetalhes);
        setAlimentoParaAdicionar("");
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

    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        id: 0,
        doadorNome: "",
        dataEntrega: "",
        origem: "",
        formaEntrega: "",
        tipo: "",
        quantidadeItens: "",
        observacao: ""
    });
    const [formOriginal, setFormOriginal] = useState({
        id: 0,
        doadorNome: "",
        dataEntrega: "",
        origem: "",
        formaEntrega: "",
        tipo: "",
        quantidadeItens: "",
        observacao: ""
    });
    const [detalhesDoacao, setDetalhesDoacao] = useState(criarDetalhesDoacaoVazios());
    const [detalhesOriginal, setDetalhesOriginal] = useState(criarDetalhesDoacaoVazios());
    const [alimentoParaAdicionar, setAlimentoParaAdicionar] = useState("");
    const [erros, setErros] = useState({});
    const [editado, setEditado] = useState(false);
    const fieldRefs = useRef({});
    const itensDetalhados = obterItensDetalhados(form.tipo, detalhesDoacao.categoriaRoupas, detalhesDoacao.alimentosSelecionados);
    const alimentosDisponiveis = obterAlimentosDisponiveis(detalhesDoacao.alimentosSelecionados);
    const quantidadeAutomatica = usaQuantidadeAutomatica(form.tipo);

    useEffect(() => {
        async function carregar() {
            const data = await fetchDoacao(id);
            const doacaoNormalizada = normalizarDoacaoRecebida(data);
            setForm({
                id: doacaoNormalizada.id,
                doadorNome: doacaoNormalizada.doadorNome,
                dataEntrega: doacaoNormalizada.dataEntrega,
                origem: doacaoNormalizada.origem,
                formaEntrega: doacaoNormalizada.formaEntrega,
                tipo: doacaoNormalizada.tipo,
                quantidadeItens: doacaoNormalizada.quantidadeItens,
                observacao: doacaoNormalizada.observacao
            });
            setFormOriginal({
                id: doacaoNormalizada.id,
                doadorNome: doacaoNormalizada.doadorNome,
                dataEntrega: doacaoNormalizada.dataEntrega,
                origem: doacaoNormalizada.origem,
                formaEntrega: doacaoNormalizada.formaEntrega,
                tipo: doacaoNormalizada.tipo,
                quantidadeItens: doacaoNormalizada.quantidadeItens,
                observacao: doacaoNormalizada.observacao
            });
            setDetalhesDoacao(doacaoNormalizada.detalhes);
            setDetalhesOriginal(doacaoNormalizada.detalhes);
        }

        carregar();
    }, [id]);

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
        setEditado(
            JSON.stringify(form) !== JSON.stringify(formOriginal) ||
            JSON.stringify(detalhesDoacao) !== JSON.stringify(detalhesOriginal)
        );
    }, [form, formOriginal, detalhesDoacao, detalhesOriginal]);

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
                            <label htmlFor="validade">Validade:</label>
                            <input
                                ref={(elemento) => {
                                    fieldRefs.current.validade = elemento;
                                }}
                                type="date"
                                name="validade"
                                value={detalhesDoacao.validade}
                                onChange={atualizarDetalhes}
                            />
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

                            {itensDetalhados.length > 0 && (
                                <>
                                    <Styled.SectionTitle>Itens da doacao</Styled.SectionTitle>
                                    <Styled.Grid>
                                        {itensDetalhados.map((item, index) => (
                                            <div key={item.chave}>
                                                <label htmlFor={item.chave}>{item.rotulo}:</label>
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
                            <Styled.SectionTitle>Itens de higiene</Styled.SectionTitle>
                            <Styled.Grid>
                                {itensDetalhados.map((item, index) => (
                                    <div key={item.chave}>
                                        <label htmlFor={item.chave}>{item.rotulo}:</label>
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

                    <div data-error={Boolean(erros.origem)}>
                        <label htmlFor="origem">Origem:</label>
                        <input
                            ref={(elemento) => {
                                fieldRefs.current.origem = elemento;
                            }}
                            name="origem"
                            value={form.origem}
                            onChange={atualizarForm}
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
                        />
                    </div>

                    <button
                        type="button"
                        disabled={!editado}
                        onClick={fetchAlterarDoacao}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={fetchExcluirDoacao}
                    >
                        Excluir
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default EditarDoacaoView;
