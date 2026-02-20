import api from './api'

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  nome: string
  email: string
  role: string
}

export const authService = {
  login: async (email: string, senha: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      senha
    })

    return response.data
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', {
      refreshToken
    })

    return response.data
  }
}
