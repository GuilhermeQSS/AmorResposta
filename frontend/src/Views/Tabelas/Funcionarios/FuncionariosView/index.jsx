import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import {useNavigate } from "react-router-dom";



function FuncionariosView() {
    function fetchFuncionarioLista(filtroNome,filtroUsuario){
        return fetch(`http://localhost:3000/funcionarios/listar?filtroNome=${filtroNome}&filtroUsuario=${filtroUsuario}`, {
            method: "GET"
        })
        .then((response) =>  response.json())
        .catch((error) => alert(error));
    }
    async function fetchExcluirFuncionario(id){
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if(!confirmar) return;

        try {
            await fetch(`http://localhost:3000/funcionarios/excluir?id=${id}`, {
                method: "DELETE"
            });
        } catch (err) {
            alert("Erro ao excluir");
        }
    }
    async function carregar(){
        const data = await fetchFuncionarioLista(filtroNome,filtroUsuario);
        setFuncionarios(data);
    }
    const [funcionarios, setFuncionarios] = useState([]);
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroUsuario, setFiltroUsuario] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        carregar();
    }, [filtroNome,filtroUsuario]);
    
    return(
        <>
            <Header/>
            <main>
                <Styled.Busca type="text"
                    placeholder="Buscar nome funcionário..."
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}/>
                <Styled.Busca type="text"
                    placeholder="Buscar nome de usuário..."
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
                            <th>cpf</th>
                            <th>telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            funcionarios.map((f) => (
                                <tr>
                                    <td>{f.id}</td>
                                    <td>{f.nome}</td>
                                    <td>{f.usuario}</td>
                                    <td>{f.cargo}</td>
                                    <td>{f.cpf}</td>
                                    <td>{f.telefone}</td>
                                    <td>
                                        <button 
                                            onClick={() => navigate(`/funcionarios/${f.id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() =>{
                                                fetchExcluirFuncionario(f.id);
                                                carregar();
                                            }}
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

export default FuncionariosView;