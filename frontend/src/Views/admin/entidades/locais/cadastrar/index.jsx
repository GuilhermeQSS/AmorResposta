import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import Styled from "./styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminEntidadesLocaisCadastrar() {
    const [camposVazios, setCamposVazios] = useState({});
    const [form, setForm] = useState({
        nome: ""
    });
    const navigate = useNavigate();

    async function fetchCadastrarLocal() {
        const token = localStorage.getItem("token");
        let vazios = {
            nome: !form.nome
        };
        setCamposVazios(vazios);
        if (Object.values(vazios).includes(true)) return;

        try {
            const response = await fetch("http://localhost:3000/api/locais/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome: form.nome
                })
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return;
            }

            if (response.ok) {
                navigate("/admin/entidades/locais/tabela");
            } else {
                const json = await response.json();
                alert(json.err || "Erro desconhecido no servidor");
            }
        } catch (err) {
            alert("Erro ao gravar no banco: " + err.message);
        }
    }

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <>
            <Header perfil="admin" />
            <main>
                <Styled.BackBtn>
                    <Link to="/admin/entidades/locais/tabela">
                        <div>Voltar</div>
                    </Link>
                </Styled.BackBtn>
                <h1>Cadastrar Local</h1>
                <Styled.Form noValidate>
                    <div>
                        <label htmlFor="nome">Nome do Local: </label>
                        <input
                            name="nome"
                            value={form.nome}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.nome ? "2px solid red" : "" }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={fetchCadastrarLocal}
                    >
                        Cadastrar
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default AdminEntidadesLocaisCadastrar;