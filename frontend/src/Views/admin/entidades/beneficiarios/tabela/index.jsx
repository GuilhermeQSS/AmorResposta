import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import Styled from "./styles";
import iconEditar from "../../../../../assets/iconeEditar.png";
import iconExcluir from "../../../../../assets/iconeExcluir.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminEntidadesBeneficiariosTabela() {
    const [beneficiarios, setBeneficiarios] = useState([]);
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

    async function fetchBeneficiarioLista(filtroNome, filtroUsuario) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/beneficiarios/listar?nome=${filtroNome}&usuario=${filtroUsuario}`, {
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

    async function fetchExcluirBeneficiario(id) {
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if (!confirmar) return;

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/beneficiarios/excluir?id=${id}`, {
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
                alert(data.err || "Erro ao excluir beneficiário.");
                return;
            }

            setBeneficiarios((prev) => prev.filter(b => b.id !== id));
        } catch (err) {
            alert("Erro ao excluir: " + err.message);
        }
    }

    useEffect(() => {
        async function carregar() {
            const data = await fetchBeneficiarioLista(filtroNome, filtroUsuario);
            if (Array.isArray(data)) setBeneficiarios(data);
        }
        carregar();
    }, [filtroNome, filtroUsuario]);

    return (
        <>
            <Header perfil="admin" />
            <main>
                <h1>Beneficiários</h1>
                <Styled.Busca
                    type="text"
                    placeholder="Buscar nome do beneficiário..."
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
                    <button onClick={() => navigate("/admin/entidades/beneficiarios/cadastro")}>
                        + Cadastrar Beneficiário
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Usuário</th>
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>Estado</th>
                            <th>Cidade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {beneficiarios.map((b) => (
                            <tr key={b.id}>
                                <td>{b.id}</td>
                                <td>{b.nome}</td>
                                <td>{b.usuario}</td>
                                <td>{b.cpf}</td>
                                <td>{b.telefone}</td>
                                <td>{b.estado}</td>
                                <td>{b.cidade}</td>
                                <td>
                                    <button onClick={() => navigate(`/admin/entidades/beneficiarios/${b.id}`)}>
                                        <img src={iconEditar} alt="Editar" />
                                    </button>
                                    <button onClick={() => fetchExcluirBeneficiario(b.id)}>
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

export default AdminEntidadesBeneficiariosTabela;