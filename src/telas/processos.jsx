import { useMemo, useState } from 'react';
import { useSistema } from '../sistema/estado';
import { Ur, useToast } from '../sistema/acesso-toast';
import { N, P, Qn, atrasoDe, gr, rotuloAtraso, tr } from '../lib/regras';
import { B, Di_, Ii_, L, Li_, R, Si_, V } from '../componentes/ui';
import { Lo_ } from './minhas-remessas';
import { _o } from './fila-coletas';

export var bo = ["pedido", "a_caminho", "coletado", "conferido", "em_rota", "entregue", "ocorrencia", "cancelada"];

export var xo = [["todos", "Todo o período"], ["hoje", "Hoje"], ["7", "Últimos 7 dias"], ["30", "Últimos 30 dias"]];

export function Processos() {
  let {
      remessas: e,
      clientes: t,
      motoristas: n,
      usuario: r,
      cfg: cg
    } = useSistema(),
    i = useToast(),
    [a, o] = useState("todos"),
    [s, c] = useState(""),
    [l, u] = useState(""),
    [d, f] = useState(""),
    [p, m] = useState(""),
    [h, g] = useState("todos"),
    [v, y] = useState(40),
    [b, x] = useState(null),
    [S, C] = useState(!1),
    w = Ur(r, "financeiro"),
    T = e => n.find(t => t.id === e)?.nome,
    E = useMemo(() => {
      let n = Qn(s),
        r = h === "todos" ? 0 : h === "hoje" ? new Date(new Date().toDateString()).getTime() : Date.now() - Number(h) * 864e5;
      return e.filter(e => (a === "todos" || (a === "atrasadas" ? !!atrasoDe(e, cg) : e.status === a)) && (!l || e.clienteId === l) && (!d || e.motoristaId === d || e.motoboyColetaId === d) && (!p || e.cidade === p) && new Date(e.criadoEm).getTime() >= r && (!n || Qn(`${e.codigo} ${e.destinatario} ${e.cidade} ${e.origem} ${t.find(t => t.id === e.clienteId)?.nome ?? ""}`).includes(n)));
    }, [e, t, a, s, l, d, p, h, cg]),
    D = t => t === "atrasadas" ? e.filter(e => atrasoDe(e, cg)).length : e.filter(e => e.status === t).length,
    ee = a !== "todos" || s || l || d || p || h !== "todos",
    te = () => {
      o("todos"), c(""), u(""), f(""), m(""), g("todos"), y(40);
    },
    ne = b ? e.find(e => e.id === b) : void 0;
  return <><Ii_ sub="Todos os pedidos, da coleta à entrega. Toque em um processo para ver o histórico, trocar o motoboy ou mudar o status." acao={<div className="flex flex-wrap gap-2"><R tone="line" disabled={!E.length} onClick={() => {
        let e = [["Código", "Cliente", "Destinatário", "Coleta em", "Entrega em", "Status", "Motoboy da coleta", "Motoboy da entrega", "Previsão", "Criado em", ...(w ? ["Valor"] : [])], ...E.map(e => [e.codigo, t.find(t => t.id === e.clienteId)?.nome ?? "", e.destinatario, e.origem, e.cidade, tr[e.status], T(e.motoboyColetaId) ?? "", T(e.motoristaId) ?? "", e.previsao, e.criadoEm.slice(0, 16).replace("T", " "), ...(w ? [(e.precoC / 100).toFixed(2).replace(".", ",")] : [])])].map(e => e.map(e => `"${String(e).replace(/"/g, "\"\"")}"`).join(";")).join("\r\n"),
          n = document.createElement("a");
        n.href = URL.createObjectURL(new Blob(["﻿" + e], {
          type: "text/csv;charset=utf-8"
        })), n.download = `processos-${new Date().toISOString().slice(0, 10)}.csv`, n.click(), URL.revokeObjectURL(n.href), i("Planilha baixada", `${E.length} processo(s).`);
      }}>Baixar planilha (CSV)</R><R tone="acc" disabled={!Ur(r, "operacao", "editar")} onClick={() => C(!0)}>Novo processo</R></div>}>Processos</Ii_><L tone="dark"><div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por etapa">{["todos", "atrasadas", ...bo].map(t => <button key={t} type="button" aria-pressed={a === t} onClick={() => {
          o(t), y(40);
        }} className={"min-h-11 rounded-full px-4 text-sm transition " + (a === t ? "bg-on text-frame" : "bg-white/10 text-on2 hover:text-on")}>{t === "todos" ? `Todos ${e.length}` : t === "atrasadas" ? `Atrasadas ${D(t)}` : `${tr[t]} ${D(t)}`}</button>)}</div><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><input value={s} onChange={e => {
          c(e.target.value), y(40);
        }} placeholder="Buscar código, nome ou cidade" aria-label="Buscar processos" className="min-h-12 rounded-2xl border border-white/15 bg-white/5 px-4 text-[15px] outline-none focus:border-sky lg:col-span-2" /><B label="Cliente" value={l} onChange={e => u(e.target.value)} className={"[&_span]:sr-only"}><option value="">Todos os clientes</option>{t.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</B><B label="Motoboy" value={d} onChange={e => f(e.target.value)} className={"[&_span]:sr-only"}><option value="">Todos os motoboys</option>{n.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</B><B label="Cidade de entrega" value={p} onChange={e => m(e.target.value)} className={"[&_span]:sr-only"}><option value="">Todas as cidades</option>{[...gr].sort((e, t) => e.nome.localeCompare(t.nome, "pt-BR")).map(e => <option key={e.ibge} value={e.nome}>{e.nome}</option>)}</B></div><div className="mt-3 flex flex-wrap items-center gap-2">{xo.map(([e, t]) => <button key={e} type="button" aria-pressed={h === e} onClick={() => g(e)} className={"min-h-11 rounded-full px-4 text-xs transition " + (h === e ? "bg-white/20 text-on" : "text-on2 hover:text-on")}>{t}</button>)}{ee && <button type="button" className="ml-auto min-h-11 text-sm text-sky underline" onClick={te}>Limpar filtros</button>}</div></L><L className="mt-3" i={1}><div className="mb-2 flex items-center justify-between"><h2 className="disp text-xl">{E.length}{" "}{E.length === 1 ? "processo" : "processos"}</h2></div>{E.length === 0 ? <Li_ titulo="Nada com esses filtros" texto="Mude a etapa, a busca ou o período." /> : <ul className="divide-y divide-white/10">{E.slice(0, v).map(e => <li key={e.id}><button type="button" onClick={() => x(e.id)} aria-label={`Abrir ${e.destinatario}`} className="grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-2 py-3 text-left text-sm transition hover:bg-white/5 lg:grid-cols-[1.3fr_1.1fr_1fr_.8fr_auto]"><span className="min-w-0"><b className="block truncate">{e.destinatario}</b><small className="text-on2">{t.find(t => t.id === e.clienteId)?.nome} · <span className="font-mono">{e.codigo}</span></small>{atrasoDe(e, cg) && <small className="block font-semibold text-warn">{rotuloAtraso(atrasoDe(e, cg))}</small>}</span><span className="hidden lg:block">{e.origem} → {e.cidade}<small className="block text-on2">{e.volumes} volume(s){w ? ` · ${N(e.precoC)}` : ""}</small></span><span className="hidden text-on2 lg:block">Coleta: {T(e.motoboyColetaId) ?? "—"}<small className="block">Entrega: {T(e.motoristaId) ?? "—"}</small></span><span className="hidden text-on2 lg:block">{e.status === "entregue" || e.status === "cancelada" ? "—" : P(e.previsao)}</span><span className="flex flex-col items-end gap-1"><Si_ s={e.status} />{atrasoDe(e, cg) && <V tone="warn">Atrasada</V>}</span></button></li>)}</ul>}{E.length > v && <div className="mt-3 text-center"><R tone="line" onClick={() => y(v + 60)}>Mostrar mais ({E.length - v})</R></div>}</L><Di_ aberto={!!ne} onFechar={() => x(null)} titulo={ne?.destinatario} largo>{ne && <Lo_ id={ne.id} />}</Di_>{S && <_o onClose={() => C(!1)} />}</>;
}

