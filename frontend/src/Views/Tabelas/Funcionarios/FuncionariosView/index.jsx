import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";



function FuncionariosView() {
    function fetchFuncionarioLista(filtro){
        return fetch(`http://localhost:3000/funcionarios/listar?filtro=${filtro}`, {
            method: "GET"
        })
        .then((response) =>  response.json())
        .catch((error) => alert(error));
    }
    const [funcionarios, setFuncionarios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        async function carregar(){
            const data = await fetchFuncionarioLista(filtro);
            setFuncionarios(data);
        }
        carregar();
    }, [filtro]);
    
    return(
        <>
            <Header/>
            <main>
                <Styled.Busca type="text"
                    placeholder="Buscar funcionário..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}/>
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