import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import Styled from "./styles";
import iconEditar from "../../../../../assets/iconeEditar.png";
import iconExcluir from "../../../../../assets/iconeExcluir.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminEntidadesFuncionariosTabela() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroUsuario, setFiltroUsuario] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || user.perfil !== "Administrador") {
            navigate("/");
        }
    }, []);

    async function fetchFuncionarioLista(filtroNome, filtroUsuario) {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:3000/api/funcionarios/listar?nome=${filtroNome}&usuario=${filtroUsuario}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return [];
            }

            const data = await response.json();
            return data;
        } catch (err) {
            alert("Erro ao conectar com o servidor: " + err.message);
            return [];
        }
    }

    async function fetchExcluirFuncionario(id) {
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if (!confirmar) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:3000/api/funcionarios/excluir?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                alert(data.err || "Erro ao excluir funcionário.");
                return;
            }

            setFuncionarios((prev) => prev.filter(f => f.id !== id));
        } catch (err) {
            alert("Erro ao excluir: " + err.message);
        }
    }

    useEffect(() => {
        async function carregar() {
            const data = await fetchFuncionarioLista(filtroNome, filtroUsuario);
            if (Array.isArray(data)) setFuncionarios(data);
        }
        carregar();
    }, [filtroNome, filtroUsuario]);

    return (
        <>
            <Header perfil="admin" />
            <main>
                <h1>Funcionários</h1>
                <Styled.Busca
                    type="text"
                    placeholder="Buscar nome funcionário..."
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                />
                <Styled.Busca
                    type="text"
                    placeholder="Buscar nome de usuário..."
                    value={filtroUsuario}
                    onChange={(e) => setFiltroUsuario(e.target.value)}
                />
                <Styled.Actions>
                    <button onClick={() => navigate("/admin/entidades/funcionarios/cadastro")}>
                        + Cadastrar Funcionário
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Usuário</th>
                            <th>Cargo</th>
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionarios.map((f) => (
                            <tr key={f.id}>
                                <td>{f.id}</td>
                                <td>{f.nome}</td>
                                <td>{f.usuario}</td>
                                <td>{f.cargo}</td>
                                <td>{f.cpf}</td>
                                <td>{f.telefone}</td>
                                <td>
                                    <button onClick={() => navigate(`/admin/entidades/funcionarios/${f.id}`)}>
                                        <img src={iconEditar} alt="Editar" />
                                    </button>
                                    <button onClick={() => fetchExcluirFuncionario(f.id)}>
                                        <img src={iconExcluir} alt="Excluir" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Styled.Table>
            </main>
            <Footer />
        </>
    );
}

export default AdminEntidadesFuncionariosTabela;