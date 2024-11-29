import { HashRouter as Router, Route, Routes, useLocation, useParams } from 'react-router-dom'
import './assets/scss/global.scss';
import { i18Service } from './services/i18n-service';
import { AppHeader } from './cmps/AppHeader'
import { Home } from './views/Home';
import { Suppliers } from './views/Suppliers';
import { Items } from './views/Items';
import { Bills } from './views/Bills';
import { useEffect } from 'react';
import { Summary } from './views/Summary';
import { BillEdit } from './views/BillEdit';
import { Assemblage } from './views/Assemblage';
import { Quarterly } from './views/Quarterly';
import { Orders } from './views/Orders';


function App() {
  useEffect(() => {
    translate()
  }, [])

  const translate = () => {
    i18Service.setLang()
    i18Service.doTrans()
  }

  return (
    <Router>
      <div className="App">
        <AppHeader />
        <main className='main-container'>
          <Routes>
            <Route path="/suppliers" element={< Suppliers />} />
            <Route path="/items" element={< Items />} />
            <Route path="/bills" element={< Bills />} />
            <Route path="/bill/edit/:id" element={< BillEdit translate={translate} />} />
            <Route path="/bill/edit" element={< BillEdit translate={translate} />} />
            <Route path="/summary/:id" element={< Summary />} />
            <Route path="/summary" element={< Summary />} />
            <Route path="/assemblage" element={< Assemblage />} />
            <Route path="/quarterly" element={< Quarterly translate={translate}/>} />
            <Route path="/order" element={< Orders translate={translate}/>} />
            <Route path="/" element={< Home translate={translate} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
