import ModalBase from './ModalBase'

export default function ModalNovoEvento({
  isOpen,
  onClose,
  novaData,
  ministerios,
  novoTitulo,
  setNovoTitulo,
  novoTipo,
  setNovoTipo,
  novoMinisterio,
  setNovoMinisterio,
  handleAddEvent,
  isAdmin,
  novaHora,
  setNovaHora
}) {

  const precisaHorario = novoTipo === 'evento' || novoTipo === 'especial'|| novoTipo === 'reuniao'

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Novo Evento">
      <form onSubmit={handleAddEvent} className="modal-form">

        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            disabled={!isAdmin}
            value={novoTitulo}
            onChange={(e) => setNovoTitulo(e.target.value)}
            placeholder="Ex: 👥 Reunião com equipe"
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo:</label>
          <select
            value={novoTipo}
            onChange={(e) => setNovoTipo(e.target.value)}
            disabled={!isAdmin}
          >
            <option value="">Selecione...</option>
            <option value="servir">Servir</option>
            <option value="evento">Evento</option>
            <option value="especial">Especial</option>
            <option value="reuniao">Reunião</option>
          </select>
        </div>

        {/* 🔥 Mostra horário somente se necessário */}
        {precisaHorario && (
          <div className="form-group">
            <label>Horário:</label>
            <input
              type="time"
              value={novaHora}
              onChange={(e) => setNovaHora(e.target.value)}
              required
            />
          </div>
        )}

        {/* 🔥 Ministério só aparece se NÃO for evento */}
        {novoTipo === 'servir' && (
          <div className="form-group">
            <label>Ministério:</label>
            <select
              value={novoMinisterio}
              onChange={(e) => setNovoMinisterio(e.target.value)}
            >
              <option value="">Selecione...</option>
              {ministerios.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
        )}

        <p className="selected-date">
          📅 <b>Data:</b> {novaData?.toLocaleDateString()}
        </p>

        <div className="modal-buttons">
          <button type="submit" className="btn btn-primary">Salvar</button>
          <button type="button" onClick={onClose} className="btn-cancelar">Cancelar</button>
        </div>

      </form>
    </ModalBase>
  )
}
