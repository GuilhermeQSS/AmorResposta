import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastrarDocumentoView() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        titulo: "",
        tipo: "",
        dataCriacao: "",
        descricao: "",
        link: ""
    });

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function fetchCadastrarDocumento() {
        try {
            const response = await fetch("http://localhost:3000/documentos/gravar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                alert("Documento cadastrado com sucesso!");
                navigate("/tabelas/documentos");
            } else {
                const data = await response.json();
                alert(data.Erro || "Erro ao cadastrar documento");
            }
        } catch (error) {
            alert("Erro na conexão com o servidor");
        }
    }

    return (
        <>
            <Header />
            <main>
                <Styled.BackBtn onClick={() => navigate("/tabelas/documentos")}>Voltar</Styled.BackBtn>
                <Styled.Form>
                    <h2>Cadastrar Documento</h2>
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
                    <button onClick={fetchCadastrarDocumento}>Cadastrar</button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default CadastrarDocumentoView;
