import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";




function CadastrarFuncionarioView() {

    async function fetchCadastrarFuncionario(){
        try {
            const response = await fetch("http://localhost:3000/funcionarios/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: form.nome,
                    usuario: form.usuario,
                    senha: form.senha,
                    cargo: form.cargo
                })
            });
            if(response.ok){
                navigate("/tabelas/funcionarios");
            }else{
                const json = await response.json(); 
                setErros(json.campos || {});
                alert(json.err || 'Erro desconhecido no servidor');
            }
        } catch (error) {
            alert("Erro ao atualizar");
        }
    }

    function atualizarForm(e){
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const [isValidated,setIsValidated] = useState(false);
    const [erros,setErros] = useState({});
    const [form, setForm] = useState({
        id:0,
        nome: "",
        usuario: "",
        senha: "",
        cargo: ""
    });
    const navigate = useNavigate();

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
                <Styled.Form noValidate>
                        <div>
                            <label htmlFor="nome">Nome: </label>
                            <input
                                name="nome"
                                value={form.nome}
                                onChange={atualizarForm}
                                style={{ border: erros.fun_nome ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="usuario">Usuário: </label>
                            <input
                                name="usuario"
                                value={form.usuario}
                                onChange={atualizarForm}
                                style={{ border: erros.fun_usuario ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="senha">Senha: </label>
                            <input
                                type="password"
                                name="senha"
                                value={form.senha}
                                onChange={atualizarForm}
                                style={{ border: erros.fun_senha ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="cargo">Cargo: </label>
                            <input
                                name="cargo"
                                value={form.cargo}
                                onChange={atualizarForm}
                                style={{ border: erros.fun_cargo ? "2px solid red" : "" }}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={fetchCadastrarFuncionario}
                        >
                            Cadastrar
                        </button>
                </Styled.Form>
            </main>
            <Footer/>
        </>
    );
}

export default CadastrarFuncionarioView;