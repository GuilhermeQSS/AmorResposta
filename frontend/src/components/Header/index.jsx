import { Link } from "react-router-dom";
import Styled from './styles'
import logo from '../../assets/logo perfil oaear.png'
import Sociais from "../Sociais";

function Header({perfil}){
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };
    
    const getHomePath = () => {
        if (user?.perfil === "Administrador") return <li><Link to={'/admin'}>Dashboard</Link></li>;
        if (user?.perfil === "Beneficiario") return <li><Link to={'/beneficiario'}>Home</Link></li>;
        if (user?.perfil === "Funcionario") return <li><Link to={'/funcionario'}>Home</Link></li>;
        return <li><Link to={'/'}>Home</Link></li>;
    };

    return (
        <Styled.Container>
            <Link to={'/'}><img src={logo}/></Link>
            <Styled.Atalhos>
                {getHomePath()}
                {perfil === "nenhum" && (
                    <>
                        <li><Link to={'/institucional'}>Institucional</Link></li>
                        <li><Link to={'/projetos'}>Projetos</Link></li>
                        <li><Link to={'/doacao'}>Doação</Link></li>
                        <li><Link to={'/portal'}>Portal da Transparência</Link></li>
                        <li><Link to={'/sobre'}>Sobre</Link></li>
                    </>
                )}
                {perfil === "admin" && (
                    <>
                        <li><Link to={'/admin/entidades/funcionarios/tabela'}>Funcionarios</Link></li>
                        <li><Link to={'/admin/entidades/beneficiarios/tabela'}>Beneficiarios</Link></li>
                        <li><Link to={'/admin/entidades/encontros/tabela'}>Encontros</Link></li>
                        <li><Link to={'/admin/entidades/funcionarios/tabela'}>Lotes</Link></li>
                        <li><Link to={'/admin/entidades/funcionarios/tabela'}>Itens</Link></li>
                        <li><Link to={'/admin/entidades/funcionarios/tabela'}>Despesas</Link></li>
                        <li><Link to={'/admin/entidades/funcionarios/tabela'}>Documentos</Link></li>
                        <li><Link to={'/admin/entidades/locais/tabela'}>Locais</Link></li>
                    </>
                )}
                {perfil === "beneficiario" && (
                    <li><Link to={'/beneficiario/encontros'}>Encontros</Link></li>
                )}
                {!token ? (
                    <li><Link to={'/login'}>Login</Link></li>
                ) : (
                    <li>
                        <span className="ola-usuario">
                            Olá, {user?.nome}
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
