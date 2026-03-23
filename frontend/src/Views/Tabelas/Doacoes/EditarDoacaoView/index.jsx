import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditarDoacaoView() {
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

    function normalizarDoacaoRecebida(dados) {
        return {
            id: dados?.id ?? 0,
            doadorNome: dados?.doadorNome || "anonimo",
            dataEntrega: dados?.dataEntrega ? String(dados.dataEntrega).slice(0, 10) : "",
            origem: dados?.origem || "",
            formaEntrega: dados?.formaEntrega || "",
            tipo: dados?.tipo || "",
            quantidadeItens: dados?.quantidadeItens ? String(dados.quantidadeItens) : "",
            observacao: dados?.observacao || ""
        };
    }

    function prepararPayload(dados) {
        return {
            ...dados,
            doadorNome: dados.doadorNome.trim() || "anonimo",
            quantidadeItens: Number(dados.quantidadeItens)
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
        const novosErros = validarFormulario(form);
        setErros(novosErros);

        if (Object.keys(novosErros).length > 0) {
            const primeiroCampoComErro = Object.keys(novosErros)[0];
            fieldRefs.current[primeiroCampoComErro]?.focus();
            return;
        }

        try {
            const payload = prepararPayload(form);
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

            setForm({
                ...payload,
                quantidadeItens: String(payload.quantidadeItens)
            });
            setFormOriginal({
                ...payload,
                quantidadeItens: String(payload.quantidadeItens)
            });
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
    const [erros, setErros] = useState({});
    const [editado, setEditado] = useState(false);
    const fieldRefs = useRef({});

    useEffect(() => {
        async function carregar() {
            const data = await fetchDoacao(id);
            const doacaoNormalizada = normalizarDoacaoRecebida(data);
            setForm(doacaoNormalizada);
            setFormOriginal(doacaoNormalizada);
        }

        carregar();
    }, [id]);

    useEffect(() => {
        setEditado(JSON.stringify(form) !== JSON.stringify(formOriginal));
    }, [form, formOriginal]);

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
