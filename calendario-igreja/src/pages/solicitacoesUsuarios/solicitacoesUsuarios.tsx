import { useEffect, useState } from "react";
import "./solicitacoesUsuarios.css";
import { usuarioService } from "../../services/UsuarioService";

type Usuario = {
  id: string;
  nome: string
  email: string
  ministerioNome: string
  ministerioId: string
  status: string
  ativo: boolean
  role: "ADMIN" | "USER"
}


export default function SolicitacoesUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const buscarUsuarios = async () => {
    try {
      const response = await usuarioService.listar(
        pagina - 1, // backend começa do 0
        4,
        statusFiltro,
        busca
      );

      setUsuarios(response.content);
      setTotalPaginas(response.totalPages);

    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, [statusFiltro, busca, pagina]);


  const tornarAdmin = async (id: string, admin: boolean) => {
    try {
      await usuarioService.tornarAdmin(id, admin);
      buscarUsuarios();
    } catch (error) {
      console.error("Erro ao tornar admin", error);
    }
  };

  const atualizarStatus = async (id: string, novoStatus: string) => {
  try {
    await usuarioService.atualizarStatus(id, novoStatus);
    buscarUsuarios();
  } catch (error) {
    console.error("Erro ao atualizar status", error);
  }
};

const alternarAtivo = async (id: string, ativoAtual: boolean) => {
  try {
    await usuarioService.atualizarAtivo(id, ativoAtual);
    buscarUsuarios();
  } catch (error) {
    console.error("Erro ao alterar ativo", error);
  }
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
            <option value="APROVADO">Aprovados</option>
            <option value="REJEITADO">Rejeitados</option>
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
                <td>{u.ministerioNome}</td>
                <td>
                  <span
                    className={`status-badge ${u.status === "APROVADO"
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
                    onClick={() => atualizarStatus(u.id, "APROVADO")}
                    disabled={u.status === "APROVADO"}
                  >
                    ✅
                  </button>
                  <button
                    className="btn-recusar"
                    onClick={() => atualizarStatus(u.id, "REJEITADO")}
                    disabled={u.status === "REJEITADO"}
                  >
                    ❌
                  </button>
                  <button
                    className={`btn-bloquear ${u.ativo ? "bloquear" : "desbloquear"}`}
                    onClick={() => alternarAtivo(u.id, !u.ativo)}
                  >
                    {u.ativo ? "🔒 Bloquear" : "🔓 Desbloquear"}
                  </button>

                  <button
                    className={`btn-role ${u.role === "ADMIN" ? "remover-admin" : "tornar-admin"}`}
                    onClick={() => tornarAdmin(u.id, u.role === "ADMIN" ? false: true)}
                  >
                    {u.role === "ADMIN" ? "⬇ Remover Admin" : "⭐ Tornar Admin"}
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
