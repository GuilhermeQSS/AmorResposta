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
import LoginView from './Views/LoginView'
import RotasProtegidas from './components/RotasProtegidas'

import FuncionariosView from './Views/Tabelas/Funcionarios/FuncionariosView'
import EditarFuncionarioView from './Views/Tabelas/Funcionarios/EditarFuncionarioView'
import CadastrarFuncionarioView from './Views/Tabelas/Funcionarios/CadastrarFuncionarioView'
import EncontrosView from './Views/Tabelas/Encontros/EncontrosView'
import EditarEncontroView from './Views/Tabelas/Encontros/EditarEncontroView'
import CadastrarEncontroView from './Views/Tabelas/Encontros/CadastrarEncontroView'
import BeneficiariosView from './Views/Tabelas/Beneficiarios/BeneficiariosView'
import EditarBeneficiarioView from './Views/Tabelas/Beneficiarios/EditarBeneficiarioView'
import CadastrarBeneficiarioView from './Views/Tabelas/Beneficiarios/CadastrarBeneficiarioView'
import DoacoesView from './Views/Tabelas/Doacoes/DoacoesView'
import CadastrarDoacaoView from './Views/Tabelas/Doacoes/CadastrarDoacaoView'
import EditarDoacaoView from './Views/Tabelas/Doacoes/EditarDoacaoView'
import CadastrarItensView from './Views/Tabelas/Itens/CadastrarItensView'
import EditarItensView from './Views/Tabelas/Itens/EditarItensView'
import ItensView from './Views/Tabelas/Itens/ItensView'
import DocumentosView from './Views/Tabelas/Documentos/DocumentosView'
import EditarDocumentoView from './Views/Tabelas/Documentos/EditarDocumentoView'
import CadastrarDocumentoView from './Views/Tabelas/Documentos/CadastrarDocumentoView'
import DespesasView from './Views/Tabelas/Despesas/DespesasView'
import EditarDespesaView from './Views/Tabelas/Despesas/EditarDespesaView'
import CadastrarDespesaView from './Views/Tabelas/Despesas/CadastrarDespesaView'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeView />} />
        <Route path='/institucional' element={<InstitucionalView />} />
        <Route path='/projetos' element={<ProjetosView />} />
        <Route path='/doacao' element={<DoacaoView />} />
        <Route path='/portal' element={<PortalView />} />
        <Route path='/sobre' element={<SobreView />} />
        <Route path='/login' element={<LoginView />} />

        <Route element={<RotasProtegidas />}>
          <Route path='/tabelas/funcionarios' element={<FuncionariosView />} />
          <Route path="/funcionarios/:id" element={<EditarFuncionarioView />} />
          <Route path="/funcionarios/cadastro" element={<CadastrarFuncionarioView />} />
          <Route path='/tabelas/encontros' element={<EncontrosView />} />
          <Route path="/encontros/:id" element={<EditarEncontroView />} />
          <Route path="/encontros/cadastro" element={<CadastrarEncontroView />} />
          <Route path='/tabelas/beneficiarios' element={<BeneficiariosView />} />
          <Route path="/beneficiarios/:id" element={<EditarBeneficiarioView />} />
          <Route path="/beneficiarios/cadastro" element={<CadastrarBeneficiarioView />} />
          <Route path='/tabelas/doacoes' element={<DoacoesView />} />
          <Route path="/doacoes/cadastro" element={<CadastrarDoacaoView />} />
          <Route path="/doacoes/:id" element={<EditarDoacaoView />} />
          <Route path='/tabelas/itens' element={<ItensView />} />
          <Route path="/itens/cadastro" element={<CadastrarItensView />} />
          <Route path="/itens/:id" element={<EditarItensView />} />
          <Route path='/tabelas/documentos' element={<DocumentosView />} />
          <Route path="/documentos/:id" element={<EditarDocumentoView />} />
          <Route path="/documentos/cadastro" element={<CadastrarDocumentoView />} />
          <Route path='/tabelas/despesas' element={<DespesasView />} />
          <Route path="/despesas/:id" element={<EditarDespesaView />} />
          <Route path="/despesas/cadastro" element={<CadastrarDespesaView />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
