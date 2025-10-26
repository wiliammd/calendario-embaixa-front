import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState, useRef, useEffect } from 'react'
import './home.css'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
})

const eventosMockados = [
  { titulo: '👥 Maria', inicio: new Date(2025, 11, 2), fim: new Date(2025, 11, 2), ministerio: 'Mídia', status: 'ACEITO' },
  { titulo: '👥 Joao', inicio: new Date(2025, 11, 2), fim: new Date(2025, 11, 2), ministerio: 'Mídia', status: 'PENDENTE' },
  { titulo: '👥 Cleber', inicio: new Date(2025, 11, 2), fim: new Date(2025, 11, 2), ministerio: 'Diaconato', status: 'RECUSADO' },
  { titulo: '👥 Ana', inicio: new Date(2025, 11, 2), fim: new Date(2025, 11, 2), ministerio: 'Diaconato', status: 'ACEITO' },
  { titulo: '👥 Xuxa', inicio: new Date(2025, 11, 2), fim: new Date(2025, 11, 2), ministerio: 'Diaconato', status: 'ACEITO' },
  { titulo: '👥 Xuxa', inicio: new Date(2025, 12, 2), fim: new Date(2025, 12, 2), ministerio: 'Kids', status: 'ACEITO' },
  { titulo: '👥 Letícia, Bruno e Maria', inicio: new Date(2025, 11, 5), fim: new Date(2025, 11, 5), status: 'PENDENTE' },
  { titulo: '👥 Comparecimento', inicio: new Date(2025, 11, 22), fim: new Date(2025, 11, 22), type: 'especial', status: 'PENDENTE' },
  { titulo: '🎉 Evento Especial', inicio: new Date(2025, 11, 5), fim: new Date(2025, 11, 5), type: 'evento', status: 'PENDENTE' },
  { titulo: '👥 Jalberto', inicio: new Date(2025, 11, 8, 0, 0), fim: new Date(2025, 11, 9, 23, 59), status: 'ACEITO' },
  { titulo: '👥 Carlos e Beatriz', inicio: new Date(2025, 11, 3, 19, 0), fim: new Date(2025, 11, 3, 20, 0), status: 'ACEITO' },
  { titulo: '👥 Maria', inicio: new Date(2025, 10, 21), fim: new Date(2025, 10, 21), ministerio: 'Mídia', status: 'ACEITO' },
  { titulo: '👥 Joao', inicio: new Date(2025, 10, 22), fim: new Date(2025, 10, 22), ministerio: 'Mídia', status: 'PENDENTE' },
  { titulo: '👥 Cleber', inicio: new Date(2025, 9, 23), fim: new Date(2025, 9, 23), ministerio: 'Diaconato', status: 'RECUSADO' },
  { titulo: '👥 Ana', inicio: new Date(2025, 9, 24), fim: new Date(2025, 9, 24), ministerio: 'Diaconato', status: 'ACEITO' },
  { titulo: '👥 Xuxa', inicio: new Date(2025, 9, 25), fim: new Date(2025, 9, 25), ministerio: 'Diaconato', status: 'ACEITO' },
  { titulo: '👥 Xuxa', inicio: new Date(2025, 9, 26), fim: new Date(2025, 9, 26), ministerio: 'Kids', status: 'ACEITO' },
]

