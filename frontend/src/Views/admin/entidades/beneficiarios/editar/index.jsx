import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { maskCPF, maskTelefone } from "../../../../../utils/mascaras";

const ESTADOS = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
    "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
    "RS","RO","RR","SC","SP","SE","TO"
];

function AdminEntidadesBeneficiariosEditar() {
    const [camposVazios, setCamposVazios] = useState({});
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const { id } = useParams();
    const [form, setForm] = useState({
        nome: "",
        usuario: "",
        senha: "",
        cpf: "",
        telefone: "",
        estado: "",
        cidade: "",
        bairro: "",
        rua: "",
        numero: ""
    });
    const [formOriginal, setFormOriginal] = useState({
        nome: "",
        usuario: "",
        senha: "",
        cpf: "",
        telefone: "",
        estado: "",
        cidade: "",
        bairro: "",
        rua: "",
        numero: ""
    });
    const [editado, setEditado] = useState(false);
    const navigate = useNavigate();

    async function fetchBeneficiario(id) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/beneficiarios/buscar?id=${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return null;
            }

            const data = await response.json();
            return data;
        } catch (err) {
            alert("Erro ao conectar com o servidor: " + err.message);
            return null;
        }
    }

    async function fetchAlterarBeneficiario() {
        const token = localStorage.getItem("token");
        const camposVazios = {
            nome: !form.nome,
            usuario: !form.usuario,
            senha: !form.senha,
            cpf: !form.cpf,
            telefone: !form.telefone,
            estado: !form.estado,
            cidade: !form.cidade,
            bairro: !form.bairro,
            rua: !form.rua,
            numero: !form.numero
        };
        setCamposVazios(camposVazios);
        if (Object.values(camposVazios).includes(true)) {
            alert("Preencha todos os campos!");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/beneficiarios/alterar", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    nome: form.nome,
                    usuario: form.usuario,
                    senha: form.senha,
                    cpf: String(form.cpf).replace(/\D/g, ""),
                    telefone: String(form.telefone).replace(/\D/g, ""),
                    estado: form.estado,
                    cidade: form.cidade,
                    bairro: form.bairro,
                    rua: form.rua,
                    numero: form.numero
                })
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return;
            }

            if (response.ok) {
                setFormOriginal(form);
            } else {
                const json = await response.json();
                alert(json.err || "Erro desconhecido no servidor");
            }
        } catch (err) {
            alert("Erro ao atualizar: " + err.message);
        }
    }

    function atualizarForm(e) {
        const { name, value } = e.target;
        let valor = value;
        if (name === "cpf") {
            valor = maskCPF(value);
        } else if (name === "telefone") {
            valor = maskTelefone(value);
        }
        setForm((prev) => ({
            ...prev,
            [name]: valor
        }));
    }

    useEffect(() => {
        async function carregar() {
            const data = await fetchBeneficiario(id);
            if (!data) return;
            data.cpf = maskCPF(data.cpf);
            data.telefone = maskTelefone(data.telefone);
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
            <Header perfil="admin" />
            <main>
                <Styled.BackBtn>
                    <Link to="/admin/entidades/beneficiarios/tabela">
                        <div>Voltar</div>
                    </Link>
                </Styled.BackBtn>
                <h1>Editar Beneficiário</h1>
                <Styled.Form>
                    <div>
                        <label htmlFor="nome">Nome: </label>
                        <input
                            name="nome"
                            value={form.nome}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.nome ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="usuario">Usuário: </label>
                        <input
                            name="usuario"
                            value={form.usuario}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.usuario ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="senha">Senha: </label>
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            name="senha"
                            value={form.senha}
                            onChange={atualizarForm}
                            disabled={!mostrarSenha}
                            style={{ border: camposVazios.senha ? "2px solid red" : "" }}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                            {mostrarSenha ? "Ocultar" : "Ver senha"}
                        </button>
                    </div>

                    <div>
                        <label htmlFor="cpf">CPF: </label>
                        <input
                            name="cpf"
                            value={form.cpf}
                            onChange={atualizarForm}
                            placeholder="000.000.000-00"
                            inputMode="numeric"
                            maxLength={14}
                            style={{ border: camposVazios.cpf ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="telefone">Telefone: </label>
                        <input
                            name="telefone"
                            value={form.telefone}
                            onChange={atualizarForm}
                            placeholder="(00) 00000-0000"
                            inputMode="numeric"
                            maxLength={15}
                            style={{ border: camposVazios.telefone ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="estado">Estado: </label>
                        <select
                            name="estado"
                            value={form.estado}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.estado ? "2px solid red" : "" }}
                        >
                            <option value="" disabled>Selecione</option>
                            {ESTADOS.map(uf => (
                                <option key={uf} value={uf}>{uf}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="cidade">Cidade: </label>
                        <input
                            name="cidade"
                            value={form.cidade}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.cidade ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="bairro">Bairro: </label>
                        <input
                            name="bairro"
                            value={form.bairro}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.bairro ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="rua">Rua: </label>
                        <input
                            name="rua"
                            value={form.rua}
                            onChange={atualizarForm}
                            style={{ border: camposVazios.rua ? "2px solid red" : "" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="numero">Número: </label>
                        <input
                            name="numero"
                            value={form.numero}
                            onChange={atualizarForm}
                            inputMode="numeric"
                            style={{ border: camposVazios.numero ? "2px solid red" : "" }}
                        />
                    </div>

                    <button
                        type="button"
                        disabled={!editado}
                        onClick={fetchAlterarBeneficiario}
                    >
                        Salvar alterações
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default AdminEntidadesBeneficiariosEditar;