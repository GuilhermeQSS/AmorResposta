import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import Styled from "./styles";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminEntidadesEncontrosCadastrar() {
    const [camposVazios, setCamposVazios] = useState({});
    
    // Estados para o Autocomplete de Locais
    const [locais, setLocais] = useState([]);
    const [buscaLocal, setBuscaLocal] = useState(""); 
    const [mostrarDropdown, setMostrarDropdown] = useState(false);
    
    const [form, setForm] = useState({
        titulo: "",
        data: "",
        horaInicio: "",
        horaFim: "",
        local: "", // Guarda o ID do local selecionado
        descricao: "",
        qtdeMax: ""
    });
    const navigate = useNavigate();

    // Carrega a lista de locais
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

    async function fetchCadastrarEncontro() {
        const token = localStorage.getItem("token");
        let vazios = {
            titulo: !form.titulo,
            data: !form.data,
            horaInicio: !form.horaInicio,
            horaFim: !form.horaFim,
            local: !form.local, // Se não escolheu da lista, ficará vazio
            descricao: !form.descricao,
            qtdeMax: !form.qtdeMax
        };
        setCamposVazios(vazios);
        
        if (!form.local && buscaLocal) {
            alert("Por favor, selecione um local da lista ou cadastre um novo.");
            return;
        }

        if (Object.values(vazios).includes(true)) return;

        try {
            const response = await fetch("http://localhost:3000/api/encontros/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    titulo: form.titulo,
                    data: form.data,
                    horaInicio: form.horaInicio,
                    horaFim: form.horaFim,
                    local: form.local, 
                    descricao: form.descricao,
                    qtdeMax: Number(form.qtdeMax)
                })
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate("/login");
                return;
            }

            if (response.ok) {
                navigate("/admin/entidades/encontros/tabela");
            } else {
                const json = await response.json();
                alert(json.err || "Erro desconhecido no servidor");
            }
        } catch (err) {
            alert("Erro ao gravar no banco: " + err.message);
        }
    }

    function atualizarForm(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Filtra para a bandeja do dropdown
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
                <h1>Cadastrar Encontro</h1>
                <Styled.Form noValidate>
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
                                    setForm(prev => ({ ...prev, local: "" })); // Limpa o ID se alterar o texto
                                    setMostrarDropdown(true);
                                }}
                                onFocus={() => setMostrarDropdown(true)}
                                // Timeout permite clicar na lista antes de fechar o dropdown
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

                        {/* Bandeja do Dropdown */}
                        {mostrarDropdown && locaisFiltrados.length > 0 && (
                            <ul style={{
                                position: "absolute",
                                top: "70px", // Ajuste esse valor dependendo do seu CSS
                                left: 0,
                                width: "calc(100% - 130px)", // Acompanha o input, desconsiderando o botão
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

                    <button type="button" onClick={fetchCadastrarEncontro}>
                        Cadastrar
                    </button>
                </Styled.Form>
            </main>
            <Footer />
        </>
    );
}

export default AdminEntidadesEncontrosCadastrar;