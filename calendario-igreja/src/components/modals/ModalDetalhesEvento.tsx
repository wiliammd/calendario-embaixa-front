import ModalBase from './ModalBase'

interface Evento {
    titulo: string;
    data: Date
    ministerio?: string
    status: 'ACEITO' | 'PENDENTE' | 'RECUSADO'
    type?: 'evento' | 'especial' | 'servir'
    horario?: string
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
                        <p><b>Data:</b> {evento.data.toLocaleDateString()}</p>
                        <p><b>Ministério:</b> {evento.ministerio || '-'}</p>
                        <p><b>Status:</b> {evento.status}</p>
                        <p><b>Horario:</b> {evento.horario}</p>
                    </div>
                ))}
            </div>
            <button onClick={onClose} className="btn btn-cancelar mt-2">Fechar</button>
        </ModalBase>
    )
}