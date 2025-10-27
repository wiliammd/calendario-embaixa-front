import ModalBase from './ModalBase'

export default function ModalDetalhesEvento({ evento, onClose }) {
  if (!evento) return null

  return (
    <ModalBase isOpen={!!evento} onClose={onClose} title="Detalhes do Evento">
      <p><b>Título:</b> {evento.titulo}</p>
      <p><b>Início:</b> {evento.inicio.toLocaleDateString()}</p>
      <p><b>Término:</b> {evento.fim.toLocaleDateString()}</p>
      <p><b>Ministério:</b> {evento.ministerio || '-'}</p>
      <p><b>Status:</b> {evento.status}</p>
      <button onClick={onClose} className="btn btn-secondary mt-2">Fechar</button>
    </ModalBase>
  )
}
