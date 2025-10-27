import ModalBase from './ModalBase'

interface Evento {
    titulo: string
    inicio: Date
    fim: Date
    ministerio?: string
    status: 'ACEITO' | 'PENDENTE' | 'RECUSADO'
    type?: 'evento' | 'especial' | 'servir'
}

interface ModalDetalhesEventoProps {
    eventos: Evento[] | null
    onClose: () => void
}


export default function ModalDetalhesEvento({ eventos, onClose }: ModalDetalhesEventoProps) {
    if (!eventos || eventos.length === 0) return null

    return (
        <ModalBase isOpen={!!eventos} onClose={onClose} title="Detalhes do Dia">
            <div className="modal-lista-eventos">
                {eventos.map((evento, idx) => (
                    <div key={idx} className="modal-evento">
                        <p><b>Título:</b> {evento.titulo}</p>
                        <p><b>Início:</b> {evento.inicio.toLocaleDateString()}</p>
                        <p><b>Término:</b> {evento.fim.toLocaleDateString()}</p>
                        <p><b>Ministério:</b> {evento.ministerio || '-'}</p>
                        <p><b>Status:</b> {evento.status}</p>
                    </div>
                ))}
            </div>
            <button onClick={onClose} className="btn btn-secondary mt-2">Fechar</button>
        </ModalBase>
    )
}