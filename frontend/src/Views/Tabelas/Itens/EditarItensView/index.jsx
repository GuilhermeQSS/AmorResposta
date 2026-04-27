import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditarItensView() {
    function fetchItenId(id){
        return fetch(`http://localhost:3000/itens/buscar?id=${id}`, {
            method: "GET"
        })
        .then((response) =>  response.json())
        .catch((error) => alert(error));
    }

    async function fetchAlterarItem(){
        const camposVazios = {
            descricao: !form.descricao,
            nome: !form.nome,
            tipo: !form.tipo,
        };
        setCamposVazios(camposVazios);
        if (Object.values(camposVazios).includes(true)) {
            alert("Preencha todos os campos!");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/itens/alterar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: form.id,
                    descricao: form.descricao,
                    nome: form.nome,
                    tipo: form.tipo,
                    possuiValidade: form.possuiValidade
                })
            });
            if(response.ok){
                alert("alterado com sucesso");
                setFormOriginal(form);
            }else{
                const json = await response.json();
                alert(json.err || 'Erro desconhecido no servidor');
            }
        } catch (err) {
            alert("Erro ao atualizar");
        }
    }

    function atualizarForm(e){
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    const [camposVazios,setCamposVazios] = useState({});
    const navigate = useNavigate();
    const {id} = useParams();
    const [form, setForm] = useState({
        id:0,
        descricao: "",
        nome: "",
        tipo: "",
        possuiValidade: false
    });
    const [formOriginal, setFormOriginal] = useState({
        id:0,
        descricao: "",
        nome: "",
        tipo: "",
        possuiValidade: false
    });
    const [editado, setEditado] = useState(false);

    useEffect(() => {
        async function carregar(){
            const data = await fetchItenId(id);
            setForm(data);
            setFormOriginal(data);
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
                    <Link to={'/tabelas/itens'}>
                        <div>
                            Voltar
                        </div>
                    </Link>
                </Styled.BackBtn>
                <Styled.Form>
                    <div>
                        <label htmlFor="nome">Nome: </label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.nome ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="descricao">Descricão: </label>
                        <input
                            type="text"
                            name="descricao"
                            value={form.descricao}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.descricao ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="tipo">Tipo: </label>
                        <input
                            type="text"
                            name="tipo"
                            value={form.tipo}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.tipo ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="possuiValidade">Possui Validade</label>
                        <input
                        type="checkbox"
                        name="possuiValidade"
                        id="possuiValidade"
                        checked={!!form.possuiValidade}
                        onChange={atualizarForm}
                        />
                    </div>

                    <button
                        type="button" 
                        disabled={!editado}
                        onClick={fetchAlterarItem}
                    >
                        Editar
                    </button>
                </Styled.Form>
            </main>
            <Footer/>
        </>
    );
}

export default EditarItensView;
