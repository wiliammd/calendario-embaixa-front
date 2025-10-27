
import { useState } from 'react';
import './App.css';
import Login from './pages/login/login.tsx';
import Home from './pages/home/home';
import { Routes, Route, Navigate } from 'react-router-dom'
import Cadastro from './pages/cadastro/cadastro';
import SolicitacoesMarcacoes from './pages/solicitacoesMarcacoes/solicitacoesMarcacoes.tsx';
import SolicitacoesUsuarios from './pages/solicitacoesUsuarios/solicitacoesUsuarios.tsx';
import Navbar from './commons/navbar.tsx';




export default function App() {
  const [usuario, setUsuario] = useState(null)
  const isAdmin = usuario?.role === 'admin'

  return (
    <>{isAdmin && <Navbar />} {/* Navbar só aparece para administradores */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={setUsuario} />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/calendario"
          element={
            usuario ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/solicitacoes-marcacoes"
          element={
            isAdmin ? <SolicitacoesMarcacoes /> : <Navigate to="/calendario" />
          }
        />
        <Route
          path="/solicitacoes-cadastro"
          element={
            isAdmin ? <SolicitacoesUsuarios /> : <Navigate to="/calendario" />
          }
        />
        {/* Rota catch-all: qualquer caminho não definido */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}