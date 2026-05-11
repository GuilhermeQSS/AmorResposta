import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import Styled from "./styles";
import iconEditar from "../../../../../assets/iconeEditar.png";
import iconExcluir from "../../../../../assets/iconeExcluir.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminEntidadesEncontrosTabela() {
    const [encontros, setEncontros] = useState([]);
    const [filtroTitulo, setFiltroTitulo] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!token || user.perfil !== "Administrador") {
            navigate("/");
        }
    }, []);

    async function fetchEncontrosLista(filtroTitulo) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/encontros/listar?titulo=${filtroTitulo}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return [];
            }
            return await response.json();
        } catch (err) {
            alert("Erro ao conectar: " + err.message);
            return [];
        }
    }

    async function fetchExcluirEncontro(id) {
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if (!confirmar) return;

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/encontros/excluir?id=${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                setEncontros((prev) => prev.filter(e => e.id !== id));
            } else {
                const data = await response.json();
                alert(data.err || "Erro ao excluir encontro.");
            }
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    useEffect(() => {
        async function carregar() {
            const data = await fetchEncontrosLista(filtroTitulo);
            if (Array.isArray(data)) setEncontros(data);
        }
        carregar();
    }, [filtroTitulo]);

    function formatarData(dataStr) {
        if (!dataStr) return "";
        return new Date(dataStr).toLocaleDateString("pt-BR", { timeZone: "UTC" });
    }

    return (
        <>
            <Header perfil="admin" />
            <main>
                <h1>Encontros</h1>
                <Styled.Busca
                    type="text"
                    placeholder="Buscar título do encontro..."
                    value={filtroTitulo}
                    onChange={(e) => setFiltroTitulo(e.target.value)}
                />
                <Styled.Actions>
                    <button onClick={() => navigate("/admin/entidades/encontros/cadastro")}>
                        + Cadastrar Encontro
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Data</th>
                            <th>Início</th>
                            <th>Local</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {encontros.map((enc) => (
                            <tr key={enc.id}>
                                <td>{enc.id}</td>
                                <td>{enc.titulo}</td>
                                <td>{formatarData(enc.data)}</td>
                                <td>{enc.horaInicio?.substring(0, 5)}</td>
                                <td>{enc.local}</td>
                                {/* AQUI ESTÁ O STATUS */}
                                <td style={{ color: enc.status === 'c' ? 'red' : 'green', fontWeight: 'bold' }}>
                                    {enc.status === 'c' ? 'Cancelado' : 'Ativo'}
                                </td>
                                <td>
                                    <button onClick={() => navigate(`/admin/entidades/encontros/${enc.id}`)}>
                                        <img src={iconEditar} alt="Editar" />
                                    </button>
                                    <button onClick={() => fetchExcluirEncontro(enc.id)}>
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

export default AdminEntidadesEncontrosTabela;