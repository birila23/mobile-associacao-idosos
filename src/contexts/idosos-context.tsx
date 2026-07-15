import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import {
  atualizarIdosoRequest,
  buscarIdoso,
  criarIdoso,
  deletarIdosoRequest,
  listarIdosos,
} from '@/services/idosos-api';
import type { Idoso, IdosoFormValues } from '@/types/idoso';

interface IdososContextValue {
  idosos: Idoso[];
  carregando: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
  getIdoso: (id: string) => Idoso | undefined;
  buscarIdosoRemoto: (id: string) => Promise<Idoso>;
  adicionarIdoso: (dados: IdosoFormValues) => Promise<Idoso>;
  atualizarIdoso: (id: string, dados: IdosoFormValues) => Promise<Idoso>;
  removerIdoso: (id: string) => Promise<void>;
}

const IdososContext = createContext<IdososContextValue | null>(null);

export function IdososProvider({ children }: PropsWithChildren) {
  const [idosos, setIdosos] = useState<Idoso[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const lista = await listarIdosos();
      setIdosos(lista);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar idosos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const getIdoso = useCallback((id: string) => idosos.find((idoso) => idoso.id === id), [idosos]);

  const buscarIdosoRemoto = useCallback(async (id: string) => {
    const idoso = await buscarIdoso(id);
    setIdosos((prev) => {
      const existe = prev.some((item) => item.id === id);
      return existe ? prev.map((item) => (item.id === id ? idoso : item)) : [idoso, ...prev];
    });
    return idoso;
  }, []);

  const adicionarIdoso = useCallback(async (dados: IdosoFormValues) => {
    const novoIdoso = await criarIdoso(dados);
    setIdosos((prev) => [novoIdoso, ...prev]);
    return novoIdoso;
  }, []);

  const atualizarIdoso = useCallback(async (id: string, dados: IdosoFormValues) => {
    const idosoAtualizado = await atualizarIdosoRequest(id, dados);
    setIdosos((prev) => prev.map((idoso) => (idoso.id === id ? idosoAtualizado : idoso)));
    return idosoAtualizado;
  }, []);

  const removerIdoso = useCallback(async (id: string) => {
    await deletarIdosoRequest(id);
    setIdosos((prev) => prev.filter((idoso) => idoso.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      idosos,
      carregando,
      erro,
      recarregar,
      getIdoso,
      buscarIdosoRemoto,
      adicionarIdoso,
      atualizarIdoso,
      removerIdoso,
    }),
    [idosos, carregando, erro, recarregar, getIdoso, buscarIdosoRemoto, adicionarIdoso, atualizarIdoso, removerIdoso],
  );

  return <IdososContext.Provider value={value}>{children}</IdososContext.Provider>;
}

export function useIdosos() {
  const context = useContext(IdososContext);
  if (!context) {
    throw new Error('useIdosos deve ser usado dentro de um IdososProvider');
  }
  return context;
}
