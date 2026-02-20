import {  useState, useEffect } from "react";
import "./solicitacoesMarcacoes.css";
import { solicitacaoService, type SolicitacaoResponse } from "../../services/SolicitacaoService";

export default function SolicitacoesMarcacoes() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoResponse[]>([]);
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const buscarSolicitacoes = async () => {
    try {
      const response = await solicitacaoService.listar(
        pagina - 1,
        5,
        mesSelecionado,
        statusFiltro
      );

      setSolicitacoes(response.data.content);
      setTotalPaginas(response.data.totalPages);
    } catch (error) {
      console.error("Erro ao buscar solicitações", error);
    }
  };

  const atualizarStatus = async (id: string, novoStatus: string) => {
    try {
      await solicitacaoService.atualizarStatus(id, novoStatus);
      buscarSolicitacoes();
    } catch (error) {
      console.error("Erro ao atualizar status", error);
    }
  };

  useEffect(() => {
      buscarSolicitacoes();
    }, [statusFiltro, mesSelecionado, pagina]);

  const meses = [
    { num: 1, nome: "Janeiro" },
    { num: 2, nome: "Fevereiro" },
    { num: 3, nome: "Março" },
    { num: 4, nome: "Abril" },
    { num: 5, nome: "Maio" },
    { num: 6, nome: "Junho" },
    { num: 7, nome: "Julho" },
    { num: 8, nome: "Agosto" },
    { num: 9, nome: "Setembro" },
    { num: 10, nome: "Outubro" },
    { num: 11, nome: "Novembro" },
    { num: 12, nome: "Dezembro" },
  ];

  return (
    <div className="solicitacoes-container">
      <h1>📋 Solicitações de Marcações</h1>

      {/* 🔸 Filtros */}
      <div className="filtros">
        <div>
          <label>Mês: </label>
          <select
            value={mesSelecionado}
            onChange={(e) => {
              setMesSelecionado(Number(e.target.value));
              setPagina(1);
            }}
          >
            {meses.map((m) => (
              <option key={m.num} value={m.num}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Status: </label>
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
      </div>

      {/* 🔸 Tabela */}
      {solicitacoes.length === 0 ? (
        <p>Nenhuma solicitação encontrada.</p>
      ) : (
        <table className="solicitacoes-tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ministério</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>

            {solicitacoes.map((s) => (
              <tr key={s.id}>
                <td>{s.titulo}</td>
                <td>{s.ministerio}</td>
                <td>{new Date(s.data).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status-badge ${s.status === "ACEITO"
                      ? "status-aceito"
                      : s.status === "PENDENTE"
                        ? "status-pendente"
                        : "status-recusado"
                      }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="acoes">
                  <button
                    className="btn-aceitar"
                    onClick={() => atualizarStatus(s.id, "ACEITO")}
                    disabled={s.status === "ACEITO"}
                  >
                    ✅
                  </button>
                  <button
                    className="btn-recusar"
                    onClick={() => atualizarStatus(s.id, "RECUSADO")}
                    disabled={s.status === "RECUSADO"}
                  >
                    ❌
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
