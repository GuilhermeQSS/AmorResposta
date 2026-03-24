import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './padronizacao.css'
import HomeView from './Views/HomeView'
import InstitucionalView from './Views/InstitucionalView'
import ProjetosView from './Views/ProjetosView'
import DoacaoView from './Views/DoacaoView'
import PortalView from './Views/PortalView'
import SobreView from './Views/SobreView'
import FuncionariosView from './Views/Tabelas/Funcionarios/FuncionariosView'
import EditarFuncionarioView from './Views/Tabelas/Funcionarios/EditarFuncionarioView'
import CadastrarFuncionarioView from './Views/Tabelas/Funcionarios/CadastrarFuncionarioView'
import BeneficiariosView from './Views/Tabelas/Beneficiarios/BeneficiariosView'
import EditarBeneficiarioView from './Views/Tabelas/Beneficiarios/EditarBeneficiarioView'
import CadastrarBeneficiarioView from './Views/Tabelas/Beneficiarios/CadastrarBeneficiarioView'
import DoacoesView from './Views/Tabelas/Doacoes/DoacoesView'
import CadastrarDoacaoView from './Views/Tabelas/Doacoes/CadastrarDoacaoView'
import EditarDoacaoView from './Views/Tabelas/Doacoes/EditarDoacaoView'
import CadastrarEstoqueView from './Views/Tabelas/Estoque/CadastrarEstoqueView'
import EditarEstoqueView from './Views/Tabelas/Estoque/EditarEstoqueView'
import EstoqueView from './Views/Tabelas/Estoque/EstoqueView'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route Component={HomeView} path='/'/>
        <Route Component={InstitucionalView} path='/institucional'/>
        <Route Component={ProjetosView} path='/projetos'/>
        <Route Component={DoacaoView} path='/doacao'/>
        <Route Component={PortalView} path='/portal'/>
        <Route Component={SobreView} path='/sobre'/>
        <Route Component={FuncionariosView} path='/tabelas/funcionarios'/>
        <Route Component={EditarFuncionarioView} path="/funcionarios/:id" />
        <Route Component={CadastrarFuncionarioView} path="/funcionarios/cadastro" />
        <Route Component={BeneficiariosView} path='/tabelas/beneficiarios'/>
        <Route Component={EditarBeneficiarioView} path="/beneficiarios/:id" />
        <Route Component={CadastrarBeneficiarioView} path="/beneficiarios/cadastro" />
        <Route Component={DoacoesView} path='/tabelas/doacoes'/>
        <Route Component={CadastrarDoacaoView} path="/doacoes/cadastro" />
        <Route Component={EditarDoacaoView} path="/doacoes/:id" />
        <Route Component={EstoqueView} path='/tabelas/estoque'/>
        <Route Component={CadastrarEstoqueView} path="/estoque/cadastro" />
        <Route Component={EditarEstoqueView} path="/estoque/:id" />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
