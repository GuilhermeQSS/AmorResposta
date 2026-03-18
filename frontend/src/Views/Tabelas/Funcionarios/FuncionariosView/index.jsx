import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function fetchFuncionarioLista(filtro){
    return fetch(`http://localhost:3000/funcionarios/listar?filtro=${filtro}`, {
        method: "GET"
    })
    .then((response) =>  response.json())
    .catch((error) => alert(error));
}


function FuncionariosView() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [visibleId, setVisibleId] = useState(null);
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
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>fun_nome</th>
                            <th>fun_usuario</th>
                            <th>fun_cargo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            funcionarios.map((funcionario) => (
                                <tr 
                                    onClick={() => navigate(`/funcionarios/${funcionario.fun_id}`)}
                                >
                                    <td>{funcionario.fun_id}</td>
                                    <td>{funcionario.fun_nome}</td>
                                    <td>{funcionario.fun_usuario}</td>
                                    <td>{funcionario.fun_cargo}</td>
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