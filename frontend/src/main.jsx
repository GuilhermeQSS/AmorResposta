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
import DoacoesView from './Views/Tabelas/Doacoes/DoacoesView'
import CadastrarDoacaoView from './Views/Tabelas/Doacoes/CadastrarDoacaoView'
import EditarDoacaoView from './Views/Tabelas/Doacoes/EditarDoacaoView'

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
        <Route path='/tabelas/itens' element={<ItensView />} />
        <Route path="/itens/cadastro" element={<CadastrarItensView />} />
        <Route path="/itens/:id" element={<EditarItensView />} />
        <Route path='/tabelas/lotes' element={<LotesView />} />
        <Route path="/lotes/cadastro" element={<CadastrarLotesView />}/>
        <Route path="/lotes/:id" element={<EditarLotesView />}/>
        <Route path='/tabelas/doacoes' element={<DoacoesView />} />
        <Route path="/doacoes/cadastro" element={<CadastrarDoacaoView />} />
        <Route path="/doacoes/:id" element={<EditarDoacaoView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)