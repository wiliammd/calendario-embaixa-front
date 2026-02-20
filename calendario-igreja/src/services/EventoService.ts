import api from "./api"; // sua instância axios com interceptor

export interface EventoResponse {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  ministerio?: string;
  status: "ACEITO" | "PENDENTE" | "RECUSADO";
  tipo?: "evento" | "especial" | "servir" | "reuniao";
}

export interface Ministerio {
  id: string
  nome: string
}

export const eventService = {
  async listar(inicio: Date, fim: Date): Promise<EventoResponse[]> {
    const response = await api.get("/eventos", {
      params: {
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
      },
    });
    return response.data;
  },

  async listarMinisterios(): Promise<Ministerio[]> {
  const response = await api.get<Ministerio[]>("/ministerios");
  return response.data;
},

  async criar(evento: any) {
    const response = await api.post("/eventos", evento);
    return response.data;
  },
};
