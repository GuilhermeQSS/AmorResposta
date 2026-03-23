import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";




function EditarFuncionarioView() {
    function fetchFuncionario(id){
        return fetch(`http://localhost:3000/funcionarios/buscar?id=${id}`, {
            method: "GET"
        })
        .then((response) =>  response.json())
        .catch((error) => alert(error));
    }

    async function fetchAlterarFuncionario(){
        try {
            const response = await fetch("http://localhost:3000/funcionarios/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id,
                    nome: form.nome,
                    usuario: form.usuario,
                    senha: form.senha,
                    cargo: form.cargo
                })
            });
            if(response.ok){
                setFormOriginal(form);
            }else{
                const json = await response.json(); 
                setErros(json.campos || {});
                alert(json.err || 'Erro desconhecido no servidor');
            }
        } catch (error) {
            alert("Erro ao atualizar");
        }
    }

    async function fetchExcluirFuncionario(){
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if(!confirmar) return;

        try {
            await fetch("http://localhost:3000/funcionarios/excluir", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id
                })
            });
            navigate("/tabelas/funcionarios");
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
    function isAlterado(){
        return JSON.stringify(form) !== JSON.stringify(formOriginal);
    }
    const [erros,setErros] = useState({});
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();
    const [form, setForm] = useState({
        id:0,
        nome: "",
        usuario: "",
        senha: "",
        cargo: ""
    });
    const [formOriginal, setFormOriginal] = useState({
        id:0,
        nome: "",
        usuario: "",
        senha: "",
        cargo: ""
    });
    const [editado, setEditado] = useState(false);

    useEffect(() => {
        async function carregar(){
            const data = await fetchFuncionario(id);
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
                    <Link to={'/tabelas/funcionarios'}>
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
                            <label htmlFor="usuario">Usuário: </label>
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

                        <div>
                            <label htmlFor="cargo">Cargo: </label>
                            <input
                                name="cargo"
                                value={form.cargo}
                                onChange={atualizarForm}
                            />
                        </div>

                        <button
                            type="button" 
                            disabled={!editado}
                            onClick={fetchAlterarFuncionario}
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            onClick={fetchExcluirFuncionario}
                        >
                            Excluir
                        </button>
                </Styled.Form>
            </main>
            <Footer/>
        </>
    );
}

export default EditarFuncionarioView;