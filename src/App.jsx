import './App.css'
import Sidebar from './components/Sidebar.jsx'
import { Route, Routes } from 'react-router'
import { lazy } from 'react'

const Home = lazy(() => import('./pages/Home.jsx'))
const Menu = lazy(() => import('./pages/Menu.jsx'))

function App() {

  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu /> } />
      </Routes>
    </>
  )
}

export default App