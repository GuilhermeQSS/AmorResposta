import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Styled from "./styles";
import {useState} from "react";
import { Link, useNavigate } from "react-router-dom";


function LoginView() {

        async function fetchLogar(){
            let camposVazios = {
                usuario: !form.usuario,
                senha: !form.senha,
                confirmarSenha: !form.confirmarSenha,
                perfil: !form.perfil
            };
            setCamposVazios(camposVazios);
            if (Object.values(camposVazios).includes(true)) return;
            if(form.confirmarSenha !== form.senha){
                camposVazios = {
                    senha: true,
                    confirmarSenha: true
                }
            }
            setCamposVazios(camposVazios);
            if (Object.values(camposVazios).includes(true)) return;
            try {
                const response = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usuario: form.usuario,
                        senha: form.senha,
                        perfil: form.perfil
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("auth", data.auth);
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    navigate("/");
                } else {
                    alert(data.message || data.err || 'Erro desconhecido no servidor');
                }
            } catch (err) {
                alert(`Erro ao logar: ${err.message}`);
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
            usuario: "",
            senha: "",
            confirmarSenha:"",
            perfil: ""
        });
        const navigate = useNavigate();
    
    return(
        <>
            <Header/>
            <main>
                <Styled.Form noValidate>
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
                            <label htmlFor="confirmaSenha">Confirmar senha: </label>
                            <input
                                type="password"
                                name="confirmarSenha"
                                value={form.confirmarSenha}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.confirmarSenha ? "2px solid red" : "" }}
                            />
                        </div>

                        <div>
                            <label htmlFor="perfil">Perfil:</label>
                            <select
                                name="perfil"
                                value={form.perfil}
                                onChange={atualizarForm}
                                style={{ border: camposVazios.perfil ? "2px solid red" : "" }}
                            >
                                <option value="" selected disabled>Selecione</option>
                                <option value="Beneficiario">Beneficiario</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Voluntario">Voluntário</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={fetchLogar}
                        >
                            Login
                        </button>
                </Styled.Form>
            </main>
            <Footer/>
        </>
    );
}

export default LoginView;