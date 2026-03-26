import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";



function FuncionariosView() {
    function fetchFuncionarioLista(usuario,nome){
        return fetch(`http://localhost:3000/funcionarios/listar?filtroUsuario=${usuario}&filtroNome=${nome}`, {
            method: "GET"
        })
        .then((response) =>  response.json())
        .catch((error) => alert(error));
    }
    const [funcionarios, setFuncionarios] = useState([]);
    const [filtroUsuario, setFiltroUsuario] = useState("");
    const [filtroNome, setFiltroNome] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        async function carregar(){
            const data = await fetchFuncionarioLista(filtroUsuario,filtroNome);
            setFuncionarios(data);
        }
        carregar();
    }, [filtroUsuario,filtroNome]);
    
    return(
        <>
            <Header/>
            <main>
                <Styled.Busca type="text"
                    placeholder="Buscar por nome..."
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}/>
                <Styled.Busca type="text"
                    placeholder="Buscar usuario..."
                    value={filtroUsuario}
                    onChange={(e) => setFiltroUsuario(e.target.value)}/>
                <Styled.Actions>
                    <button onClick={() => navigate("/funcionarios/cadastro")}>
                        + Cadastrar Funcionário
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>nome</th>
                            <th>usuario</th>
                            <th>cargo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            funcionarios.map((f) => (
                                <tr 
                                    onClick={() => navigate(`/funcionarios/${f.id}`)}
                                >
                                    <td>{f.id}</td>
                                    <td>{f.nome}</td>
                                    <td>{f.usuario}</td>
                                    <td>{f.cargo}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Styled.Table>
            </main>
            <Footer/>
        </>
    )   
}

export default FuncionariosView;