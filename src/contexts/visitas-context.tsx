import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { extrairMensagemErro } from '@/services/api-client';
import { atualizarVisitaRequest, criarVisita, deletarVisitaRequest, listarVisitas } from '@/services/visitas-api';
import type { Visita, VisitaFormValues } from '@/types/visita';

interface VisitasContextValue {
    visitas: Visita[];
    carregando: boolean;
    erro: string | null;
    recarregar: () => Promise<void>;
    listarVisita: (id: string) => Visita | undefined;
    adicionarVisita: (dados: VisitaFormValues) => Promise<Visita>;
    atualizarVisita: (id: string, dados: VisitaFormValues) => Promise<Visita>;
    removerVisita: (id: string) => Promise<void>;
}

const VisitasContext = createContext<VisitasContextValue | null>(null);

export function VisitasProvider({ children }: PropsWithChildren) {
    const [visitas, setVisitas] = useState<Visita[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const recarregar = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            const lista = await listarVisitas();
            setVisitas(lista);
        } catch (e) {
            setErro(extrairMensagemErro(e, 'Erro ao carregar visitas.'));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        recarregar();
    }, [recarregar]);

    const listarVisita = useCallback((id: string) => visitas.find((visita) => visita.id === id), [visitas]);

    const adicionarVisita = useCallback(async (dados: VisitaFormValues) => {
        const novoVisita = await criarVisita(dados);
        setVisitas((prev) => [novoVisita, ...prev]);
        return novoVisita;
    }, []);

    const atualizarVisita = useCallback(async (id: string, dados: VisitaFormValues) => {
        const visitaAtualizado = await atualizarVisitaRequest(id, dados);
        setVisitas((prev) => prev.map((visita) => (visita.id === id ? visitaAtualizado : visita)));
        return visitaAtualizado;
    }, []);

    const removerVisita = useCallback(async (id: string) => {
        await deletarVisitaRequest(id);
        setVisitas((prev) => prev.filter((visita) => visita.id !== id));
    }, []);

    const value = useMemo(
        () => ({
            visitas,
            carregando,
            erro,
            recarregar,
            listarVisita,
            adicionarVisita,
            atualizarVisita,
            removerVisita,
        }),
        [visitas, carregando, erro, recarregar, listarVisita, adicionarVisita, atualizarVisita, removerVisita],
    );

    return <VisitasContext.Provider value={value}>{children}</VisitasContext.Provider>;
}

export function useVisitas() {
    const context = useContext(VisitasContext);
    if (!context) {
        throw new Error('useVisitas deve ser usado dentro de um VisitasProvider');
    }
    return context;
}