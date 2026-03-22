import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
                    telefone: form.telefone,
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
            [name]: value
        }));
    }
    const navigate = useNavigate();
    const {id} = useParams();
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
            setForm(data)
            setFormOriginal(data);
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
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={atualizarForm}
                        />
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
