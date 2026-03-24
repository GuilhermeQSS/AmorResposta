import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditarEstoqueView() {
    function fetchEstoque(id){
        return fetch(`http://localhost:3000/estoque/buscar?id=${id}`, {
            method: "GET"
        })
        .then((response) =>  response.json())
        .catch((error) => alert(error));
    }

    async function fetchAlterarEstoque(){
        try {
            console.log("FORM:", form);
            console.log("FORM ORIGINAL:", formOriginal);
            const response = await fetch("http://localhost:3000/estoque/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id,
                    descricao: form.descricao,
                    qtde: form.qtde,
                    validade: form.validade || null,
                    camposAlterados: {
                        descricao: form.descricao !== formOriginal.descricao,
                        qtde: form.qtde !== formOriginal.qtde,
                        validade: form.validade !== formOriginal.validade
                    }
                })
            });
            if(response.ok){
                setFormOriginal(form);
            }else{
                const json = await response.json(); 
                setErros(json.campos || {});
                alert(json.err || 'Erro desconhecido no servidor');
            }
        } catch (error) {
            alert("Erro ao atualizar");
        }
    }

    async function fetchExcluirEstoque(){
        const confirmar = confirm("Tem certeza que deseja excluir?");
        if(!confirmar) return;

        try {
            await fetch("http://localhost:3000/estoque/excluir", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id
                })
            });
            navigate("/tabelas/estoque");
        } catch (error) {
            alert("Erro ao excluir");
        }
    }

    function atualizarForm(e){
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const [erros,setErros] = useState({});
    const navigate = useNavigate();
    const {id} = useParams();
    const [form, setForm] = useState({
        id:0,
        descricao: "",
        qtde: "",
        validade: ""
    });
    const [formOriginal, setFormOriginal] = useState({
        id:0,
        descricao: "",
        qtde: "",
        validade: ""
    });
    const [editado, setEditado] = useState(false);

    function formataData(data = {})
    {
        return {
            id: data.id ?? 0,
            descricao: data.descricao ?? "",
            qtde: data.qtde ?? "",
            validade: data.validade
                ? data.validade.split("T")[0]
                : ""
        }
    }

    useEffect(() => {
        async function carregar(){
            const data = await fetchEstoque(id);
            const dataFormatada = formataData(data)
            setForm(dataFormatada);
            setFormOriginal(dataFormatada);
        }
        carregar();
    }, []);

    useEffect(() => {
        setEditado(JSON.stringify(form) !== JSON.stringify(formOriginal));
    }, [form, formOriginal]);

    return (
        <>
            <Header/>
            <main>
                <Styled.BackBtn>
                    <Link to={'/tabelas/estoque'}>
                        <div>
                            Voltar
                        </div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form>
                    <div>
                        <label htmlFor="descricao">Descrição </label>
                        <input
                            type="text"
                            name="descricao"
                            value={form.descricao}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div>
                        <label htmlFor="qtde">Quantidade: </label>
                        <input
                            type="number"
                            name="qtde"
                            value={form.qtde}
                            onChange={atualizarForm}
                        />
                    </div>

                    <div>
                        <label htmlFor="validade">Validade: </label>
                        <input
                            type="date"
                            name="validade"
                            value={form.validade}
                            onChange={atualizarForm}
                        />
                    </div>

                    <button
                        type="button" 
                        disabled={!editado}
                        onClick={fetchAlterarEstoque}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={fetchExcluirEstoque}
                    >
                        Excluir
                    </button>
                </Styled.Form>
            </main>
            <Footer/>
        </>
    );
}

export default EditarEstoqueView;
