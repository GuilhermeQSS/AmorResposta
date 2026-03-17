import { Link } from "react-router-dom";
import Styled from './styles'
import logo from '../../assets/logo perfil oaear.png'
import Sociais from "../Sociais";

function Header(){
    return (
        <Styled.Container>
            <Link to={'/'}><img src={logo}/></Link>
            <Styled.Atalhos>
                <li><Link>Institucional</Link></li>
                <li><Link>Projetos</Link></li>
                <li><Link>Doação</Link></li>
                <li><Link>Portal da Transparência</Link></li>
                <li><Link>Sobre</Link></li>
            </Styled.Atalhos>
            <Sociais/>
        </Styled.Container>
    )
}

export default Header;