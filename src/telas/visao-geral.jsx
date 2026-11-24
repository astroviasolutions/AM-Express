import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSistema } from '../sistema/estado';
import { Ur } from '../sistema/acesso-toast';
import { Bo, Ro } from '../lib/prazos-metas';
import { H, Ii_, L, Si_, V } from '../componentes/ui';
import { N, Zn, tr } from '../lib/regras';
import { Mo_ } from './extrato';

export var Uo = ["Ibaiti", "Cornélio Procópio", "Centenário do Sul", "Ponta Grossa", "Francisco Beltrão"];

export var Wo = ["pedido", "a_caminho", "coletado", "conferido", "em_rota", "entregue", "ocorrencia"];

export function Go({
  pct: e,
  cor: t = "url(#gradMeta)"
}) {
  let n = 2 * Math.PI * 52;
  return <svg viewBox="0 0 130 130" className="h-36 w-36 flex-none -rotate-90" role="img" aria-label={`${Math.round(e * 100)}% da meta`}><defs><linearGradient id="gradMeta" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3f69c9" /><stop offset="1" stopColor="#ff6b66" /></linearGradient></defs><circle cx="65" cy="65" r={52} fill="none" stroke="currentColor" strokeOpacity=".14" strokeWidth="13" /><circle cx="65" cy="65" r={52} fill="none" stroke={t} strokeWidth="13" strokeLinecap="round" strokeDasharray={n} strokeDashoffset={n * (1 - Math.min(1, e))} style={{
      transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)"
    }} /></svg>;
}

