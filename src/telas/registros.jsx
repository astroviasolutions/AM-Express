import { useState } from 'react';
import { useSistema } from '../sistema/estado';
import { P, Qn, Xn } from '../lib/regras';
import { Ii_, L, Li_, V } from '../componentes/ui';

export var ps = ["Configurações alteradas", "Acesso alterado", "Acesso criado", "Cliente alterado", "Pagamento registrado", "Fatura fechada"];

export function Registros() {
  let {
      registros: e
    } = useSistema(),
    [t, n] = useState(""),
    r = e.filter(e => !t || Qn(`${e.por} ${e.acao} ${e.detalhe}`).includes(Qn(t)));
  return <><Ii_ sub="Quem fez o quê no sistema, do mais recente para o mais antigo. Mudanças de preço, de permissão e de dinheiro ficam marcadas.">Registros</Ii_><input value={t} onChange={e => n(e.target.value)} placeholder="Buscar por pessoa, ação ou código" aria-label="Buscar nos registros" className="mb-3 min-h-11 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm outline-none focus:border-sky sm:w-96" /><L>{r.length === 0 ? <Li_ titulo="Nada registrado" texto="As ações feitas no sistema aparecem aqui." /> : <ul className="divide-y divide-white/10">{r.slice(0, 150).map(e => <li key={e.id} className="grid gap-1 py-3 text-sm sm:grid-cols-[150px_1fr_1.4fr] sm:items-center sm:gap-4"><time className="text-xs text-on2">{P(e.em)} · {Xn(e.em)}</time><span className="flex flex-wrap items-center gap-2"><b>{e.por}</b>{ps.includes(e.acao) ? <V tone="warn">{e.acao}</V> : <span className="text-on2">{e.acao}</span>}</span><span className="min-w-0 break-words text-on2">{e.detalhe}</span></li>)}</ul>}</L></>;
}

