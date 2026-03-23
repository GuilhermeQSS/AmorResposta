import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

function BeneficiariosView() {
    function fetchBeneficiarioLista(filtro){
        return fetch(`http://localhost:3000/beneficiarios/listar?filtro=${filtro}`, {
            method: "GET"
        })
        .then((response) =>  response.json())
        .catch((error) => alert(error));
    }

    const [beneficiarios, setBeneficiarios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        async function carregar(){
            const data = await fetchBeneficiarioLista(filtro);
            setBeneficiarios(data);
        }
        carregar();
    }, [filtro]);
    
    return(
        <>
            <Header/>
            <main>
                <Styled.Busca type="text"
                    placeholder="Buscar beneficiario..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}/>
                <Styled.Actions>
                    <button onClick={() => navigate("/beneficiarios/cadastro")}>
                        + Cadastrar Beneficiario
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>nome</th>
                            <th>endereco</th>
                            <th>telefone</th>
                            <th>usuario</th>
                            <th>senha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            beneficiarios.map((b) => (
                                <tr 
                                    key={b.id}
                                    onClick={() => navigate(`/beneficiarios/${b.id}`)}
                                >
                                    <td>{b.id}</td>
                                    <td>{b.nome}</td>
                                    <td>{b.endereco}</td>
                                    <td>{b.telefone}</td>
                                    <td>{b.usuario}</td>
                                    <td>{b.senha}</td>
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

export default BeneficiariosView;
