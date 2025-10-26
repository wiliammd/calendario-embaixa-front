import { useEffect, useState } from "react";
import "./solicitacoesUsuarios.css";

type Usuario = {
  id: number
  nome: string
  email: string
  ministerio: string
  status: string
  ativo: boolean
}

// 🔹 Mock simulando resposta do backend
const usuariosMock = [
  { id: 1, nome: "Marcos Silva", email: "marcos@email.com", ministerio: "Mídia", status: "PENDENTE", ativo: true },
  { id: 2, nome: "Ana Souza", email: "ana@email.com", ministerio: "Louvor", status: "ACEITO", ativo: true },
  { id: 3, nome: "Paulo Oliveira", email: "paulo@email.com", ministerio: "Kids", status: "RECUSADO", ativo: false },
  { id: 4, nome: "Camila Torres", email: "camila@email.com", ministerio: "Diaconato", status: "PENDENTE", ativo: true },
  { id: 5, nome: "Lucas Andrade", email: "lucas@email.com", ministerio: "Mídia", status: "PENDENTE", ativo: false },
  { id: 6, nome: "Fernanda Lima", email: "fer@email.com", ministerio: "Louvor", status: "ACEITO", ativo: true },
];

export default function SolicitacoesUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const buscarUsuarios = () => {
    // 🔸 Simulação de backend filtrando e paginando
    let filtradas = usuariosMock.filter((u) =>
      statusFiltro === "TODOS" ? true : u.status === statusFiltro
    );

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      filtradas = filtradas.filter(
        (u) =>
          u.nome.toLowerCase().includes(termo) ||
          u.email.toLowerCase().includes(termo)
      );
    }

    const inicio = (pagina - 1) * 4;
    const paginadas = filtradas.slice(inicio, inicio + 4);

    setUsuarios(paginadas);
    setTotalPaginas(Math.ceil(filtradas.length / 4));
  };

  useEffect(() => {
    buscarUsuarios();
  }, [statusFiltro, busca, pagina]);
  // @ts-ignore
  const atualizarStatus = (id, novoStatus) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: novoStatus } : u))
    );
  };

  // @ts-ignore
  const alternarAtivo = (id) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, ativo: !u.ativo } : u
      )
    );
  };

  return (
    <div className="usuarios-container">
      <h1>👥 Solicitações de Usuários</h1>

      {/* 🔸 Barra de filtros e busca */}
      <div className="filtros">
        <div className="filtro-esq">
          <label>Status:</label>
          <select
            value={statusFiltro}
            onChange={(e) => {
              setStatusFiltro(e.target.value);
              setPagina(1);
            }}
          >
            <option value="TODOS">Todos</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="ACEITO">Aceitos</option>
            <option value="RECUSADO">Recusados</option>
          </select>
        </div>

        <div className="filtro-dir">
          <input
            type="text"
            placeholder="🔍 Buscar por nome ou e-mail..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
          />
        </div>
      </div>

      {/* 🔸 Tabela */}
      {usuarios.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <table className="usuarios-tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ministério</th>
              <th>Status</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.ministerio}</td>
                <td>
                  <span
                    className={`status-badge ${u.status === "ACEITO"
                      ? "status-aceito"
                      : u.status === "PENDENTE"
                        ? "status-pendente"
                        : "status-recusado"
                      }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`ativo-badge ${u.ativo ? "ativo-true" : "ativo-false"
                      }`}
                  >
                    {u.ativo ? "Ativo" : "Bloqueado"}
                  </span>
                </td>
                <td className="acoes">
                  <button
                    className="btn-aceitar"
                    onClick={() => atualizarStatus(u.id, "ACEITO")}
                    disabled={u.status === "ACEITO"}
                  >
                    ✅
                  </button>
                  <button
                    className="btn-recusar"
                    onClick={() => atualizarStatus(u.id, "RECUSADO")}
                    disabled={u.status === "RECUSADO"}
                  >
                    ❌
                  </button>
                  <button
                    className={`btn-bloquear ${u.ativo ? "bloquear" : "desbloquear"}`}
                    onClick={() => alternarAtivo(u.id)}
                  >
                    {u.ativo ? "🔒 Bloquear" : "🔓 Desbloquear"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🔸 Paginação */}
      {totalPaginas > 1 && (
        <div className="paginacao">
          <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}>
            ◀
          </button>
          <span>
            Página {pagina} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
