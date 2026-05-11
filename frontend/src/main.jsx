import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './padronizacao.css'
import Home from './Views/info/home'
import Institucional from './Views/info/institucional'
import Projetos from './Views/info/projetos'
import Doacao from './Views/info/doacao'
import Portal from './Views/info/portal'
import Sobre from './Views/info/sobre'
import Login from './Views/login'
import RotasProtegidas from './components/RotasProtegidas'
import BeneficiarioHome from './Views/beneficiario/home'
import BeneficiarioEncontros from './Views/beneficiario/encontros'
import AdminHome from './Views/admin/home'
import AdminEntidadesFuncionariosTabela from './Views/admin/entidades/funcionarios/tabela'
import AdminEntidadesFuncionariosEditar from './Views/admin/entidades/funcionarios/editar'
import AdminEntidadesFuncionariosCadastrar from './Views/admin/entidades/funcionarios/cadastrar'
import AdminEntidadesBeneficiariosTabela from './Views/admin/entidades/beneficiarios/tabela'
import AdminEntidadesBeneficiariosEditar from './Views/admin/entidades/beneficiarios/editar'
import AdminEntidadesBeneficiariosCadastrar from './Views/admin/entidades/beneficiarios/cadastrar'
import AdminEntidadesEncontrosTabela from './Views/admin/entidades/encontros/tabela'
import AdminEntidadesEncontrosEditar from './Views/admin/entidades/encontros/editar'
import AdminEntidadesEncontrosCadastrar from './Views/admin/entidades/encontros/cadastrar'
import AdminEntidadesLocaisTabela from './Views/admin/entidades/locais/tabela'
import AdminEntidadesLocaisEditar from './Views/admin/entidades/locais/editar'
import AdminEntidadesLocaisCadastrar from './Views/admin/entidades/locais/cadastrar'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/institucional' element={<Institucional />} />
                <Route path='/projetos' element={<Projetos />} />
                <Route path='/doacao' element={<Doacao />} />
                <Route path='/portal' element={<Portal />} />
                <Route path='/sobre' element={<Sobre />} />
                <Route path='/login' element={<Login />} />
                
                <Route element={<RotasProtegidas perfil={"Administrador"} />}>
                    <Route path='/admin' element={<AdminHome />} />

                    {/* FUNCIONÁRIOS */}
                    <Route path='/admin/entidades/funcionarios/tabela' element={<AdminEntidadesFuncionariosTabela />} />
                    <Route path='/admin/entidades/funcionarios/:id' element={<AdminEntidadesFuncionariosEditar />} />
                    <Route path='/admin/entidades/funcionarios/cadastro' element={<AdminEntidadesFuncionariosCadastrar />} />

                    {/* BENEFICIÁRIOS */}
                    <Route path='/admin/entidades/beneficiarios/tabela' element={<AdminEntidadesBeneficiariosTabela />} />
                    <Route path='/admin/entidades/beneficiarios/:id' element={<AdminEntidadesBeneficiariosEditar />} />
                    <Route path='/admin/entidades/beneficiarios/cadastro' element={<AdminEntidadesBeneficiariosCadastrar />} />

                    {/* ENCONTROS */}
                    <Route path='/admin/entidades/encontros/tabela' element={<AdminEntidadesEncontrosTabela />} />
                    <Route path='/admin/entidades/encontros/:id' element={<AdminEntidadesEncontrosEditar />} />
                    <Route path='/admin/entidades/encontros/cadastro' element={<AdminEntidadesEncontrosCadastrar />} />

                    {/* LOCAIS */}
                    <Route path='/admin/entidades/locais/tabela' element={<AdminEntidadesLocaisTabela />} />
                    <Route path='/admin/entidades/locais/:id' element={<AdminEntidadesLocaisEditar />} />
                    <Route path='/admin/entidades/locais/cadastro' element={<AdminEntidadesLocaisCadastrar />} />
                </Route>

                <Route element={<RotasProtegidas perfil={"Beneficiario"} />}>
                    <Route path='/beneficiario' element={<BeneficiarioHome />} />
                    <Route path='/beneficiario/encontros' element={<BeneficiarioEncontros />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
)