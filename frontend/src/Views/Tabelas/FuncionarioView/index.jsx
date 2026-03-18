import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";

function fetchFuncionarioLista(){
    return fetch("http://localhost:3000/funcionarios/listar", {
        method: "GET"
    })
    .then((response) =>  response.json())
    .catch((error) => alert(error));
}



function FuncionarioView() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [visibleId, setVisibleId] = useState(null);

    useEffect(() => {
        async function carregar(){
            const data = await fetchFuncionarioLista();
            setFuncionarios(data);
        }
        carregar();
    }, []);

    return(
        <>
            <Header/>
            <main>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>fun_nome</th>
                            <th>fun_usuario</th>
                            <th>fun_senha</th>
                            <th>fun_cargo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            funcionarios.map((funcionario) => (
                                <tr key={funcionario.fun_id}>
                                    <td>{funcionario.fun_id}</td>
                                    <td>{funcionario.fun_nome}</td>
                                    <td>{funcionario.fun_usuario}</td>

                                    <td 
                                        onMouseOver={() => setVisibleId(funcionario.fun_id)}
                                        onMouseLeave={() => setVisibleId(null)}
                                    >
                                        {
                                            visibleId === funcionario.fun_id
                                            ? funcionario.fun_senha
                                            : "******"
                                        }
                                    </td>

                                    <td>{funcionario.fun_cargo}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </main>
            <Footer/>
        </>
    )   
}

export default FuncionarioView;