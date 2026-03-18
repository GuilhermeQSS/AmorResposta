import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Styled from "./styles";
import { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function EditarFuncionarioView() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fun_nome: "João",
        fun_usuario: "joao123",
        fun_senha: "123456",
        fun_cargo: "Admin"
    });

    const [original, setOriginal] = useState(form);
    const [editando, setEditando] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function houveAlteracao() {
        return JSON.stringify(form) !== JSON.stringify(original);
    }

    async function handleSalvar() {
        console.log("Salvando:", form);

        setOriginal(form);
        setEditando(false);
    }

    function handleEditar() {
        setEditando(true);
    }

    function handleExcluir() {
        const confirmar = window.confirm("Tem certeza que deseja excluir?");
        if (confirmar) {
            console.log("Excluir funcionário");
            navigate("/");
        }
    }

    return (
        <>
            <Header/>
            <main>
                <Styled.Container>
                    <form>
                        <input
                            name="fun_nome"
                            value={form.fun_nome}
                            onChange={handleChange}
                            disabled={!editando}
                        />

                        <input
                            name="fun_usuario"
                            value={form.fun_usuario}
                            onChange={handleChange}
                            disabled={!editando}
                        />

                        <input
                            name="fun_senha"
                            value={form.fun_senha}
                            onChange={handleChange}
                            disabled={!editando}
                        />
                        <div>
                            <label htmlFor="fun_cargo">Cargo</label>
                            <input
                                name="fun_cargo"
                                value={form.fun_cargo}
                                onChange={handleChange}
                                disabled={!editando}
                            />
                        </div>

                        <Styled.ButtonGroup>
                            {!editando && (
                                <button type="button" onClick={handleEditar}>
                                    Editar
                                </button>
                            )}

                            {editando && (
                                <button
                                    type="button"
                                    onClick={handleSalvar}
                                    disabled={!houveAlteracao()}
                                >
                                    Salvar
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleExcluir}
                            >
                                Excluir
                            </button>
                        </Styled.ButtonGroup>
                    </form>
                </Styled.Container>
            </main>
            <Footer/>
        </>
    );
}

export default EditarFuncionarioView;