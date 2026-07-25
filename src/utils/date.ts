export function extrairPartesData(valor?: string | null): { ano: string; mes: string; dia: string } | null {
  if (!valor) return null;

  const texto = valor.trim();
  if (!texto) return null;

  const matchIso = texto.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
  if (matchIso) {
    return { ano: matchIso[1], mes: matchIso[2], dia: matchIso[3] };
  }

  const matchBrasileiro = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (matchBrasileiro) {
    return { ano: matchBrasileiro[3], mes: matchBrasileiro[2], dia: matchBrasileiro[1] };
  }

  return null;
}

export function formatarDataExibicao(valor?: string | null): string | null {
  const partes = extrairPartesData(valor);
  if (!partes) return valor ?? null;
  return `${partes.dia}/${partes.mes}/${partes.ano}`;
}

export function normalizarDataParaInput(valor?: string | null): string {
  const partes = extrairPartesData(valor);
  if (!partes) return '';
  return `${partes.ano}-${partes.mes}-${partes.dia}`;
}

export function paraDataDate(valor?: string | null): Date {
  const partes = extrairPartesData(valor);
  if (!partes) return new Date();

  const ano = Number(partes.ano);
  const mes = Number(partes.mes);
  const dia = Number(partes.dia);

  if (!ano || !mes || !dia) return new Date();
  return new Date(ano, mes - 1, dia);
}
