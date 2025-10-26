import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './cadastro.css'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [ministerio, setMinisterio] = useState('')
  const [ministerios, setMinisterios] = useState([])
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const navigate = useNavigate()

  // 🔹 Simulação de busca dos ministérios no backend
  useEffect(() => {
    // Exemplo de futuro fetch: fetch('/api/ministerios').then(r => r.json()).then(setMinisterios)
    setMinisterios(['Mídia', 'Diaconato', 'Kids', 'Louvor'])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!nome || !email || !senha || !ministerio) {
      setErro('Preencha todos os campos.')
      return
    }

    setErro('')
    setSucesso('Usuário cadastrado com sucesso!')

    // 🔹 Simula envio ao backend
    console.log({
      nome,
      email,
      senha,
      ministerio
    })

    setTimeout(() => {
      navigate('/login')
    }, 1200)
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h1>📝 Cadastro</h1>
        <form onSubmit={handleSubmit}>
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome completo"
            required
          />

          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@email.com"
            required
          />

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />

          <label>Ministério</label>
          <select
            value={ministerio}
            onChange={(e) => setMinisterio(e.target.value)}
            required
          >
            <option value="">Selecione seu ministério...</option>
            {ministerios.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {erro && <p className="erro">{erro}</p>}
          {sucesso && <p className="sucesso">{sucesso}</p>}

          <button type="submit">Cadastrar</button>
        </form>

        <p className="voltar-login">
          Já tem conta?{' '}
          <span onClick={() => navigate('/login')}>Voltar ao login</span>
        </p>
      </div>
    </div>
  )
}
