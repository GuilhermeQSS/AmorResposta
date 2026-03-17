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
import FuncionarioView from './Views/Tabelas/FuncionarioView'
import BeneficiarioView from './Views/Tabelas/BeneficiarioView'

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
        <Route Component={FuncionarioView} path='/tabelas/funcionario'/>
        <Route Component={BeneficiarioView} path='/tabelas/beneficiario'/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
