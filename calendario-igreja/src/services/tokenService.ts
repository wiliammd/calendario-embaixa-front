export type Usuario = {
  nome: string;
  email: string;
  role: "ADMIN" | "USER";
};
export const tokenService = {
  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  setUsuario: (usuario: Usuario) => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
  },
};
