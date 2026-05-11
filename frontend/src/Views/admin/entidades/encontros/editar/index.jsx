import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import Styled from "./styles";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function AdminEntidadesEncontrosEditar() {
    const [camposVazios, setCamposVazios] = useState({});
    const { id } = useParams();
    
    // Estados do Autocomplete de Locais
    const [locais, setLocais] = useState([]);
    const [buscaLocal, setBuscaLocal] = useState(""); 
    const [mostrarDropdown, setMostrarDropdown] = useState(false);

    const [form, setForm] = useState({
        titulo: "",
        data: "",
        horaInicio: "",
        horaFim: "",
        local: "", 
        descricao: "",
        qtdeMax: ""
    });
    const [formOriginal, setFormOriginal] = useState({});
    const [editado, setEditado] = useState(false);
    const navigate = useNavigate();

    // 1. Carrega os Locais
    useEffect(() => {
        async function carregarLocais() {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("http://localhost:3000/api/locais/listar", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setLocais(data);
                }
            } catch (err) {
                console.error("Erro ao carregar locais", err);
            }
        }
        carregarLocais();
    }, []);

    // 2. Carrega o Encontro
    useEffect(() => {
        async function fetchEncontro() {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:3000/api/encontros/buscar?id=${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.clear();
                    navigate("/login");
                    return;
                }

                const data = await response.json();
                if (data) {
                    if (data.data) data.data = data.data.substring(0, 10);
                    if (data.horaInicio) data.horaInicio = data.horaInicio.substring(0, 5);
                    if (data.horaFim) data.horaFim = data.horaFim.substring(0, 5);
                    
                    setForm(data);
                    setFormOriginal(data);
                }
            } catch (err) {
                alert("Erro ao conectar com o servidor: " + err.message);
            }
        }
        fetchEncontro();
    }, [id, navigate]);

    // 3. Ao ter o Encontro e os Locais, preenche o Input Text com o nome correto do local do banco
    useEffect(() => {
        if (form.local && locais.length > 0 && !buscaLocal) {
            const localEncontrado = locais.find(l => l.id == form.local);
            if (localEncontrado) {
                setBuscaLocal(localEncontrado.nome);
            }
        }
    }, [form.local, locais]);

    useEffect(() => {
        setEditado(JSON.stringify(form) !== JSON.stringify(formOriginal));
    }, [form, formOriginal]);


    async function fetchAlterarEncontro() {
        const token = localStorage.getItem("token");
        const vazios = {
            titulo: !form.titulo,
            data: !form.data,
            horaInicio: !form.horaInicio,
            horaFim: !form.horaFim,
            local: !form.local,
            descricao: !form.descricao,
            qtdeMax: !form.qtdeMax
        };
        setCamposVazios(vazios);

        if (!form.local && buscaLocal) {
            alert("Por favor, selecione um local da lista.");
            return;
        }

        if (Object.values(vazios).includes(true)) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/encontros/alterar", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    titulo: form.titulo,
                    data: form.data,
                    horaInicio: form.horaInicio,
                    horaFim: form.horaFim,
                    local: form.local,
                    descricao: form.descricao,
                    qtdeMax: Number(form.qtdeMax)
                })
            });

            if (response.ok) {
                setFormOriginal(form);
                alert("Atualizado com sucesso!");
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
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const locaisFiltrados = locais.filter(loc => 
        loc.nome.toLowerCase().includes(buscaLocal.toLowerCase())
    );

    return (
        <>
            <Header perfil="admin" />
            <main>
                <Styled.BackBtn>
                    <Link to="/admin/entidades/encontros/tabela">
                        <div>Voltar</div>
                    </Link>
                </Styled.BackBtn>
                <h1>Editar Encontro</h1>
                <Styled.Form>
                    <div>
                        <label htmlFor="titulo">Título: </label>
                        <input name="titulo" value={form.titulo} onChange={atualizarForm} style={{ border: camposVazios.titulo ? "2px solid red" : "" }} />
                    </div>

                    <div>
                        <label htmlFor="data">Data: </label>
                        <input type="date" name="data" value={form.data} onChange={atualizarForm} style={{ border: camposVazios.data ? "2px solid red" : "" }} />
                    </div>

                    <div>
                        <label htmlFor="horaInicio">Hora Início: </label>
                        <input type="time" name="horaInicio" value={form.horaInicio} onChange={atualizarForm} style={{ border: camposVazios.horaInicio ? "2px solid red" : "" }} />
                    </div>

                    <div>
                        <label htmlFor="horaFim">Hora Fim: </label>
                        <input type="time" name="horaFim" value={form.horaFim} onChange={atualizarForm} style={{ border: camposVazios.horaFim ? "2px solid red" : "" }} />
                    </div>

                    {/* BLOCÃO DO LOCAL (AUTOCOMPLETE) */}
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label>Local: </label>
                        <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                            <input 
                                type="text" 
                                placeholder="Digite para buscar..." 
                                value={buscaLocal}
                                onChange={(e) => {
                                    setBuscaLocal(e.target.value);
                                    setForm(prev => ({ ...prev, local: "" }));
                                    setMostrarDropdown(true);
                                }}
                                onFocus={() => setMostrarDropdown(true)}
                                onBlur={() => setTimeout(() => setMostrarDropdown(false), 200)}
                                style={{ border: camposVazios.local ? "2px solid red" : "", flex: 1 }}
                            />
                            <button 
                                type="button" 
                                onClick={() => window.open("/admin/entidades/locais/cadastro", "_blank")}
                                style={{ whiteSpace: "nowrap", padding: "0 15px" }}
                            >
                                + Novo Local
                            </button>
                        </div>

                        {mostrarDropdown && locaisFiltrados.length > 0 && (
                            <ul style={{
                                position: "absolute",
                                top: "70px",
                                left: 0,
                                width: "calc(100% - 130px)",
                                background: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                maxHeight: "150px",
                                overflowY: "auto",
                                zIndex: 10,
                                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
                            }}>
                                {locaisFiltrados.map(loc => (
                                    <li 
                                        key={loc.id} 
                                        onClick={() => {
                                            setForm(prev => ({ ...prev, local: loc.id }));
                                            setBuscaLocal(loc.nome);
                                            setMostrarDropdown(false);
                                        }}
                                        style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee", color: "#333" }}
                                        onMouseEnter={(e) => e.target.style.background = "#f0f0f0"}
                                        onMouseLeave={(e) => e.target.style.background = "transparent"}
                                    >
                                        {loc.nome}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label htmlFor="descricao">Descrição: </label>
                        <input name="descricao" value={form.descricao} onChange={atualizarForm} style={{ border: camposVazios.descricao ? "2px solid red" : "" }} />
                    </div>

                    <div>
                        <label htmlFor="qtdeMax">Vagas Máximas: </label>
                        <input type="number" name="qtdeMax" value={form.qtdeMax} onChange={atualizarForm} inputMode="numeric" style={{ border: camposVazios.qtdeMax ? "2px solid red" : "" }} />
                    </div>

                    <button type="button" disabled={!editado} onClick={fetchAlterarEncontro}>
                        Salvar alterações
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default AdminEntidadesEncontrosEditar;