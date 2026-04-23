import { Link } from "react-router-dom";
import { useState } from "react";
import Styled from './styles'
import logo from '../../assets/logo perfil oaear.png'
import Sociais from "../Sociais";

function Header(){
    const [dropdownTabela, setDropdownTabela] = useState(false);
    const [dropdownCadastro, setDropdownCadastro] = useState(false);
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
                    onClick={() => {
                        setDropdownTabela(!dropdownTabela)
                        setDropdownCadastro(false)
                    }}
                >
                    <p>Tabelas</p>
                    {dropdownTabela && (
                        <div>
                            <Link to="/tabelas/funcionarios">Funcionários</Link>
                            <Link to="/tabelas/encontros">Encontros</Link>
                        </div>    
                    )}
                    
                </li>
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
                            <Link to="/encontros/cadastro">Encontros</Link>
                            <Link to="/tabelas/itens">Itens</Link>
                            <Link to="/tabelas/lotes">Lotes</Link>
                        </div>
                    )}
                </li>
                <li
                    onClick={() => {
                        setDropdownCadastro(!dropdownCadastro)
                        setDropdownTabela(false);
                    }}
                >
                    <p>Cadastrar</p>
                    {dropdownCadastro && (
                        <div>
                            <Link to="/itens/cadastro">itens</Link>
                            <Link to="/lotes/cadastro">lotes</Link>
                        </div>
                    )}
                </li>
            </Styled.Atalhos>
            <Sociais/>
        </Styled.Container>
    )
}

export default Header;
