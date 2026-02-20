import api from "./api"; // sua instância axios com interceptor

export interface UsuarioResponse {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  ministerioId?: string;
  ministerioNome?: string;
  status: "ACEITO" | "PENDENTE" | "RECUSADO";
}

export const usuarioService = {
  async listar(page: number, size: number, status?: string, busca?: string) {
    const response = await api.get("/usuarios", {
      params: {
        page,
        size,
        status: status === "TODOS" ? undefined : status,
        busca: busca || undefined,
      },
    });
    return response.data;
  },

  async cadastrarUsuario(usuario: any): Promise<UsuarioResponse[]> {
    const response = await api.post("/usuarios/cadastro", usuario);
    return response.data;
  },

  async atualizarStatus(id: string, status: string) {
    return api.patch(`/usuarios/${id}/status`, null, {
      params: { status },
    });
  },

  async atualizarAtivo(id: string, ativo: boolean) {
    return api.patch(`/usuarios/${id}/ativo`, null, {
      params: { ativo },
    });
  },

  async tornarAdmin(id: string, admin: boolean) {
    return api.patch(`/usuarios/${id}/tornar-admin`, null, {
      params: { admin },
    });
  },
};
