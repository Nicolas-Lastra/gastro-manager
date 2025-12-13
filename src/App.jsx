import './App.css'
import Sidebar from './components/Sidebar.jsx'
import { Route, Routes } from 'react-router'
import { lazy } from 'react'

const Home = lazy(() => import('./pages/Home.jsx'))
const Menu = lazy(() => import('./pages/Menu.jsx'))
const TableManagement = lazy(() => import('./pages/TableManagement.jsx') )
const TableDetail = lazy(() => import('./pages/TableDetail.jsx'))

function App() {

  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/table-management"  element={<TableManagement /> } />
        <Route path="/table-management/:tableId" element={<TableDetail />} />
        <Route path="/menu" element={<Menu /> } />
      </Routes>
    </>
  )
}

export default App