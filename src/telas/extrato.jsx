import { useState } from 'react';
import { useSistema } from '../sistema/estado';
import { Di_, H, Ii_, L, Li_, Si_ } from '../componentes/ui';
import { Lo_ } from './minhas-remessas';
import { N, P, Xn, fr } from '../lib/regras';

export function Mo_({
  titulo: e,
  ids: t,
  inicial: n,
  onClose: r
}) {
  let {
      remessas: i,
      clienteDe: a
    } = useSistema(),
    [o, s] = useState(n ?? null),
    c = i.filter(e => t.includes(e.id)),
    l = o ? i.find(e => e.id === o) : void 0;
  return <Di_ aberto onFechar={r} titulo={l ? l.destinatario : e} largo>{l ? <div className="space-y-3">{t.length > 1 && <button type="button" className="min-h-11 text-sm font-medium text-blue underline" onClick={() => s(null)}>← Voltar para a lista</button>}<Lo_ id={l.id} /></div> : <><p className="mb-3 text-sm text-ink/60">{c.length}{" "}{c.length === 1 ? "processo" : "processos"}. Toque em um para ver os detalhes.</p>{c.length === 0 ? <p className="rounded-2xl bg-ink/5 p-4 text-sm text-ink/70">Nada neste grupo.</p> : <ul className="space-y-2">{c.slice(0, 200).map(e => <li key={e.id}><button type="button" onClick={() => s(e.id)} className="grid min-h-14 w-full grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-ink/5 px-4 py-2 text-left text-ink transition hover:bg-ink/10"><span className="min-w-0"><b className="block truncate">{e.destinatario}</b><small className="text-ink/60">{a(e.clienteId)?.nome} · {e.origem} → {e.cidade} · {P(e.criadoEm)}</small></span><Si_ s={e.status} /></button></li>)}</ul>}{c.length > 200 && <p className="mt-2 text-xs text-ink/60">Mostrando 200 de {c.length}.</p>}</>}</Di_>;
}

export function Extrato() {
  let {
      minhasRemessas: e,
      faturas: t,
      usuario: n
    } = useSistema(),
    [r, i] = useState(null),
    a = fr(e, n.clienteId),
    o = a.reduce((e, t) => e + t.precoC, 0),
    s = t.filter(e => e.clienteId === n.clienteId);
  return <><Ii_ sub="O que ainda não foi fechado em fatura. Inclui pedidos em andamento. Valores de exemplo.">Extrato</Ii_><div className="grid gap-3 sm:grid-cols-3"><H i={0} rotulo="A faturar" valor={N(o)} nota="até o próximo fechamento" tone="acc" onClick={() => i({
        titulo: "A faturar",
        ids: a.map(e => e.id)
      })} /><H i={1} rotulo="Remessas" valor={a.length} nota={`${a.reduce((e, t) => e + t.volumes, 0)} volume(s)`} onClick={() => i({
        titulo: "Remessas sem fatura",
        ids: a.map(e => e.id)
      })} /><H i={2} rotulo="Ticket médio" valor={a.length ? N(Math.round(o / a.length)) : "—"} tone="light" /></div><div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_.7fr]"><L i={3}><h2 className="disp mb-3 text-xl">Lançamentos</h2>{a.length === 0 ? <Li_ titulo="Sem lançamentos" texto="As remessas ainda sem fatura aparecem aqui." /> : <ul className="divide-y divide-white/10">{a.map(e => <li key={e.id} role="button" tabIndex={0} onClick={() => i({
            titulo: e.destinatario,
            ids: [e.id],
            inicial: e.id
          })} onKeyDown={t => t.key === "Enter" && i({
            titulo: e.destinatario,
            ids: [e.id],
            inicial: e.id
          })} className="grid cursor-pointer grid-cols-[1fr_auto] items-center gap-3 py-3 text-sm hover:bg-white/5 sm:grid-cols-[1.3fr_1fr_auto]"><span className="min-w-0"><b className="block truncate">{e.destinatario}</b><small className="font-mono text-xs text-on2">{e.codigo}</small></span><span className="hidden text-on2 sm:block">{e.cidade} · {P(e.criadoEm)}</span><b>{N(e.precoC)}</b></li>)}</ul>}</L><L tone="dark" i={4} className="h-fit"><h2 className="disp mb-3 text-xl">Faturas fechadas</h2>{s.length === 0 ? <Li_ titulo="Nenhuma fatura" texto="Quando a AM fechar o período, a fatura aparece aqui." /> : <ul className="divide-y divide-white/10 text-sm">{s.map(e => <li key={e.id} className="flex items-center justify-between gap-3 py-3"><span><b className="block">{P(e.em)}{" "}{Xn(e.em)}</b><small className="text-on2">{e.remessas} remessa(s)</small></span><b>{N(e.totalC)}</b></li>)}</ul>}</L></div>{r && <Mo_ titulo={r.titulo} ids={r.ids} inicial={r.inicial} onClose={() => i(null)} />}</>;
}

