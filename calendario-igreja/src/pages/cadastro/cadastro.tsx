import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './cadastro.css';
import { eventService, type Ministerio } from '../../services/EventoService';
import { usuarioService } from '../../services/UsuarioService';
import { toastSucesso } from '../../services/toast';

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [ministerio, setMinisterio] = useState('')
  const [ministerios, setMinisterios] = useState<Ministerio[]>([])
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const navigate = useNavigate()


  useEffect(() => {
    carregarMinisterios();
  }, [])

  const carregarMinisterios = async () => {
    try {
      const dados = await eventService.listarMinisterios()
      setMinisterios(dados)
    } catch (error) {
      console.error('Erro ao carregar ministérios')
    }
  }
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!nome || !email || !senha || !ministerio) {
    setErro("Preencha todos os campos.");
    return;
  }

  try {
    setErro("");

    await usuarioService.cadastrarUsuario({
      nome,
      email,
      senha,
      ministerioId: ministerio, // aqui é o UUID
    });

    setSucesso("Usuário cadastrado com sucesso! Aguarde aprovação do administrador.");
    toastSucesso("Usuário cadastrado com sucesso! Aguarde aprovação do administrador.");
    setTimeout(() => {
      navigate("/login");
    }, 1200);

  } catch (error: any) {
    console.error(error);

    if (error.response?.data?.message) {
      setErro(error.response.data.message);
    } else {
      setErro("Erro ao cadastrar usuário.");
      
    }
  }
};

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
              <option key={m.id} value={m.id}>
                {m.nome}
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
