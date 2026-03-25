import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatarTelefone, limparTelefone } from "../../../../utils/telefone";

function EditarBeneficiarioView() {
    function fetchBeneficiario(id){
        return fetch(`http://localhost:3000/beneficiarios/buscar?id=${id}`, {
            method: "GET"
        })
        .then((response) =>  response.json())
        .catch((error) => alert(error));
    }

    async function fetchAlterarBeneficiario(){
        try {
            await fetch("http://localhost:3000/beneficiarios/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id,
                    nome: form.nome,
                    endereco: form.endereco,
                    telefone: limparTelefone(form.telefone),
                    usuario: form.usuario,
                    senha: form.senha
                })
            });
            setFormOriginal(form);
        } catch (error) {
            alert("Erro ao atualizar");
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
            [name]: name === "telefone" ? formatarTelefone(value) : value
        }));
    }
    const navigate = useNavigate();
    const {id} = useParams();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [form, setForm] = useState({
        id:0,
        nome: "",
        endereco: "",
        telefone: "",
        usuario: "",
        senha: ""
    });
    const [formOriginal, setFormOriginal] = useState({
        id:0,
        nome: "",
        endereco: "",
        telefone: "",
        usuario: "",
        senha: ""
    });
    const [editado, setEditado] = useState(false);

    useEffect(() => {
        async function carregar(){
            const data = await fetchBeneficiario(id);
            if (!data) {
                return;
            }
            const beneficiario = {
                ...data,
                telefone: formatarTelefone(data.telefone)
            };
            setForm(beneficiario)
            setFormOriginal(beneficiario);
        }
        carregar();
    }, []);

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
                    <Link to={'/tabelas/beneficiarios'}>
                        <div>
                            Voltar
                        </div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form>
                    <div>
                        <label htmlFor="nome">Nome: </label>
                        <input
                            name="nome"
                            value={form.nome}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div>
                        <label htmlFor="endereco">Endereco: </label>
                        <input
                            name="endereco"
                            value={form.endereco}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div>
                        <label htmlFor="telefone">Telefone: </label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            name="telefone"
                            value={form.telefone}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div>
                        <label htmlFor="usuario">Usuario: </label>
                        <input
                            name="usuario"
                            value={form.usuario}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div>
                        <label htmlFor="senha">Senha: </label>
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            name="senha"
                            value={form.senha}
                            onChange={atualizarForm}
                            disabled={!mostrarSenha}
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
