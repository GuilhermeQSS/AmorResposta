import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
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
        .then((response) => response.json())
        .catch((error) => alert(error));
    }

    async function excluirBeneficiario(id, event) {
        event.stopPropagation();

        const confirmar = confirm("Tem certeza que deseja excluir?");
        if (!confirmar) {
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/beneficiarios/excluir", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.erro || json.Erro || "Nao foi possivel excluir o beneficiario");
            }

            setBeneficiarios((prev) => prev.filter((beneficiario) => beneficiario.id !== id));
        } catch (error) {
            alert(error.message || "Erro ao excluir");
        }
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
                        placeholder="Buscar por nome ou usuario..."
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
                            <th>endereço</th>
                            <th>telefone</th>
                            <th>usuario</th>
                            <th>ações</th>
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
                                    <td>
                                        <Styled.DeleteButton
                                            type="button"
                                            onClick={(event) => excluirBeneficiario(b.id, event)}
                                        >
                                            Excluir
                                        </Styled.DeleteButton>
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

export default BeneficiariosView;
