import { Link } from "react-router-dom";
import { useState } from "react";
import Styled from './styles'
import logo from '../../assets/logo perfil oaear.png'
import Sociais from "../Sociais";

function Header(){
    const [dropdownTabela, setDropdownTabela] = useState(false);
    const [dropdownCadastro, setDropdownCadastro] = useState(false);

    const token = localStorage.getItem("token");
    console.log(localStorage.getItem("user"));
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };
    
    return (
        <Styled.Container>
            <Link to={'/'}><img src={logo}/></Link>
            <Styled.Atalhos>
                <li><Link to={'/'}>Página inicial</Link></li>
                <li><Link to={'/institucional'}>Institucional</Link></li>
                <li><Link to={'/projetos'}>Projetos</Link></li>
                <li><Link to={'/doacao'}>Doação</Link></li>
                <li><Link to={'/portal'}>Portal da Transparência</Link></li>
                <li><Link to={'/sobre'}>Sobre</Link></li>
                {user?.perfil === "Administrador" && (
                    <li
                        onClick={() => {
                            setDropdownTabela(!dropdownTabela)
                            setDropdownCadastro(false)
                        }}
                    >
                        <p>Tabelas</p>
                        {dropdownTabela && (
                            <div>
                                <Link to="/tabelas/funcionarios">Funcionários</Link>
                            </div>
                        )}
                    </li>
                )}
                {user?.perfil === "Administrador" && (
                    <li
                        onClick={() => {
                            setDropdownCadastro(!dropdownCadastro)
                            setDropdownTabela(false);
                        }}
                    >
                        <p>Cadastrar</p>
                        {dropdownCadastro && (
                            <div>
                                <Link to="/funcionarios/cadastro">Funcionários</Link>
                            </div>
                        )}
                    </li>
                )}
                {!token ? (
                    <li><Link to={'/login'}>Login</Link></li>
                ) : (
                    <li>
                        <span className="ola-usuario">
                            Olá, {user.nome}
                        </span>
                        <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Sair</button>
                    </li>
                )}
                
            </Styled.Atalhos>
            <Sociais/>
        </Styled.Container>
    )
}

export default Header;
