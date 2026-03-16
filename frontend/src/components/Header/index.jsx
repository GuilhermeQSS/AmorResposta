import { Link } from "react-router-dom";
import Styled from './styles'
import logo from '../../assets/logo perfil oaear.png'

function Header(){
    return (
        <Styled.Header>
            <Link to={'/'}><img src={logo}/></Link>
            <Styled.Atalhos>
                <li><Link>Tabelas</Link></li>
                <li>Coisa2</li>
            </Styled.Atalhos>
        </Styled.Header>
    )
}

export default Header;