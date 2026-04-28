import { Link } from "react-router-dom";
import { useState } from "react";
import Styled from "./styles";
import logo from "../../assets/logo perfil oaear.png";
import Sociais from "../Sociais";

const tabelas = [
    { label: "Funcionarios", path: "/tabelas/funcionarios" },
    { label: "Beneficiarios", path: "/tabelas/beneficiarios" },
    { label: "Doacoes", path: "/tabelas/doacoes" },
    { label: "Itens", path: "/tabelas/itens" },
    { label: "Documentos", path: "/tabelas/documentos" },
    { label: "Despesas", path: "/tabelas/despesas" },
];

const cadastros = [
    { label: "Funcionarios", path: "/funcionarios/cadastro" },
    { label: "Encontros", path: "/encontros/cadastro" },
    { label: "Beneficiarios", path: "/beneficiarios/cadastro" },
    { label: "Doacoes", path: "/doacoes/cadastro" },
    { label: "Itens", path: "/itens/cadastro" },
    { label: "Documentos", path: "/documentos/cadastro" },
    { label: "Despesas", path: "/despesas/cadastro" },
];

function Header(){
    const [dropdownTabela, setDropdownTabela] = useState(false);
    const [dropdownCadastro, setDropdownCadastro] = useState(false);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user?.perfil === "Administrador";

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <Styled.Container>
            <Link to={"/"}><img src={logo}/></Link>
            <Styled.Atalhos>
                <li><Link to={"/"}>Pagina inicial</Link></li>
                <li><Link to={"/institucional"}>Institucional</Link></li>
                <li><Link to={"/projetos"}>Projetos</Link></li>
                <li><Link to={"/doacao"}>Doacao</Link></li>
                <li><Link to={"/portal"}>Portal da Transparencia</Link></li>
                <li><Link to={"/sobre"}>Sobre</Link></li>
                {isAdmin && (
                    <li><Link to="/tabelas/encontros">Encontros</Link></li>
                )}
                {isAdmin && (
                    <li
                        onClick={() => {
                            setDropdownTabela(!dropdownTabela);
                            setDropdownCadastro(false);
                        }}
                    >
                        <p>Tabelas</p>
                        {dropdownTabela && (
                            <div>
                                {tabelas.map((tabela) => (
                                    <Link key={tabela.path} to={tabela.path}>
                                        {tabela.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </li>
                )}
                {isAdmin && (
                    <li
                        onClick={() => {
                            setDropdownCadastro(!dropdownCadastro);
                            setDropdownTabela(false);
                        }}
                    >
                        <p>Cadastrar</p>
                        {dropdownCadastro && (
                            <div>
                                {cadastros.map((cadastro) => (
                                    <Link key={cadastro.path} to={cadastro.path}>
                                        {cadastro.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </li>
                )}
                {!token ? (
                    <li><Link to={"/login"}>Login</Link></li>
                ) : (
                    <li>
                        <span className="ola-usuario">
                            Ola, {user.nome}
                        </span>
                        <button onClick={handleLogout} style={{ cursor: "pointer" }}>Sair</button>
                    </li>
                )}
            </Styled.Atalhos>
            <Sociais />
        </Styled.Container>
    );
}

export default Header;
