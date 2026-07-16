import axios from 'axios';

import { obterToken, removerToken } from './token-storage';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://api-associacao-idosos.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await obterToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o token expirou/for inválido, o backend responde 401 — nesse caso não
// adianta manter um token velho salvo, então já limpamos aqui.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await removerToken();
    }
    return Promise.reject(error);
  },
);

export function extrairMensagemErro(erro: unknown, mensagemPadrao: string): string {
  if (axios.isAxiosError(erro)) {
    return erro.response?.data?.message || erro.response?.data?.erro || mensagemPadrao;
  }
  if (erro instanceof Error) return erro.message;
  return mensagemPadrao;
}
