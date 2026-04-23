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
        </Route>
        
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
