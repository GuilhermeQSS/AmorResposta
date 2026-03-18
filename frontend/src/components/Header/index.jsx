import { Link } from "react-router-dom";
import { useState } from "react";
import Styled from './styles'
import logo from '../../assets/logo perfil oaear.png'
import Sociais from "../Sociais";

function Header(){
    const [dropdownOpen, setDropdownOpen] = useState(false);
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
                <li
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <p>Tabelas</p>
                    {dropdownOpen && (
                        <div>
                            <Link to="/tabelas/funcionarios">Funcionários</Link>
                            <Link to="/tabelas/beneficiarios">Beneficiario</Link>
                        </div>
                    )}
                </li>
            </Styled.Atalhos>
            <Sociais/>
        </Styled.Container>
    )
}

export default Header;