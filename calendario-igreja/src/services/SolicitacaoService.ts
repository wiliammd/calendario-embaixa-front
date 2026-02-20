import api from "./api";

export interface SolicitacaoResponse {
  id: string;
  titulo: string;
  ministerio: string;
  ministerioId: string;

  data: string;
  status: "PENDENTE" | "ACEITO" | "RECUSADO";
}

export const solicitacaoService = {
  async listar(
    page: number,
    size: number,
    mes?: number,
    status?: string
  ) {
    return api.get("/eventos/solicitacoes", {
      params: {
        page,
        size,
        mes,
        status: status === "TODOS" ? undefined : status
      }
    });
  },

  async atualizarStatus(id: string, status: string) {
    return api.patch(`/eventos/${id}/status`, null, {
      params: { status }
    });
  }
};
