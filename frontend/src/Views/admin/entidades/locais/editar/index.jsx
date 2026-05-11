import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function AdminEntidadesLocaisEditar() {
    const [camposVazios, setCamposVazios] = useState({});
    const { id } = useParams();
    const [form, setForm] = useState({
        nome: ""
    });
    const [formOriginal, setFormOriginal] = useState({
        nome: ""
    });
    const [editado, setEditado] = useState(false);
    const navigate = useNavigate();

    async function fetchLocal(id) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/locais/buscar?id=${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return null;
            }

            return await response.json();
        } catch (err) {
            alert("Erro ao conectar com o servidor: " + err.message);
            return null;
        }
    }

    async function fetchAlterarLocal() {
        const token = localStorage.getItem("token");
        const vazios = {
            nome: !form.nome
        };
        setCamposVazios(vazios);
        if (Object.values(vazios).includes(true)) {
            alert("Preencha todos os campos!");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/locais/alterar", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    nome: form.nome
                })
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return;
            }

            if (response.ok) {
                setFormOriginal(form);
                alert("Atualizado com sucesso!");
            } else {
                const json = await response.json();
                alert(json.err || "Erro desconhecido no servidor");
            }
        } catch (err) {
            alert("Erro ao atualizar: " + err.message);
        }
    }

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        async function carregar() {
            const data = await fetchLocal(id);
            if (!data) return;
            setForm(data);
            setFormOriginal(data);
        }
        carregar();
    }, [id]);

    useEffect(() => {
        setEditado(JSON.stringify(form) !== JSON.stringify(formOriginal));
    }, [form, formOriginal]);

    return (
        <>
            <Header perfil="admin" />
            <main>
                <Styled.BackBtn>
                    <Link to="/admin/entidades/locais/tabela">
                        <div>Voltar</div>
                    </Link>
                </Styled.BackBtn>
                <h1>Editar Local</h1>
                <Styled.Form>
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
                        disabled={!editado}
                        onClick={fetchAlterarLocal}
                    >
                        Salvar alterações
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default AdminEntidadesLocaisEditar;