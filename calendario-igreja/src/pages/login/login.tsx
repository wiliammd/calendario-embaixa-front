import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simulação de autenticação
    if (email === 'admin@teste.com' && senha === '1234') {
      setErro('')
      onLogin({
        nome: 'Administrador',
        email,
        role: 'admin', // 👈 aqui adicionamos a role do admin
      })
      navigate('/calendario')
    } else if (email === 'usuario@teste.com' && senha === '1234') {
      setErro('')
      onLogin({
        nome: 'Usuário Comum',
        email,
        role: 'user', // 👈 role normal (sem acesso ao menu)
      })
      navigate('/calendario')
    } else {
      setErro('E-mail ou senha inválidos.')
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

          <button type="submit">Entrar</button>
        </form>

        <p className="criar-conta">
          Ainda não tem conta?{' '}
          <span onClick={() => navigate('/cadastro')}>Criar conta</span>
        </p>
      </div>
    </div>
  )
}
