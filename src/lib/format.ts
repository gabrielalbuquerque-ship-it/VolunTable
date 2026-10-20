const dateFmt = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });
const stampFmt = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" });
const isoDayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });

/** Formata uma coluna `date` (YYYY-MM-DD) sem deslocamento de fuso. */
export function formatDate(isoDate: string) {
  return dateFmt.format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatTimestamp(iso: string) {
  return stampFmt.format(new Date(iso));
}

/** Data de hoje (YYYY-MM-DD) no fuso de referência da operação. */
export function todayIso() {
  return isoDayFmt.format(new Date());
}
