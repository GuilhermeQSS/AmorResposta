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
import CadastrarItensView from './Views/Tabelas/Itens/CadastrarItensView'
import EditarItensView from './Views/Tabelas/Itens/EditarItensView'
import ItensView from './Views/Tabelas/Itens/ItensView'
import CadastrarEncontroView from './Views/Tabelas/Encontros/CadastrarEncontroView'
import EditarEncontroView from './Views/Tabelas/Encontros/EditarEncontroView'
import EncontrosView from './Views/Tabelas/Encontros/EncontrosView'
import DocumentosView from './Views/Tabelas/Documentos/DocumentosView'
import EditarDocumentoView from './Views/Tabelas/Documentos/EditarDocumentoView'
import CadastrarDocumentoView from './Views/Tabelas/Documentos/CadastrarDocumentoView'

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
        <Route Component={EncontrosView} path='/tabelas/encontros'/>
        <Route Component={EditarEncontroView} path="/encontros/:id" />
        <Route Component={CadastrarEncontroView} path="/encontros/cadastro" />
        <Route Component={BeneficiariosView} path='/tabelas/beneficiarios'/>
        <Route Component={EditarBeneficiarioView} path="/beneficiarios/:id" />
        <Route Component={CadastrarBeneficiarioView} path="/beneficiarios/cadastro" />
        <Route Component={DoacoesView} path='/tabelas/doacoes'/>
        <Route Component={CadastrarDoacaoView} path="/doacoes/cadastro" />
        <Route Component={EditarDoacaoView} path="/doacoes/:id" />
        <Route Component={ItensView} path='/tabelas/itens'/>
        <Route Component={CadastrarItensView} path="/itens/cadastro" />
        <Route Component={EditarItensView} path="/itens/:id" />
        <Route Component={BeneficiariosView} path='/tabelas/beneficiarios'/>
        <Route Component={EditarBeneficiarioView} path="/beneficiarios/:id" />
        <Route Component={CadastrarBeneficiarioView} path="/beneficiarios/cadastro" />
        <Route Component={DocumentosView} path='/tabelas/documentos'/>
        <Route Component={EditarDocumentoView} path="/documentos/:id" />
        <Route Component={CadastrarDocumentoView} path="/documentos/cadastro" />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
