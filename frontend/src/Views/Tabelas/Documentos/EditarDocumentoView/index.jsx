import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditarDocumentoView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        id: id,
        titulo: "",
        tipo: "",
        dataCriacao: "",
        descricao: "",
        link: ""
    });
    const [formOriginal, setFormOriginal] = useState({});
    const [editado, setEditado] = useState(false);

    useEffect(() => {
        async function fetchDocumento() {
            try {
                const response = await fetch(`http://localhost:3000/documentos/buscar?id=${id}`);
                const data = await response.json();
                if (response.ok) {
                    const dataFormatada = data.dataCriacao ? new Date(data.dataCriacao).toISOString().split('T')[0] : "";
                    const formData = { ...data, dataCriacao: dataFormatada };
                    setForm(formData);
                    setFormOriginal(formData);
                } else {
                    alert(data.Erro || "Erro ao buscar documento");
                }
            } catch (error) {
                alert("Erro ao conectar com o servidor");
            }
        }
        fetchDocumento();
    }, [id]);

    useEffect(() => {
        setEditado(JSON.stringify(form) !== JSON.stringify(formOriginal));
    }, [form, formOriginal]);

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function fetchAlterarDocumento() {
        try {
            const response = await fetch("http://localhost:3000/documentos/alterar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                alert("Documento alterado com sucesso!");
                navigate("/tabelas/documentos");
            } else {
                const data = await response.json();
                alert(data.Erro || "Erro ao alterar documento");
            }
        } catch (error) {
            alert("Erro na conexão com o servidor");
        }
    }

    async function fetchExcluirDocumento() {
        if (window.confirm("Deseja realmente excluir este documento?")) {
            try {
                const response = await fetch("http://localhost:3000/documentos/excluir", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: form.id })
                });
                if (response.ok) {
                    alert("Documento excluído com sucesso!");
                    navigate("/tabelas/documentos");
                } else {
                    const data = await response.json();
                    alert(data.Erro || "Erro ao excluir documento");
                }
            } catch (error) {
                alert("Erro na conexão com o servidor");
            }
        }
    }

    return (
        <>
            <Header />
            <main>
                <Styled.BackBtn onClick={() => navigate("/tabelas/documentos")}>Voltar</Styled.BackBtn>
                <Styled.Form>
                    <h2>Editar Documento</h2>
                    <div>
                        <label>ID:</label>
                        <input type="text" value={form.id} disabled />
                    </div>
                    <div>
                        <label>Título:</label>
                        <input type="text" name="titulo" value={form.titulo} onChange={atualizarForm} />
                    </div>
                    <div>
                        <label>Tipo:</label>
                        <input type="text" name="tipo" value={form.tipo} onChange={atualizarForm} />
                    </div>
                    <div>
                        <label>Data de Criação:</label>
                        <input type="date" name="dataCriacao" value={form.dataCriacao} onChange={atualizarForm} />
                    </div>
                    <div>
                        <label>Descrição:</label>
                        <input type="text" name="descricao" value={form.descricao} onChange={atualizarForm} />
                    </div>
                    <div>
                        <label>Link/URL:</label>
                        <input type="text" name="link" value={form.link} onChange={atualizarForm} />
                    </div>
                    <button onClick={fetchAlterarDocumento} disabled={!editado}>Salvar Alterações</button>
                    <button onClick={fetchExcluirDocumento} style={{ backgroundColor: "#ff4d4d", marginTop: "10px" }}>Excluir Documento</button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default EditarDocumentoView;
