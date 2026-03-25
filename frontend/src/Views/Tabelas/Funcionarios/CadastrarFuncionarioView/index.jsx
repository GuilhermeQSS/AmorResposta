import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";




function CadastrarFuncionarioView() {

    async function fetchCadastrarFuncionario(){
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
    const [camposVazios,setCamposVazios] = useState({});
    const [form, setForm] = useState({
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
                                type="password"
                                name="senha"
                                value={form.senha}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.senha ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="cargo">Cargo:</label>
                            <select
                                name="cargo"
                                value={form.cargo}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.cargo ? "2px solid red" : "" }}
                            >
                                <option value="" disabled>Selecione</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Voluntario">Voluntário</option>
                            </select>
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