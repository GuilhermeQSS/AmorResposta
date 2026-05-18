import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatarTelefone, limparTelefone } from "../../../../utils/telefone";
import { limparNumeros } from "../../../../utils/numeros";

function EditarBeneficiarioView() {
    function fetchBeneficiario(id){
        return fetch(`http://localhost:3000/beneficiarios/buscar?id=${id}`, {
            method: "GET"
        })
        .then((response) => response.json())
        .catch((error) => alert(error));
    }

    function montarEnderecoResumo(dados) {
        return [dados.rua, dados.numero, dados.bairro, dados.cidade, dados.estado]
            .map((item) => String(item || "").trim())
            .filter(Boolean)
            .join(", ");
    }

    function normalizarBeneficiario(data) {
        if (!data) {
            return data;
        }

        return {
            ...data,
            estado: String(data.estado ?? "").trim(),
            cidade: String(data.cidade ?? "").trim(),
            bairro: String(data.bairro ?? "").trim(),
            rua: String(data.rua ?? data.endereco ?? "").trim(),
            numero: String(data.numero ?? "").replace(/\D/g, ""),
            telefone: formatarTelefone(data.telefone),
            endereco: String(data.endereco ?? "").trim() || montarEnderecoResumo(data)
        };
    }

    function validarFormulario() {
        return Object.entries(form)
            .filter(([campo, valor]) => {
                if (campo === "id") {
                    return false;
                }
                if (campo === "numero") {
                    return !limparNumeros(valor);
                }
                if (campo === "telefone") {
                    return !limparTelefone(valor);
                }
                return !`${valor}`.trim();
            })
            .map(([campo]) => campo);
    }

    async function fetchAlterarBeneficiario(){
        const camposInvalidos = validarFormulario();
        if (camposInvalidos.length > 0) {
            alert("Preencha todos os campos antes de editar.");
            return;
        }

        const payload = {
            id: form.id,
            nome: form.nome.trim(),
            estado: form.estado.trim(),
            cidade: form.cidade.trim(),
            bairro: form.bairro.trim(),
            rua: form.rua.trim(),
            numero: limparNumeros(form.numero),
            telefone: limparTelefone(form.telefone),
            usuario: form.usuario.trim(),
            senha: form.senha.trim(),
            endereco: montarEnderecoResumo(form)
        };

        try {
            const response = await fetch("http://localhost:3000/beneficiarios/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const json = await response.json();
                setErros(json.campos || {});
                throw new Error(json.err || json.erro || json.Erro || "Nao foi possivel alterar o beneficiario");
            }

            const beneficiarioAtualizado = normalizarBeneficiario(payload);
            setForm(beneficiarioAtualizado);
            setFormOriginal(beneficiarioAtualizado);
            setErros({});
            alert("Beneficiario atualizado com sucesso");
        } catch (error) {
            alert(error.message || "Erro ao atualizar");
        }
    }

    async function fetchExcluirBeneficiario(){
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if(!confirmar) return;

        try {
            await fetch("http://localhost:3000/beneficiarios/excluir", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id
                })
            });
            navigate("/tabelas/beneficiarios");
        } catch (error) {
            alert("Erro ao excluir");
        }
    }

    function atualizarForm(e){
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "telefone"
                ? formatarTelefone(value)
                : name === "numero"
                    ? limparNumeros(value)
                    : value
        }));
    }

    const navigate = useNavigate();
    const {id} = useParams();
    const [erros,setErros] = useState({});
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [form, setForm] = useState({
        id:0,
        nome: "",
        estado: "",
        cidade: "",
        bairro: "",
        rua: "",
        numero: "",
        telefone: "",
        usuario: "",
        senha: "",
        endereco: ""
    });
    const [formOriginal, setFormOriginal] = useState({
        id:0,
        nome: "",
        estado: "",
        cidade: "",
        bairro: "",
        rua: "",
        numero: "",
        telefone: "",
        usuario: "",
        senha: "",
        endereco: ""
    });
    const [editado, setEditado] = useState(false);

    useEffect(() => {
        async function carregar(){
            const data = await fetchBeneficiario(id);
            if (!data) {
                return;
            }

            const beneficiario = normalizarBeneficiario(data);
            setErros({});
            setMostrarSenha(false);
            setForm(beneficiario);
            setFormOriginal(beneficiario);
        }
        carregar();
    }, [id]);

    useEffect(() => {
        if (JSON.stringify(form) !== JSON.stringify(formOriginal)) {
            setEditado(true);
        } else {
            setEditado(false);
        }
    }, [form, formOriginal]);

    return (
        <>
            <Header/>
            <main>
                <Styled.BackBtn>
                    <Link to={"/tabelas/beneficiarios"}>
                        <div>
                            Voltar
                        </div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form noValidate>
                    <div>
                        <label htmlFor="nome">Nome: </label>
                        <input
                            id="nome"
                            name="nome"
                            value={form.nome}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_nome ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="estado">Estado: </label>
                        <input
                            id="estado"
                            name="estado"
                            value={form.estado}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_estado ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="cidade">Cidade: </label>
                        <input
                            id="cidade"
                            name="cidade"
                            value={form.cidade}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_cidade ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="bairro">Bairro: </label>
                        <input
                            id="bairro"
                            name="bairro"
                            value={form.bairro}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_bairro ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="rua">Rua: </label>
                        <input
                            id="rua"
                            name="rua"
                            value={form.rua}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_rua ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="numero">Numero: </label>
                        <input
                            id="numero"
                            name="numero"
                            value={form.numero}
                            onChange={atualizarForm}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            style={{ border: erros.ben_numero ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="telefone">Telefone: </label>
                        <input
                            id="telefone"
                            type="tel"
                            inputMode="numeric"
                            name="telefone"
                            value={form.telefone}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_telefone ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="usuario">Usuario: </label>
                        <input
                            id="usuario"
                            name="usuario"
                            value={form.usuario}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_usuario ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="senha">Senha: </label>
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            id="senha"
                            name="senha"
                            value={form.senha}
                            onChange={atualizarForm}
                            disabled={!mostrarSenha}
                            style={{ border: erros.ben_senha ? "2px solid red" : "" }}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                            {mostrarSenha ? "Ocultar" : "Ver senha"}
                        </button>
                    </div>

                    <button
                        type="button" 
                        disabled={!editado}
                        onClick={fetchAlterarBeneficiario}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={fetchExcluirBeneficiario}
                    >
                        Excluir
                    </button>
                </Styled.Form>
            </main>
            <Footer/>
        </>
    );
}

export default EditarBeneficiarioView;
