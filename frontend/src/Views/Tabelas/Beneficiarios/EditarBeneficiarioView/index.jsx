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

    function validarFormulario() {
        return Object.entries(form)
            .filter(([campo, valor]) => campo !== "id" && !`${valor}`.trim())
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
            endereco: form.endereco.trim(),
            telefone: form.telefone.trim(),
            usuario: form.usuario.trim(),
            senha: form.senha.trim(),
            camposAlterados: {
                nome: form.nome !== formOriginal.nome,
                endereco: form.endereco !== formOriginal.endereco,
                telefone: form.telefone !== formOriginal.telefone,
                usuario: form.usuario !== formOriginal.usuario,
                senha: form.senha !== formOriginal.senha
            }
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

            setForm(payload);
            setFormOriginal({
                id: payload.id,
                nome: payload.nome,
                endereco: payload.endereco,
                telefone: payload.telefone,
                usuario: payload.usuario,
                senha: payload.senha
            });
            setErros({});
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
            [name]: value
        }));
    }

    const [erros,setErros] = useState({});
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
            setErros({});
            setForm(data)
            setFormOriginal(data);
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
                            id="nome"
                            name="nome"
                            value={form.nome}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_nome ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="endereco">Endereco: </label>
                        <input
                            id="endereco"
                            name="endereco"
                            value={form.endereco}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_endereco ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="telefone">Telefone: </label>
                        <input
                            id="telefone"
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
                            type="password"
                            id="senha"
                            name="senha"
                            value={form.senha}
                            onChange={atualizarForm}
                            style={{ border: erros.ben_senha ? "2px solid red" : "" }}
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
