import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DocumentosView() {
    function fetchDocumentoLista(filtro) {
        return fetch(`http://localhost:3000/documentos/listar?filtro=${filtro}`, {
            method: "GET"
        })
            .then((response) => response.json())
            .catch((error) => alert(error));
    }

    const [documentos, setDocumentos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function carregar() {
            const data = await fetchDocumentoLista(filtro);
            setDocumentos(data);
        }
        carregar();
    }, [filtro]);

    return (
        <>
            <Header />
            <main>
                <Styled.Busca type="text"
                    placeholder="Buscar documento..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)} />
                <Styled.Actions>
                    <button onClick={() => navigate("/documentos/cadastro")}>
                        + Cadastrar Documento
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Tipo</th>
                            <th>Data Criação</th>
                            <th>Descrição</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            documentos.map((d) => (
                                <tr
                                    key={d.id}
                                    onClick={() => navigate(`/documentos/${d.id}`)}
                                >
                                    <td>{d.id}</td>
                                    <td>{d.titulo}</td>
                                    <td>{d.tipo}</td>
                                    <td>{d.dataCriacao ? new Date(d.dataCriacao).toLocaleDateString('pt-BR') : '-'}</td>
                                    <td>{d.descricao}</td>
                                    <td>{d.link}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Styled.Table>
            </main>
            <Footer />
        </>
    )
}

export default DocumentosView;
