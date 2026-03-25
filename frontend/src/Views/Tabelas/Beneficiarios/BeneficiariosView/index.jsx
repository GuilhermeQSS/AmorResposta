import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatarTelefone, limparTelefone } from "../../../../utils/telefone";

function BeneficiariosView() {
    function fetchBeneficiarioLista(filtro, telefone){
        const params = new URLSearchParams({
            filtro,
            telefone: limparTelefone(telefone)
        });

        return fetch(`http://localhost:3000/beneficiarios/listar?${params.toString()}`, {
            method: "GET"
        })
        .then((response) =>  response.json())
        .catch((error) => alert(error));
    }

    const [beneficiarios, setBeneficiarios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [filtroTelefone, setFiltroTelefone] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        async function carregar(){
            const data = await fetchBeneficiarioLista(filtro, filtroTelefone);
            setBeneficiarios(data);
        }
        carregar();
    }, [filtro, filtroTelefone]);
    
    return(
        <>
            <Header/>
            <main>
                <Styled.Filtros>
                    <Styled.Busca
                        type="text"
                        placeholder="Buscar por nome ou usuário..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <Styled.Busca
                        type="tel"
                        inputMode="numeric"
                        placeholder="Buscar por telefone..."
                        value={filtroTelefone}
                        onChange={(e) => setFiltroTelefone(formatarTelefone(e.target.value))}
                    />
                </Styled.Filtros>
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
                                <td>{formatarTelefone(b.telefone)}</td>
                                <td>{b.usuario}</td>
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
