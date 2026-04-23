import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ItensView() {
    async function fetchItensLista(nome, tipo){
        const response = await fetch(
            `http://localhost:3000/itens/listar?nome=${nome}&tipo=${tipo}`,
            { method: "GET" }
        );
        const data = await response.json();
        
        if (!response.ok) {
            console.log("Erro:", data);
            return []; // retorna array vazio em caso de erro
        }
        
        return data;
    }

    async function fetchExcluirItem(id){
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if(!confirmar) return;

        try {
            await fetch(`http://localhost:3000/itens/excluir?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }});
            setItem((prev) => prev.filter(i => i.id !== id));
        } catch (error) {
            alert("Erro ao excluir"+error);
        }
    }

    const [itens, setItem] = useState([]);
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
    async function carregar(){
        const data = await fetchItensLista(nome, tipo);
        setItem(data);
    }
    carregar();
    }, [nome, tipo]);

    return(
        <>
            <Header/>
            <main>
                <Styled.Busca type="text"
                    placeholder="Buscar por nome..."
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}/>
                <Styled.Busca type="text"
                    placeholder="Buscar por tipo..."
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}/>
                <Styled.Actions>
                    <button onClick={() => navigate("/itens/cadastro")}>
                        + Cadastrar Item
                    </button>
                </Styled.Actions>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Tipo</th>
                            <th>Tem Validade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            itens.map((e) => (
                                <tr key={e.id}>
                                    <td>{e.id}</td>
                                    <td>{e.nome}</td>
                                    <td>{e.descricao}</td>
                                    <td>{e.tipo}</td>
                                    
                                    <td>{Number(e.possuiValidade) === 1 ? "sim" : "não"}</td>
                                    <td>
                                        <button 
                                            onClick={() => navigate(`/itens/${e.id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() =>{fetchExcluirItem(e.id)}}
                                        >
                                            Excluir
                                        </button>
                                    </td>
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
