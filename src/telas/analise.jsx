import { useMemo, useState } from 'react';
import { useSistema } from '../sistema/estado';
import { Ur, useToast } from '../sistema/acesso-toast';
import { Bo, Ho, Lo, Ro, Vo, zo } from '../lib/prazos-metas';
import { Us, os } from './financeiro';
import { N, P } from '../lib/regras';
import { B, H, Ii_, L, Li_, R, V } from '../componentes/ui';
import { Vs } from './caixa';
import { Mo_ } from './extrato';

export var hs = e => e == null ? "—" : `${Math.round(e * 100)}%`;

export function Gs({
  v: e,
  melhorSeCai: t = !1
}) {
  return e == null ? null : <small className={"block text-xs " + ((t ? e <= 0 : e >= 0) ? "text-ok" : "text-acc-hi")}>{e >= 0 ? "▲" : "▼"}{" "}{Math.abs(Math.round(e * 100))}% vs. período anterior</small>;
}

export function Analise() {
  let {
      remessas: e,
      clientes: t,
      equipe: n,
      cfg: r,
      usuario: i
    } = useSistema(),
    a = useToast(),
    [o, s] = useState("30"),
    [c, l] = useState(""),
    [u, d] = useState(""),
    [f, p] = useState(null),
    [m, h] = useState(null),
    g = Ur(i, "financeiro"),
    v = Ro(o),
    y = zo(v),
    b = useMemo(() => ({
      remessas: e,
      clientes: t,
      equipe: n
    }), [e, t, n]),
    x = useMemo(() => Bo(b, v, {
      cliente: c || void 0,
      motoboy: u || void 0
    }), [b, o, c, u]),
    S = useMemo(() => Bo(b, y, {
      cliente: c || void 0,
      motoboy: u || void 0
    }), [b, o, c, u]),
    C = n.filter(e => e.papel === "motorista"),
    w = Ho(e.filter(e => (!c || e.clienteId === c) && (!u || e.motoristaId === u))),
    T = Math.max(1, ...w.map(e => e.v)),
    E = (e, t) => p({
      titulo: e,
      ids: t
    }),
    D = Bo(b, Ro("mes")),
    ee = new Date(),
    te = ee.getDate(),
    ne = new Date(ee.getFullYear(), ee.getMonth() + 1, 0).getDate(),
    re = e => te >= 5 ? Math.round(e / te * ne) : null,
    ie = r.metaEntregas > 0 || g && r.metaResultadoC > 0,
    ae = async () => {
      try {
        let {
          painelPdf: e
        } = await import("../lib/pdf.js");
        await e({
          periodo: `${v.rotulo} (${P(v.ini.toISOString())} a ${P(v.fim.toISOString())})`,
          comparado: `${P(y.ini.toISOString())} a ${P(y.fim.toISOString())}`,
          indicadores: [["Entregas", String(x.entregues.length), hs(Vo(x.entregues.length, S.entregues.length))], ["Entregas no prazo", hs(x.noPrazoPct), hs(Vo(x.noPrazoPct, S.noPrazoPct))], ["Ocorrências", hs(x.ocorrPct), hs(Vo(x.ocorrPct, S.ocorrPct))], ...(g ? [["Receita", N(x.receitaC), hs(Vo(x.receitaC, S.receitaC))], ["Repasse a motoboys", N(x.repasseC), hs(Vo(x.repasseC, S.repasseC))], ["Margem", N(x.margemC), hs(Vo(x.margemC, S.margemC))]] : [])].map(e => e.map(e => e === "—" ? "sem dados" : e)),
          clientes: g ? x.porCliente.map(e => [e.cliente.nome, String(e.n), N(e.receitaC), N(e.repasseC), N(e.margemC)]) : [],
          motoboys: x.porMotoboy.map(e => [e.m.nome, String(e.entregas), hs(e.taxa), String(e.ocorrencias)]),
          falhas: [...x.falhasCidade.map(e => ["Cidade", e.k, String(e.n)]), ...x.falhasMotivo.map(e => ["Motivo", e.k, String(e.n)])]
        }), a("Relatório gerado", "Se o arquivo não abrir, procure em Downloads.");
      } catch (e) {
        a("Não foi possível gerar o PDF", e instanceof Error ? e.message : "Tente de novo.");
      }
    },
    oe = x.porCliente[0];
  return <><Ii_ sub="Comparativo do período com o anterior, margem por cliente, ranking de motoboys e onde está falhando. Dados de exemplo." acao={<R tone="line" onClick={ae}>Relatório (PDF)</R>}>Análise</Ii_><L tone="dark"><div className="flex flex-wrap gap-2" role="group" aria-label="Período">{Lo.map(([e, t]) => <button key={e} type="button" aria-pressed={o === e} onClick={() => s(e)} className={"min-h-11 rounded-full px-4 text-sm transition " + (o === e ? "bg-on text-frame" : "bg-white/10 text-on2 hover:text-on")}>{t}</button>)}</div><div className="mt-3 grid gap-3 sm:grid-cols-2"><B label="Cliente" value={c} onChange={e => l(e.target.value)} className={"[&_span]:sr-only"}><option value="">Todos os clientes</option>{t.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</B><B label="Motoboy" value={u} onChange={e => d(e.target.value)} className={"[&_span]:sr-only"}><option value="">Todos os motoboys</option>{C.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</B></div><p className="mt-2 text-xs text-on2">{P(v.ini.toISOString())} a {P(v.fim.toISOString())}, comparado com {P(y.ini.toISOString())} a {P(y.fim.toISOString())}.</p></L><div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><H i={0} rotulo="Entregas" valor={x.entregues.length} tone="acc" nota={`${x.entregues.length} no período`} onClick={() => E("Entregas do período", x.entregues.map(e => e.id))} /><H i={1} rotulo="Entregas no prazo" valor={hs(x.noPrazoPct)} nota={x.foraPrazo.length ? `${x.foraPrazo.length} fora do prazo` : "nenhuma fora do prazo"} onClick={x.foraPrazo.length ? () => E("Entregues fora do prazo", x.foraPrazo.map(e => e.id)) : void 0} /><H i={2} rotulo="Ocorrências" valor={hs(x.ocorrPct)} tone="light" nota={`${x.ocorrencias.length} processo(s)`} onClick={x.ocorrencias.length ? () => E("Processos com ocorrência", x.ocorrencias.map(e => e.id)) : void 0} />{g ? <H i={3} rotulo="Margem" valor={N(x.margemC)} nota={x.margemPct == null ? "sem entregas" : `${hs(x.margemPct)} da receita`} onClick={x.entregues.length ? () => E("Entregas que formam a margem", x.entregues.map(e => e.id)) : void 0} /> : <H i={3} rotulo="Margem" valor="••••" nota="sem permissão para ver valores" />}</div><div className="mt-1 grid gap-3 px-1 text-xs sm:grid-cols-2 xl:grid-cols-4"><Gs v={Vo(x.entregues.length, S.entregues.length)} /><Gs v={Vo(x.noPrazoPct, S.noPrazoPct)} /><Gs v={Vo(x.ocorrPct, S.ocorrPct)} melhorSeCai />{g && <Gs v={Vo(x.margemC, S.margemC)} />}</div>{g && <L className="mt-3" i={4}><h2 className="disp mb-3 text-xl">Quanto fica para a empresa</h2>{x.receitaC === 0 ? <p className="text-sm text-on2">Sem entregas neste período.</p> : <div className="grid items-center gap-3 text-center sm:grid-cols-[1fr_auto_1fr_auto_1fr]"><div><small className="block text-on2">Os clientes pagam</small><b className="disp text-2xl">{N(x.receitaC)}</b></div><span aria-hidden className="text-2xl text-on2">−</span><div><small className="block text-on2">Vai para os motoboys</small><b className="disp text-2xl">{N(x.repasseC)}</b></div><span aria-hidden className="text-2xl text-on2">=</span><div className="rounded-2xl bg-ok/15 p-3"><small className="block text-on2">Fica para a empresa</small><b className="disp text-2xl text-ok">{N(x.margemC)}</b></div></div>}</L>}<div className="mt-3 grid gap-3 lg:grid-cols-2"><L tone="dark" i={5}><h2 className="disp mb-1 text-xl">Entregas por dia</h2><p className="mb-3 text-xs text-on2">Últimos 14 dias.</p><div className="flex h-32 items-end gap-1.5" role="img" aria-label="Gráfico de entregas por dia">{w.map(e => <div key={e.k} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${e.k}: ${e.v}`}><span className="text-[10px] text-on2">{e.v || ""}</span><i className="block w-full rounded-t-md bg-gradient-to-t from-blue to-acc-hi" style={{
              height: `${Math.max(4, e.v / T * 100)}%`,
              opacity: e.v ? 1 : .25
            }} /><span className="text-[10px] text-on2">{e.l}</span></div>)}</div></L><L i={6}><h2 className="disp mb-1 text-xl">Meta do mês</h2><p className="mb-3 text-xs text-on2">Dia {te} de {ne}. A meta é definida em Configurações.</p>{ie ? <div className="space-y-4">{r.metaEntregas > 0 && <Vs rotulo="Entregas" atual={D.entregues.length} meta={r.metaEntregas} proj={re(D.entregues.length)} fmt={e => String(e)} />}{g && r.metaResultadoC > 0 && <Vs rotulo="Margem" atual={D.margemC} meta={r.metaResultadoC} proj={re(D.margemC)} fmt={N} />}</div> : <p className="text-sm text-on2">Nenhuma meta definida.</p>}</L>{g && <L tone="dark" i={7}><h2 className="disp mb-1 text-xl">Por cliente</h2>{oe && oe.pct >= .7 && x.porCliente.length > 1 && <V tone="warn">{oe.cliente.nome} concentra {hs(oe.pct)} da receita</V>}{x.porCliente.length === 0 ? <Li_ titulo="Sem entregas" texto="Nenhum cliente com entrega neste período." /> : <ul className="mt-2 divide-y divide-white/10 text-sm">{x.porCliente.map(e => <li key={e.cliente.id}><button type="button" onClick={() => E(`${e.cliente.nome} · entregas`, e.ids)} className="grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-xl px-1 py-3 text-left transition hover:bg-white/5"><span className="min-w-0"><b className="block truncate">{e.cliente.nome}</b><small className="text-on2">{e.n} entrega(s) · {hs(e.pct)} da receita</small></span><span className="text-right"><b>{N(e.margemC)}</b><small className="block text-on2">de {N(e.receitaC)}</small></span></button></li>)}</ul>}</L>}<L i={8}><h2 className="disp mb-1 text-xl">Ranking de motoboys</h2><p className="mb-2 text-xs text-on2">Taxa de entrega = entregas ÷ (entregas + ocorrências) no período.</p>{x.porMotoboy.length === 0 ? <Li_ titulo="Sem baixas" texto="Nenhum motoboy deu baixa neste período." /> : <ul className="divide-y divide-white/10 text-sm">{x.porMotoboy.map((e, t) => <li key={e.m.id}><button type="button" onClick={() => h(e.m.id)} className="grid w-full grid-cols-[24px_1fr_auto] items-center gap-2 rounded-xl px-1 py-3 text-left transition hover:bg-white/5"><span className="text-on2">{t + 1}</span><span className="min-w-0"><b className="block truncate">{e.m.nome}</b><small className="text-on2">{e.entregas} entrega(s) · {e.ocorrencias} ocorrência(s){g ? ` · ${N(e.ganhoC)}` : ""}</small></span><V tone={e.taxa == null ? "neu" : e.taxa >= .95 ? "ok" : e.taxa >= .85 ? "warn" : "bad"}>{hs(e.taxa)}</V></button></li>)}</ul>}</L><L tone="dark" i={9} className="lg:col-span-2"><h2 className="disp mb-1 text-xl">Onde está falhando</h2>{x.ocorrencias.length === 0 ? <p className="text-sm text-on2">Nenhuma ocorrência no período.</p> : <div className="grid gap-4 md:grid-cols-2">{[["Por cidade", x.falhasCidade], ["Por motivo", x.falhasMotivo]].map(([e, t]) => <div key={e}><h3 className="mb-1 text-sm font-semibold text-on2">{e}</h3><ul className="space-y-1 text-sm">{t.map(e => <li key={e.k}><button type="button" onClick={() => E(`${e.k} · ocorrências`, e.ids)} className="flex w-full items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2 text-left transition hover:bg-white/10"><span>{e.k}</span><b>{e.n} processo(s)</b></button></li>)}</ul></div>)}</div>}</L></div>{f && <Mo_ titulo={f.titulo} ids={f.ids} onClose={() => p(null)} />}{m && <Us id={m} onClose={() => h(null)} />}</>;
}

