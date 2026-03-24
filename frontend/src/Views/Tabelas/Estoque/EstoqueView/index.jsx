import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function EstoqueView() {
    function fetchEstoqueLista(filtro){
        return fetch(`http://localhost:3000/estoque/listar?filtro=${filtro}`, {
            method: "GET"
        })
        .then((response) =>  response.json())
        .catch((error) => alert(error));
    }

    const [estoque, setEstoque] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        async function carregar(){
            const data = await fetchEstoqueLista(filtro);
            setEstoque(data);
        }
        carregar();
    }, [filtro]);
    
    return(
        <>
            <Header/>
            <main>
                <Styled.Busca type="text"
                    placeholder="Buscar estoque..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}/>
                <Styled.Actions>
                    <button onClick={() => navigate("/estoque/cadastro")}>
                        + Cadastrar Estoque
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Descricao</th>
                            <th>Quantidade</th>
                            <th>Validade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            estoque.map((e) => (
                                <tr 
                                    key={e.id}
                                    onClick={() => navigate(`/estoque/${e.id}`)}
                                >
                                    <td>{e.id}</td>
                                    <td>{e.descricao}</td>
                                    <td>{e.qtde}</td>
                                    <td>{e.validade}</td>
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

export default EstoqueView;
