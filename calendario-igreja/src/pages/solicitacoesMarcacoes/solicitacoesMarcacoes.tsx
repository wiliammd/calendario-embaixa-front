import { useEffect, useState } from "react";
import "./solicitacoesMarcacoes.css";

// Simulação de backend
const todasSolicitacoesMock = [
  { id: 1, nome: "Maria", ministerio: "Mídia", data: "2025-12-02", status: "PENDENTE" },
  { id: 2, nome: "João", ministerio: "Mídia", data: "2025-12-03", status: "ACEITO" },
  { id: 3, nome: "Cleber", ministerio: "Diaconato", data: "2025-12-05", status: "RECUSADO" },
  { id: 4, nome: "Letícia", ministerio: "Kids", data: "2025-12-10", status: "PENDENTE" },
  { id: 5, nome: "Carlos", ministerio: "Mídia", data: "2025-11-20", status: "PENDENTE" },
  { id: 6, nome: "Bruno", ministerio: "Diaconato", data: "2025-12-15", status: "ACEITO" },
];

export default function SolicitacoesMarcacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // 🔹 Simula busca no backend
  const buscarSolicitacoes = () => {
    // Aqui você substituirá por algo real:
    // fetch(`/api/solicitacoes?mes=${mesSelecionado}&status=${statusFiltro}&page=${pagina}`)
    //   .then(r => r.json())
    //   .then(({ data, totalPaginas }) => { ... })

    const filtradas = todasSolicitacoesMock.filter((s) => {
      const mesData = new Date(s.data).getMonth() + 1;
      const matchMes = mesData === Number(mesSelecionado);
      const matchStatus = statusFiltro === "TODOS" ? true : s.status === statusFiltro;
      return matchMes && matchStatus;
    });

    // Simula paginação (2 por página)
    const inicio = (pagina - 1) * 2;
    const paginadas = filtradas.slice(inicio, inicio + 2);

    setSolicitacoes(paginadas);
    setTotalPaginas(Math.ceil(filtradas.length / 2));
  };

  useEffect(() => {
    buscarSolicitacoes();
  }, [statusFiltro, mesSelecionado, pagina]);

  const atualizarStatus = (id, novoStatus) => {
    setSolicitacoes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: novoStatus } : s))
    );
  };

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
                <td>{s.nome}</td>
                <td>{s.ministerio}</td>
                <td>{new Date(s.data).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status-badge ${
                      s.status === "ACEITO"
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
