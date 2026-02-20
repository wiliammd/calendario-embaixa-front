import { authService } from '../../services/authService';
import { tokenService } from '../../services/tokenService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { jwtDecode } from 'jwt-decode';

interface LoginProps {
  onLogin: (user: {
    nome: string
    email: string
    role: string
  }) => void
}

export type Usuario = {
  nome: string
  email: string
  role: 'ADMIN' | 'USER'
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = await authService.login(email, senha);

      tokenService.setTokens(data.accessToken, data.refreshToken);
      const decoded: Usuario = jwtDecode(data.accessToken)
      tokenService.setUsuario(decoded)

      onLogin({
        nome: decoded.nome,
        email: decoded.email,
        role: decoded.role
      });
      

      setErro('');
      navigate('/calendario');

    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Erro ao fazer login.';

      setErro(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 Login</h1>
        <form onSubmit={handleSubmit}>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
          />

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            required
          />

          {erro && <p className="erro">{erro}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="criar-conta">
          Ainda não tem conta?{' '}
          <span onClick={() => navigate('/cadastro')}>Criar conta</span>
        </p>
      </div>
    </div>
  )
}