type Evento = {
  titulo: string
  inicio: Date
  fim: Date
  ministerio?: string
  status: 'ACEITO' | 'PENDENTE' | 'RECUSADO'
  type?: 'evento' | 'especial' | 'servir'
}
export default function Home() {
  const [eventos, setEventos] = useState<Evento[]>(eventosMockados)
  const [dataAtual, setDataAtual] = useState(new Date())
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [novaData, setNovaData] = useState<Date | null>(null)
  const [novoTitulo, setNovoTitulo] = useState('')
  const [novoTipo, setNovoTipo] = useState('')
  const [novoMinisterio, setNovoMinisterio] = useState('')
  const [ministerios, setMinisterios] = useState([])
  const calendarRef = useRef(null)

  useEffect(() => {
    setMinisterios(['Mídia', 'Diaconato', 'Kids'])
  }, [])

  // 🔹 Filtra e ordena eventos
  const eventosVisiveis = eventos
    .filter((e) => e.status !== 'RECUSADO') // ❌ não mostra recusados
    .sort((a, b) => {
      if (a.type && !b.type) return -1
      if (!a.type && b.type) return 1
      return 0
    })

  const handleAddEvent = (e) => {
    e.preventDefault()
    if (!novoTitulo.trim()) return


    setEventos([...eventos, novoEvento])
    setNovoTitulo('')
    setNovoTipo('')
    setNovoMinisterio('')
    setNovaData(null)
  }

  return (
    <div className="container">
      <h1>📅 Calendário de Presenças</h1>

      <Calendar
        ref={calendarRef}
        localizer={localizer}
        events={eventosVisiveis}
        startAccessor="inicio"
        endAccessor="fim"
        date={dataAtual}
        selectable
        onSelectSlot={(slotInfo) => setNovaData(slotInfo.start)}
        onNavigate={(novaData) => setDataAtual(novaData)}
        onSelectEvent={(event) => setEventoSelecionado(event)}
        style={{
          height: '80vh',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '10px',
        }}
        popup
        views={['month']}
        messages={{
          month: 'Mês',
          today: 'Hoje',
          previous: 'Anterior',
          next: 'Próximo',
          agenda: 'Agenda',
          week: 'Semana',
          day: 'Dia',
          showMore: (total) => `+${total} mais`,
        }}
        eventPropGetter={(event) => {
          let style = {
            borderRadius: '5px',
            border: 'none',
            color: 'black',
            paddingLeft: '5px',
            paddingRight: '5px',
          }

          if (event.status === 'ACEITO') {
            style.backgroundColor = '#2ecc71' // verde
            style.color = 'white'
          } else if (event.status === 'PENDENTE') {
            style.backgroundColor = '#f1c40f' // amarelo
          }

          if (event.type === 'evento') {
            style.background = 'repeating-linear-gradient(45deg, #7FDBFF, #7FDBFF 10px, #2ecc71 10px, #2ecc71 20px)'
            style.color = 'white'
            style.border = '1px solid #0074D9'
          } else if (event.type === 'especial') {
            style.background = 'repeating-linear-gradient(45deg, #FFB347, #FFB347 10px, #FF7E5F 10px, #FF7E5F 20px)'
            style.color = 'white'
            style.border = '1px solid #FF4500'
          }

          return { style }
        }}
        components={{
          event: ({ event }) => <div titulo={event.titulo}>{event.titulo}</div>,
        }}
      />

      {/* Modal Detalhes */}
      {eventoSelecionado && (
        <div className="modal-overlay" onClick={() => setEventoSelecionado(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes do Evento</h2>
            <p><b>Título:</b> {eventoSelecionado.titulo}</p>
            <p><b>Início:</b> {eventoSelecionado.inicio.toLocaleDateString()}</p>
            <p><b>Término:</b> {eventoSelecionado.fim.toLocaleDateString()}</p>
            <p><b>Ministério:</b> {eventoSelecionado.ministerio}</p>
            <p><b>Status:</b> {eventoSelecionado.status}</p>
            <button onClick={() => setEventoSelecionado(null)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal Novo Evento */}
      {novaData && (
        <div className="modal-overlay" onClick={() => setNovaData(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-titulo">Novo Evento</h2>
            <form onSubmit={handleAddEvent} className="modal-form">
              <div className="form-group">
                <label>Título:</label>
                <input
                  type="text"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  placeholder="Ex: 👥 Reunião com equipe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipo (opcional):</label>
                <select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)}>
                  <option value="servir">Servir</option>
                  <option value="evento">Evento</option>
                  <option value="especial">Especial</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ministério (opcional):</label>
                <select
                  value={novoMinisterio}
                  onChange={(e) => setNovoMinisterio(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {ministerios.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <p className="selected-date">
                📅 <b>Data selecionada:</b> {novaData.toLocaleDateString()}
              </p>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Salvar</button>
                <button
                  type="button"
                  onClick={() => setNovaData(null)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
