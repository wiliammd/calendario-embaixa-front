import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState, useRef, useEffect } from 'react'
import './home.css'
import ModalNovoEvento from '../../components/modals/ModalNovoEvento'
import ModalDetalhesEvento from '../../components/modals/ModalDetalhesEvento'

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
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null)
  const [novaData, setNovaData] = useState<Date | null>(null)
  const [novoTitulo, setNovoTitulo] = useState('')
  const [novoTipo, setNovoTipo] = useState('')
  const [novoMinisterio, setNovoMinisterio] = useState('')
  const [ministerios, setMinisterios] = useState<string[]>([])
  const [calendarKey, setCalendarKey] = useState(0)
  const calendarRef = useRef(null)

  useEffect(() => {
    setMinisterios(['Mídia', 'Diaconato', 'Kids'])
  }, [])

  const eventosVisiveis = eventos
    .filter((e) => e.status !== 'RECUSADO')
    .sort((a, b) => {
      if (a.type && !b.type) return -1
      if (!a.type && b.type) return 1
      return 0
    })

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoTitulo.trim() || !novaData) return

    const novoEvento: Evento = {
      titulo: novoTitulo,
      inicio: novaData,
      fim: novaData,
      type: (novoTipo as Evento['type']) || undefined,
      ministerio: novoMinisterio || undefined,
      status: 'PENDENTE',
    }

    setEventos([...eventos, novoEvento])
    setNovoTitulo('')
    setNovoTipo('')
    setNovoMinisterio('')
    setNovaData(null)
    fecharModal()
  }

  const fecharModal = () => {
    setNovaData(null)
    setEventoSelecionado(null)
    setCalendarKey((prev) => prev + 1) // força o calendário a resetar seleção
  }

  return (
    <div className="container">
      <h1>📅 Calendário de Presenças</h1>
      <Calendar
        key={calendarKey}
        ref={calendarRef}
        localizer={localizer}
        events={eventosVisiveis}
        startAccessor="inicio"
        endAccessor="fim"
        date={dataAtual}
        selectable
        longPressThreshold={1} // elimina delay no mobile
        onSelectSlot={(slotInfo) => setNovaData(slotInfo.start)}
        onSelectEvent={(event) => setEventoSelecionado(event)}
        onNavigate={(novaData) => setDataAtual(novaData)}
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
          let style: React.CSSProperties = {
            borderRadius: '5px',
            border: 'none',
            color: 'black',
            padding: '0 5px',
          }
          if (event.status === 'ACEITO') style.backgroundColor = '#2ecc71'
          else if (event.status === 'PENDENTE') style.backgroundColor = '#f1c40f'
          if (event.type === 'evento') style.background = 'repeating-linear-gradient(45deg, #7FDBFF, #7FDBFF 10px, #2ecc71 10px, #2ecc71 20px)'
          if (event.type === 'especial') style.background = 'repeating-linear-gradient(45deg, #FFB347, #FFB347 10px, #FF7E5F 10px, #FF7E5F 20px)'
          return { style }
        }}
        components={{
          // apenas renderiza o título, clique é gerenciado pelo Calendar
          event: ({ event }) => <div>{event.titulo}</div>,
        }}
      />

      <ModalDetalhesEvento
        evento={eventoSelecionado}
        onClose={fecharModal}
      />

      <ModalNovoEvento
        isOpen={!!novaData}
        onClose={fecharModal}
        novaData={novaData}
        ministerios={ministerios}
        novoTitulo={novoTitulo}
        setNovoTitulo={setNovoTitulo}
        novoTipo={novoTipo}
        setNovoTipo={setNovoTipo}
        novoMinisterio={novoMinisterio}
        setNovoMinisterio={setNovoMinisterio}
        handleAddEvent={handleAddEvent}
      />
    </div>
  )
}