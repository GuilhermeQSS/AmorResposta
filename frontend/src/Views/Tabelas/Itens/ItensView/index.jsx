import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ItensView() {
    function fetchItensLista(descricao, dias){
    return fetch(
        `http://localhost:3000/itens/listar?descricao=${descricao}&dias=${dias}`,
        { method: "GET" }
        )
        .then((response) => response.json())
        .catch((error) => alert(error));
    }

    const [itens, setItem] = useState([]);
    const [descricao, setDescricao] = useState("");
    const [dias, setDias] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
    async function carregar(){
        const data = await fetchItensLista(descricao, dias);
        setItem(data);
    }
    carregar();
    }, [descricao, dias]);

    return(
        <>
            <Header/>
            <main>
                <Styled.ContainerBusca>
                    <Styled.Busca type="text"
                        placeholder="Buscar por descrição..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}/>
                    <Styled.Busca type="number"
                        placeholder="Vence em... dias"
                        value={dias}
                        max="365"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (value === "") {
                                setDias("");
                                return;
                            }

                            const num = Number(value);

                            if (num >= 1 && num <= 365) {
                                setDias(num);
                            }
                        }}/>
                </Styled.ContainerBusca>
                <Styled.Actions>
                    <button onClick={() => navigate("/itens/cadastro")}>
                        + Cadastrar Item
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
                            itens.map((e) => (
                                <tr 
                                    key={e.id}
                                    onClick={() => navigate(`/itens/${e.id}`)}
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

export default ItensView;
