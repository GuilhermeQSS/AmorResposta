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
        const camposVazios = {
            nome: !form.nome,
            usuario: !form.usuario,
            senha: !form.senha,
            cargo: !form.cargo
        };
        setCamposVazios(camposVazios);
        if (Object.values(camposVazios).includes(true)) {
            alert("Preencha todos os campos!");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/funcionarios/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
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
                alert(json.err || 'Erro desconhecido no servidor');
            }
        } catch (err) {
            alert("Erro ao atualizar");
        }
    }

    async function fetchExcluirFuncionario(){
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if(!confirmar) return;

        try {
            await fetch(`http://localhost:3000/funcionarios/excluir?id=${id}`, {
                method: "DELETE"
            });
            navigate("/tabelas/funcionarios");
        } catch (err) {
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
    const [camposVazios,setCamposVazios] = useState({});
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();
    const [form, setForm] = useState({
        nome: "",
        usuario: "",
        senha: "",
        cargo: ""
    });
    const [formOriginal, setFormOriginal] = useState({
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
        setEditado(JSON.stringify(form) !== JSON.stringify(formOriginal));
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
                                style={{ border: camposVazios.nome ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="usuario">Usuário: </label>
                            <input
                                name="usuario"
                                value={form.usuario}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.usuario ? "2px solid red" : "" }}
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
                                style={{ border: camposVazios.senha ? "2px solid red" : "" }}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                            >
                                {mostrarSenha ? "Ocultar" : "Ver senha"}
                            </button>
                        </div>

                        <div>
                            <label htmlFor="cargo">Cargo:</label>
                            <select
                                name="cargo"
                                value={form.cargo}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.cargo ? "2px solid red" : "" }}
                            >
                                <option value="Administrador">Administrador</option>
                                <option value="Voluntario">Voluntário</option>
                            </select>
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