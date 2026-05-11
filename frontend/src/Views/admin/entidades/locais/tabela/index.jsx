import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import Styled from "./styles";
import iconEditar from "../../../../../assets/iconeEditar.png";
import iconExcluir from "../../../../../assets/iconeExcluir.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminEntidadesLocaisTabela() {
    const [locais, setLocais] = useState([]);
    const [filtroNome, setFiltroNome] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!token || user.perfil !== "Administrador") {
            navigate("/");
        }
    }, []);

    async function fetchLocaisLista(filtroNome) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/locais/listar?nome=${filtroNome}`, {
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

            return await response.json();
        } catch (err) {
            alert("Erro ao conectar com o servidor: " + err.message);
            return [];
        }
    }

    async function fetchExcluirLocal(id) {
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if (!confirmar) return;

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/locais/excluir?id=${id}`, {
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
                alert(data.err || "Erro ao excluir local.");
                return;
            }

            setLocais((prev) => prev.filter(l => l.id !== id));
        } catch (err) {
            alert("Erro ao excluir: " + err.message);
        }
    }

    useEffect(() => {
        async function carregar() {
            const data = await fetchLocaisLista(filtroNome);
            if (Array.isArray(data)) setLocais(data);
        }
        carregar();
    }, [filtroNome]);

    return (
        <>
            <Header perfil="admin" />
            <main>
                <h1>Locais</h1>
                <Styled.Busca
                    type="text"
                    placeholder="Buscar nome do local..."
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                />
                <Styled.Actions>
                    <button onClick={() => navigate("/admin/entidades/locais/cadastro")}>
                        + Cadastrar Local
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locais.map((loc) => (
                            <tr key={loc.id}>
                                <td>{loc.id}</td>
                                <td>{loc.nome}</td>
                                <td>
                                    <button onClick={() => navigate(`/admin/entidades/locais/${loc.id}`)}>
                                        <img src={iconEditar} alt="Editar" />
                                    </button>
                                    <button onClick={() => fetchExcluirLocal(loc.id)}>
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

export default AdminEntidadesLocaisTabela;