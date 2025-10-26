import { Link, useLocation } from 'react-router-dom'
import './navbar.css'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-logo">📋 Painel do Administrador</div>

      <ul className="navbar-links">
        <li className={location.pathname === '/calendario' ? 'active' : ''}>
          <Link to="/calendario">🏠 Home</Link>
        </li>
        <li className={location.pathname === '/solicitacoes-marcacoes' ? 'active' : ''}>
          <Link to="/solicitacoes-marcacoes">📅 Solicitações de Marcações</Link>
        </li>
        <li className={location.pathname === '/solicitacoes-cadastro' ? 'active' : ''}>
          <Link to="/solicitacoes-cadastro">👥 Solicitações de Cadastro</Link>
        </li>
      </ul>
    </nav>
  )
}
