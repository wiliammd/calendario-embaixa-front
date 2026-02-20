import { useEffect, useState } from 'react';
import './App.css';
import Login from './pages/login/login.tsx';
import Home from './pages/home/home';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Cadastro from './pages/cadastro/cadastro';
import SolicitacoesMarcacoes from './pages/solicitacoesMarcacoes/solicitacoesMarcacoes.tsx';
import SolicitacoesUsuarios from './pages/solicitacoesUsuarios/solicitacoesUsuarios.tsx';
import Navbar from './commons/navbar.tsx';
import NavbarUser from './commons/navbarUser.tsx';
import type { Usuario } from './services/tokenService';

export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true); // 👈 novo estado
  const location = useLocation();

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");

    if (usuarioStorage) {
      try {
        const decoded: Usuario = JSON.parse(usuarioStorage);
        if (decoded.email) {
          setUsuario(decoded);
        }
      } catch (err) {
        console.error("Erro ao ler usuário do localStorage", err);
      }
    }

    setLoading(false); // 👈 terminou de carregar
  }, []);

  if (loading) {
    return null; // ou um spinner
  }

  const isAdmin = usuario?.role === 'ADMIN';
  const isUser = usuario?.role === 'USER';

  const mostrarNavbar =
    usuario &&
    location.pathname !== '/login' &&
    location.pathname !== '/cadastro';

  return (
    <>
      {mostrarNavbar && (isAdmin ? <Navbar /> : <NavbarUser />)}

      <Routes>
        <Route
          path="/"
          element={usuario ? <Navigate to="/calendario" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login onLogin={setUsuario} />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/calendario"
          element={usuario ? <Home usuario={usuario} /> : <Navigate to="/login" />}
        />
        <Route
          path="/solicitacoes-marcacoes"
          element={isAdmin ? <SolicitacoesMarcacoes /> : <Navigate to="/calendario" />}
        />
        <Route
          path="/solicitacoes-cadastro"
          element={isAdmin ? <SolicitacoesUsuarios /> : <Navigate to="/calendario" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}