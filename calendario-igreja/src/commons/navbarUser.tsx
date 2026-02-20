import { Link, useLocation, useNavigate } from 'react-router-dom'
import './navbar.css'
import { tokenService } from '../services/tokenService' // ajuste o caminho se necessário

export default function NavbarUser() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    tokenService.clearTokens()  // limpa access e refresh token
    navigate('/login', { replace: true }) // redireciona para login
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">📋 Painel do Usuário</div>

      <ul className="navbar-links">
        {/* 🔹 Logout */}
        <li>
          <button className="logout-button" onClick={handleLogout}>
            🔓 Sair
          </button>
        </li>
      </ul>
    </nav>
  )
}