export function VisaoGeral() {
  let {
      remessas: e,
      clienteDe: t,
      clientes: n,
      equipe: r,
      cfg: i,
      usuario: a
    } = useSistema(),
    [o, s] = useState(null),
    c = (e, t) => s({
      titulo: e,
      ids: t.map(e => e.id)
    }),
    l = Ur(a, "financeiro"),
    u = new Date().toISOString().slice(0, 10),
    d = u.slice(0, 7),
    f = e.filter(e => e.status !== "cancelada"),
    p = f.filter(e => e.criadoEm.slice(0, 7) === d),
    m = p.reduce((e, t) => e + t.precoC, 0),
    h = t => e.filter(e => e.status === t).length,
    g = Math.max(1, ...Wo.map(h)),
    v = e.filter(e => e.criadoEm.slice(0, 10) === u),
    y = e.filter(e => !["entregue", "cancelada"].includes(e.status)),
    b = f.length ? Math.round(h("entregue") / f.length * 100) : 0,
    x = e.filter(e => e.status === "ocorrencia"),
    S = e => r.find(t => t.id === e)?.nome,
    C = useMemo(() => ({
      remessas: e,
      clientes: n,
      equipe: r
    }), [e, n, r]),
    w = useMemo(() => Bo(C, Ro("mes")), [C]),
    T = new Date(),
    E = T.getDate(),
    D = new Date(T.getFullYear(), T.getMonth() + 1, 0).getDate(),
    ee = i.metaEntregas,
    te = i.metaResultadoC,
    ne = ee ? w.entregues.length / ee : 0,
    re = te ? w.margemC / te : 0,
    ie = E >= 5 ? Math.round(w.entregues.length / E * D) : null,
    ae = ee > 0 || l && te > 0,
    oe = Ur(a, "configuracoes", "editar");
  return <><Ii_ sub="Hoje o piloto roda só na matriz. As outras filiais entram na próxima fase, sem mudar nada aqui." acao={<V tone="warn">Dados de exemplo</V>}>Visão geral</Ii_>{x.length > 0 && <L tone="acc" className="mb-3 !p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><div className="flex items-center gap-2"><span className="ping2 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-lg font-bold" aria-hidden>!</span><h2 className="disp text-2xl">{x.length}{" "}{x.length === 1 ? "ocorrência aberta" : "ocorrências abertas"}</h2></div><p className="mt-1 text-sm text-white/85">Entregas que não deram certo e esperam uma decisão da operação.</p><ul className="mt-3 space-y-1 text-sm">{x.slice(0, 3).map(e => <li key={e.id} className="truncate"><b>{e.ocorrencia?.motivo}</b> · {e.destinatario} · {e.cidade}{S(e.motoristaId) ? ` · ${S(e.motoristaId)}` : ""}</li>)}{x.length > 3 && <li className="text-white/85">e mais {x.length - 3}…</li>}</ul></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => c("Ocorrências abertas", x)} className="min-h-11 rounded-full bg-white px-5 text-sm font-semibold text-ink transition hover:opacity-90">Ver os processos</button>{Ur(a, "operacao") && <Link to="/op/ocorrencias" className="inline-flex min-h-11 items-center rounded-full bg-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/30">Resolver agora</Link>}</div></div></L>}<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><H i={0} rotulo="Remessas hoje" valor={v.length} nota={`${f.length} no total`} onClick={() => c("Remessas de hoje", v)} /><H i={1} rotulo="Em andamento" valor={y.length} tone="light" nota={`${h("em_rota")} em rota agora`} onClick={() => c("Em andamento", y)} /><H i={2} rotulo="Entregues" valor={`${b}%`} nota={`${h("entregue")} de ${f.length}`} onClick={() => c("Entregues", e.filter(e => e.status === "entregue"))} /><H i={3} rotulo="Faturamento do mês" valor={l ? N(m) : "••••"} tone="acc" nota={l ? `${p.length} remessa(s)` : "sem permissão para ver valores"} onClick={l ? () => c("Remessas do mês", p) : void 0} /></div><div className="mt-3 grid gap-3 lg:grid-cols-[.9fr_1.1fr]"><section style={{
        "--i": 4
      }} className="rise tema-escuro min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-g2 via-g1 to-g0 p-5 text-on sm:p-6" aria-label="Meta do mês"><div className="flex items-center justify-between gap-2"><h2 className="disp text-xl">Meta do mês</h2><span className="text-xs text-on2">dia {E} de {D}</span></div>{ae ? <div className="mt-3 flex flex-wrap items-center gap-5 sm:flex-nowrap"><div className="relative flex-none"><Go pct={ee ? ne : re} /><div className="absolute inset-0 grid place-items-center text-center"><div><b className="disp block text-3xl leading-none">{Math.round((ee ? ne : re) * 100)}%</b><small className="text-[11px] text-on2">{ee ? "das entregas" : "da margem"}</small></div></div></div><div className="min-w-0 flex-1 space-y-3 text-sm">{ee > 0 && <div><b className="block">{w.entregues.length} de {ee} entregas</b><small className="text-on2">{ie == null ? "A projeção aparece a partir do dia 5." : ie >= ee ? `Ritmo atual fecha em ${ie}: bate a meta.` : `Ritmo atual fecha em ${ie}: abaixo da meta.`}</small></div>}{l && te > 0 && <div><div className="mb-1 flex justify-between gap-2"><b>Margem</b><span>{N(w.margemC)} de {N(te)}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><i className="block h-full rounded-full bg-gradient-to-r from-blue to-acc-hi transition-all duration-1000" style={{
                  width: `${Math.min(100, Math.max(0, re * 100))}%`
                }} /></div></div>}{Ur(a, "analise") && <Link to="/dono/analise" className="inline-block text-xs font-semibold text-sky underline">Ver a análise completa</Link>}</div></div> : <div className="mt-4 flex items-center gap-5"><div className="grid h-36 w-36 flex-none place-items-center rounded-full border-[13px] border-dashed border-white/15 text-center text-xs text-on2">sem meta</div><div className="min-w-0 text-sm text-on2"><p>Defina uma meta de entregas e de margem para acompanhar o ritmo do mês aqui.</p>{oe ? <Link to="/dono/configuracoes" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-on px-5 text-sm font-semibold text-frame transition hover:opacity-90">Definir a meta</Link> : <p className="mt-2 text-xs">Peça ao dono para definir.</p>}</div></div>}</section><L i={5}><h2 className="disp mb-4 text-xl">Pacotes por etapa</h2><div className="space-y-3">{Wo.map(t => <button key={t} type="button" onClick={() => c(tr[t], e.filter(e => e.status === t))} aria-label={`${tr[t]}: ver os processos`} className="grid w-full grid-cols-[152px_minmax(0,1fr)_28px] items-center gap-3 rounded-xl py-1 text-left text-sm transition hover:bg-white/10"><Si_ s={t} /><div className="h-3 overflow-hidden rounded-full bg-white/10"><i className="block h-full rounded-full bg-gradient-to-r from-blue to-acc-hi transition-all duration-700" style={{
                width: `${h(t) / g * 100}%`
              }} /></div><b className="text-right">{h(t)}</b></button>)}</div></L></div><div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_.9fr]"><L i={6}><h2 className="disp mb-3 text-xl">Últimas remessas</h2><ul className="divide-y divide-white/10">{e.slice(0, 7).map(e => <li key={e.id} role="button" tabIndex={0} onClick={() => s({
            titulo: e.destinatario,
            ids: [e.id],
            inicial: e.id
          })} onKeyDown={t => t.key === "Enter" && s({
            titulo: e.destinatario,
            ids: [e.id],
            inicial: e.id
          })} className="grid cursor-pointer grid-cols-[1fr_auto] items-center gap-3 py-3 text-sm hover:bg-white/5 sm:grid-cols-[1.2fr_1fr_90px_auto]"><span className="min-w-0"><b className="block truncate">{t(e.clienteId)?.nome}</b><small className="block truncate text-on2">{e.destinatario}</small></span><span className="hidden truncate text-on2 sm:block">{e.cidade}</span><span className="hidden text-on2 sm:block">{Zn(e.criadoEm)}</span><Si_ s={e.status} /></li>)}</ul><p className="mt-3 text-xs text-on2">{n.length} clientes ativos no piloto.</p></L><L tone="dark" i={7}><h2 className="disp mb-3 text-xl">Filiais</h2><div className="space-y-2"><div className="flex items-center justify-between gap-3 rounded-2xl bg-ok/15 p-3 text-sm"><span className="min-w-0"><b className="block truncate">Santo Antônio da Platina</b><small className="text-on2">Matriz · piloto em andamento</small></span><V tone="ok">Ativa</V></div>{Uo.map(e => <div key={e} className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-white/15 p-3 text-sm"><span className="min-w-0 truncate text-on2">{e}</span><V>Próxima fase</V></div>)}</div></L></div>{o && <Mo_ titulo={o.titulo} ids={o.ids} inicial={o.inicial} onClose={() => s(null)} />}</>;
}

