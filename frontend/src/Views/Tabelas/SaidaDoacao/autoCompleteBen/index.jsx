import { useState, useEffect, useRef } from "react";
import Styled from "./styles";

function AutocompleteBen({ beneficiarios, value, onChange, erro }) {
    const [busca, setBusca] = useState("");
    const [aberto, setAberto] = useState(false);
    const [selecionado, setSelecionado] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickFora(e) {
            if (ref.current && !ref.current.contains(e.target))
                setAberto(false);
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    useEffect(() => {
        if (value && beneficiarios.length > 0) {
            const ben = beneficiarios.find(b => b.id === value || b.id === Number(value));
            if (ben) setSelecionado(ben);
        }
    }, [value, beneficiarios]);

    const filtrados = beneficiarios.filter(b =>
        (b.nome ?? "").toLowerCase().includes(busca.toLowerCase())
    );

    function selecionar(b) {
        setSelecionado(b);
        onChange(b.id); // ← id, não ben_id
        setAberto(false);
        setBusca("");
    }

    function limpar() {
        setSelecionado(null);
        onChange("");
        setBusca("");
    }

    return (
        <Styled.Container ref={ref}>
            {selecionado ? (
                <Styled.Selecionado $erro={erro}>
                    <span>{selecionado.nome} — {selecionado.cpf}</span>
                    <button type="button" onClick={limpar}>✕</button>
                </Styled.Selecionado>
            ) : (
                <input
                    type="text"
                    placeholder="Buscar beneficiário..."
                    value={busca}
                    onChange={(e) => { setBusca(e.target.value); setAberto(true); }}
                    onFocus={() => setAberto(true)}
                    style={{ border: erro ? "2px solid red" : "none", color: "black" }}
                />
            )}

            {aberto && !selecionado && (
                <Styled.Lista>
                    {filtrados.length === 0
                        ? <Styled.Vazio>Nenhum resultado</Styled.Vazio>
                        : filtrados.map(b => (
                            <Styled.Item key={`ben-${b.id}`} onClick={() => selecionar(b)}>
                            {b.nome} — {b.cpf} {/* ← nome, não ben_nome */}
                            
                        </Styled.Item>
                        ))
                    }
                </Styled.Lista>
            )}
        </Styled.Container>
    );
}

export default AutocompleteBen;