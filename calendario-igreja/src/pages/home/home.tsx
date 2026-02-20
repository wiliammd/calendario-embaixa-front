import { format, getDay, parse, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useRef, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import ModalBase from '../../components/modals/ModalBase'
import ModalDetalhesEvento from '../../components/modals/ModalDetalhesEvento'
import ModalNovoEvento from '../../components/modals/ModalNovoEvento'
import { eventService } from '../../services/EventoService'
import type { Usuario } from '../login/login'
import './home.css'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
})


type Evento = {
  titulo: string
  data: Date
  hora: string
  ministerio?: string
  status: 'ACEITO' | 'PENDENTE' | 'RECUSADO'
  tipo?: 'evento' | 'especial' | 'servir'
}
type Ministerio = {
  id: string;
  nome: string;
}

type PreModalData = {
  date: Date
  eventosDia: Evento[]
}

export default function Home({ usuario }: Usuario) {
  const atualUsuario = usuario
  const isAdmin = atualUsuario?.role === 'ADMIN'
  const isUser = atualUsuario?.role === 'USER'

  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [dataAtual, setDataAtual] = useState(new Date())
  const [novaHora, setNovaHora] = useState('')
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null)
  const [novaData, setNovaData] = useState<Date | null>(null)
  const [novoTitulo, setNovoTitulo] = useState('')
  const [novoTipo, setNovoTipo] = useState('')
  const [novoMinisterio, setNovoMinisterio] = useState('')
  const [ministerios, setMinisterios] = useState<Ministerio[]>([])
  const [calendarKey, setCalendarKey] = useState(0)
  const calendarRef = useRef(null)
  const [preModalData, setPreModalData] = useState<PreModalData | null>(null)


  useEffect(() => {
    carregarMinisterios()
    carregarEventos(dataAtual)
  }, []);

  const carregarMinisterios = async () => {
    try {
      const dados = await eventService.listarMinisterios()
      setMinisterios(dados)
    } catch (error) {
      console.error('Erro ao carregar ministérios')
    }
  }

  const eventosVisiveis = eventos
    .filter((e) => e.status !== 'RECUSADO')
    .sort((a, b) => {
      if (a.type && !b.type) return -1
      if (!a.type && b.type) return 1
      return 0
    });

  const carregarEventos = async (dataBase: Date) => {
    try {
      setLoading(true)

      const inicio = new Date(dataBase.getFullYear(), dataBase.getMonth(), 1)
      const fim = new Date(dataBase.getFullYear(), dataBase.getMonth() + 1, 0)

      const data = await eventService.listar(inicio, fim)

      const eventosConvertidos = data.map((ev: any) => ({
        ...ev,
        data: new Date(ev.data)
      }))

      setEventos(eventosConvertidos)
    } catch (error) {
      console.error('Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Função central para fechar qualquer modal
  const fecharModal = () => {
    setNovaData(null)
    setEventoSelecionado(null)
    setPreModalData(null)
    setCalendarKey((prev) => prev + 1)
  }
  // 🔹 Pré-modal: decide se o usuário quer ver detalhes ou criar evento
  const handleDayClick = (date: Date) => {
    const eventosDia = eventosVisiveis.filter(
      (ev) =>
        ev.data.toDateString() === date.toDateString() ||
        ev.data.toDateString() === date.toDateString()
    )

    if (eventosDia.length > 0) {
      setPreModalData({ date, eventosDia }) // abre pré-modal
    } else {
      setNovaData(date) // abre modal de criação direto
    }
  }


  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaData) return

    try {
      let tituloFinal = novoTitulo
      let tipoFinal = novoTipo

      // 🔐 REGRA: usuário comum
      if (isUser) {
        tituloFinal = `👥 ${usuario.nome}`
        tipoFinal = 'servir'
      }

      const payload = {
        titulo: tituloFinal,
        data: novaData,
        horario: novaHora || null,
        tipo: tipoFinal || null,
        ministerioId: tipoFinal === 'servir' ? novoMinisterio : null
      }

      await eventService.criar(payload)

      await carregarEventos(dataAtual)

      setNovoTitulo('')
      setNovoTipo('')
      setNovoMinisterio('')
      fecharModal()

    } catch (error) {
      console.error('Erro ao criar evento')
    }
  }

  return (
    <div className="container">
      <h1>📅 Calendário de Presenças</h1>

      <div className="calendar-wrapper">
        <Calendar
          key={calendarKey}
          ref={calendarRef}
          localizer={localizer}
          events={eventosVisiveis}
          startAccessor="data"
          endAccessor="data"
          date={dataAtual}
          selectable
          longPressThreshold={1}
          onSelectSlot={(slotInfo) => {
            const data = slotInfo.start
            const eventosDoDia = eventosVisiveis.filter(
              (ev) =>
                ev.data.toDateString() === data.toDateString()
            )

            setPreModalData({
              data,
              eventosDoDia
            })
          }}
          onSelectEvent={(event) => {
            setEventoSelecionado([event]) // abrir detalhe diretamente se clicar no evento
          }}
          onNavigate={(novaData) => {
            setDataAtual(novaData)
            carregarEventos(novaData)
          }}
          views={['month']}
          style={{ height: '80vh', backgroundColor: 'white', borderRadius: '10px', padding: '10px' }}
          popup
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

            if (event.status === 'ACEITO') style.backgroundColor = '#2ecc71'
            else if (event.status === 'PENDENTE') style.backgroundColor = '#f1c40f'

            if (event.tipo?.toLocaleLowerCase() === 'evento') {
              style.background =
                'repeating-linear-gradient(45deg, #7FDBFF, #7FDBFF 10px, #2ecc71 10px, #2ecc71 20px)'
              style.color = 'white'
              style.border = '1px solid #0074D9'
            } else if (event.tipo?.toLocaleLowerCase() === 'especial') {
              style.background =
                'repeating-linear-gradient(45deg, #FFB347, #FFB347 10px, #FF7E5F 10px, #FF7E5F 20px)'
              style.color = 'white'
              style.border = '1px solid #FF4500'
            } else if (event.tipo?.toLocaleLowerCase() === 'reuniao') {
              style.background =
                'repeating-linear-gradient(45deg, #9B59B6, #9B59B6 10px, #8E44AD 10px, #8E44AD 20px)'
              style.color = 'white'
              style.border = '1px solid #6C3483'
            }

            return { style }
          }}
          components={{
            event: ({ event }) => (
              <div onClick={() => setEventoSelecionado([event])}>
                {event.titulo}
              </div>
            ),
          }}
        />
      </div>

      {/* Pre Modal: Escolher entre Ver Detalhes ou Cadastrar */}
      {preModalData && (
        <ModalBase
          isOpen={!!preModalData}
          onClose={() => setPreModalData(null)}
          title={`📅 Dia ${preModalData.data.toLocaleDateString()}`}
        >
          <p>O que você deseja fazer neste dia?</p>
          <div className="modal-buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                setEventoSelecionado(preModalData.eventosDoDia)
                setPreModalData(null)
              }}
            >
              Ver Detalhes
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setNovaData(preModalData.data)
                setPreModalData(null)
              }}
            >
              Cadastrar
            </button>
          </div>
        </ModalBase>
      )}

      {/* Modal de Detalhes */}
      <ModalDetalhesEvento
        eventos={eventoSelecionado}
        onClose={() => setEventoSelecionado(null)}
      />

      {/* Modal de Novo Evento */}
      <ModalNovoEvento
        isOpen={!!novaData}
        onClose={() => setNovaData(null)}
        novaData={novaData}
        ministerios={ministerios}
        novoTitulo={isUser ? `👥 ${usuario.nome}` : novoTitulo}
        setNovoTitulo={setNovoTitulo}
        novoTipo={isUser ? 'servir' : novoTipo}
        setNovoTipo={setNovoTipo}
        novoMinisterio={novoMinisterio}
        novaHora={novaHora}
        setNovaHora={setNovaHora}
        setNovoMinisterio={setNovoMinisterio}
        handleAddEvent={handleAddEvent}
        isAdmin={isAdmin}
      />
    </div>
  )



}