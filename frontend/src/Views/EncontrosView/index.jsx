import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Styled from "./styles";

function EncontrosView(){
    // async function fetchFuncionarioLista(titulo,dataInicio,dataFim) {
    //     const token = localStorage.getItem("token");

    //     try {
    //         const response = await fetch(`http://localhost:3000/api/encontros/listar?titulo=${titulo}&dataInicio=${dataInicio}&dataFim=${dataFim}`, {
    //             method: "GET",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`
    //             }
    //         });

    //         if (response.status === 401 || response.status === 403) {
    //             localStorage.clear();
    //             navigate("/login");
    //             return [];
    //         }

    //         const data = await response.json();
    //         return data;
    //     } catch (err) {
    //         alert("Erro ao conectar com o servidor: " + err.message);
    //         return [];
    //     }
    // }

    return (
        <>
            <Header/>
            <main>
                tabela
                {/* filtro: próximos 7 dias, mes e ano especifico */}
                {/* tabela */}
                {/* modal mostrando info detalhada encontro  */}
            </main>
            <Footer/>
        </>
    )
}

export default EncontrosView;