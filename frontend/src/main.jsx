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
import CadastrarItensView from './Views/Tabelas/Itens/CadastrarItensView'
import EditarItensView from './Views/Tabelas/Itens/EditarItensView'
import ItensView from './Views/Tabelas/Itens/ItensView'
import CadastrarLotesView from './Views/Tabelas/Lotes/CadastrarLotesView'
import EditarLotesView from './Views/Tabelas/Lotes/EditarLotesView'
import LotesView from './Views/Tabelas/Lotes/LotesView'

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
        <Route Component={ItensView} path='/tabelas/itens'/>
        <Route Component={CadastrarItensView} path="/itens/cadastro" />
        <Route Component={EditarItensView} path="/itens/:id" />
        <Route Component={LotesView} path='/tabelas/lotes'/>
        <Route Component={CadastrarLotesView} path="/lotes/cadastro" />
        <Route Component={EditarLotesView} path="/lotes/:id" />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)