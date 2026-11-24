import { useState } from 'react';
import { useSistema } from '../sistema/estado';
import { Ur, useToast } from '../sistema/acesso-toast';
import { Kn, N, P, Qn, Xn, Zn, or, tr } from '../lib/regras';
import { Di_, Ii_, Li_, R, Si_, Ui_, V } from '../componentes/ui';
import { Eo_ } from './nova-remessa';
import { ResolverOcorrencia } from '../componentes/acoes';

export var io = ["pedido", "a_caminho", "coletado", "conferido", "em_rota", "entregue", "cancelada"];

export function Ao_({
  t: e,
  children: t
}) {
  return <div className="grid grid-cols-[112px_1fr] gap-3 border-b border-ink/10 py-2 text-sm last:border-0"><dt className="text-ink/60">{e}</dt><dd className="min-w-0 break-words font-medium text-ink">{t}</dd></div>;
}

export var oo = ["pedido", "a_caminho", "coletado", "conferido", "em_rota", "entregue", "ocorrencia"];

export var so = e => {
  let t = new Date(e),
    n = e => String(e).padStart(2, "0");
  return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`;
};

export function Co_({
  r: e
}) {
  let {
      editarEvento: t
    } = useSistema(),
    n = useToast(),
    [r, i] = useState(!1),
    [a, o] = useState({}),
    s = oo.filter(t => e.eventos.some(e => e.tipo === t));
  return r ? <div className="mt-3 space-y-3 rounded-2xl border border-ink/10 p-3 text-ink"><p className="text-xs text-ink/60">Ajuste a data e a hora de cada atualização. O horário original e quem corrigiu ficam guardados no registro.</p>{s.map(e => <label key={e} className="grid items-center gap-1 text-sm sm:grid-cols-[170px_1fr]"><span className="font-medium">{tr[e] ?? e}</span><input type="datetime-local" value={a[e] ?? ""} max={so(new Date().toISOString())} onChange={t => o({
        ...a,
        [e]: t.target.value
      })} className="min-h-11 rounded-xl border border-ink/20 bg-white px-3 text-sm text-ink" /></label>)}<div className="flex gap-2"><R tone="dark" onClick={() => {
        let r = s.filter(e => e !== "ocorrencia" && a[e]).map(e => new Date(a[e]).getTime());
        if (s.some(e => !a[e] || Number.isNaN(new Date(a[e]).getTime()))) return n("Data inválida", "Preencha todas as datas.");
        if (r.some(e => e > Date.now() + 6e4)) return n("Data no futuro", "Escolha um horário que já passou.");
        if (r.some((e, t) => t > 0 && e < r[t - 1])) return n("Fora de ordem", "Cada etapa precisa ser depois da anterior.");
        let o = 0;
        for (let n of s) {
          let r = e.eventos.find(e => e.tipo === n).em;
          so(r) !== a[n] && (t(e.id, n, new Date(a[n]).toISOString()), o++);
        }
        i(!1), n(o ? "Horários corrigidos" : "Nada mudou", o ? "A correção fica registrada." : void 0);
      }}>Salvar horários</R><R tone="line" className="!border-ink/30 !text-ink" onClick={() => i(!1)}>Cancelar</R></div></div> : <button type="button" onClick={() => {
    o(Object.fromEntries(s.map(t => [t, so(e.eventos.find(e => e.tipo === t).em)]))), i(!0);
  }} className="mt-2 min-h-11 text-sm font-medium text-blue underline">Corrigir datas e horários</button>;
}

export function Lo_({
  id: e
}) {
  let {
      remessas: t,
      clienteDe: n,
      motoristas: r,
      usuario: i,
      atribuirColeta: a,
      atribuir: o,
      mudarStatus: s,
      resolverOcorrencia: c
    } = useSistema(),
    l = useToast(),
    [u, d] = useState(!1),
    [rs, setRs] = useState(!1),
    f = t.find(t => t.id === e);
  if (!f) return <p className="text-sm text-ink/70">Remessa não encontrada.</p>;
  let p = n(f.clienteId),
    m = Ur(i, "operacao", "editar"),
    h = Ur(i, "financeiro") || i?.papel === "cliente",
    g = Ur(i, "financeiro"),
    v = e => r.find(t => t.id === e)?.nome,
    y = f.status === "entregue" || f.status === "cancelada",
    b = "min-h-11 w-full rounded-xl border border-ink/20 bg-white px-3 text-sm text-ink";
  if (u) return <div className="space-y-3"><button type="button" className="min-h-11 text-sm font-medium text-blue underline" onClick={() => d(!1)}>← Voltar aos detalhes</button><Eo_ r={f} cliente={p} /><R tone="dark" className="w-full" onClick={() => window.print()}>Imprimir etiqueta</R></div>;
  let x = [["entrega", f.pgEntrega], ["coleta", f.pgColeta], ["indicacao", f.comissao]];
  return <><div className="space-y-4"><div className="flex flex-wrap items-center gap-2"><Si_ s={f.status} /><span className="font-mono text-xs text-ink/60">{f.codigo}</span>{f.ocorrencia && !f.ocorrencia.resolvida && <V tone="bad">Ocorrência aberta</V>}</div><dl><Ao_ t="Cliente">{p?.nome ?? "—"}</Ao_><Ao_ t="Destinatário">{f.destinatario}</Ao_>{f.telefone && <Ao_ t="Telefone"><a className="text-blue underline" href={`tel:${f.telefone.replace(/[^\d+]/g, "")}`}>{f.telefone}</a></Ao_>}<Ao_ t="Endereço">{f.endereco}</Ao_><Ao_ t="Rota">Coleta em {f.origem} → entrega em {f.cidade}</Ao_><Ao_ t="Carga">{f.volumes} volume(s) · {Kn(f.pesoTaxG)}</Ao_><Ao_ t="Previsão">{y ? "—" : P(f.previsao)}</Ao_>{h && <Ao_ t="Valor do frete">{N(f.precoC)}</Ao_>}<Ao_ t="Motoboy da coleta">{m && !y && ["pedido", "a_caminho"].includes(f.status) ? <select aria-label="Motoboy da coleta" className={b} value={f.motoboyColetaId ?? ""} onChange={e => {
          e.target.value && (a(f.id, e.target.value), l("Motoboy da coleta definido", v(e.target.value)));
        }}><option value="">Escolher motoboy…</option>{r.map(e => <option key={e.id} value={e.id}>{e.nome}{e.motoboy?.cidade ? ` · ${e.motoboy.cidade}` : ""}</option>)}</select> : v(f.motoboyColetaId) ?? "Ainda sem motoboy"}</Ao_><Ao_ t="Motoboy da entrega">{m && !y ? <select aria-label="Motoboy da entrega" className={b} value={f.motoristaId ?? ""} onChange={e => {
          e.target.value && (o(f.id, e.target.value), l("Motoboy da entrega definido", v(e.target.value)));
        }}><option value="">Escolher motoboy…</option>{r.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</select> : v(f.motoristaId) ?? "Ainda sem motoboy"}</Ao_></dl>{f.prova && <div className="rounded-2xl bg-ink/5 p-3 text-sm text-ink"><b>Entrega registrada</b> em {P(f.prova.em)} às {Xn(f.prova.em)}<br />Recebido por <b>{f.prova.recebedor}</b>{f.prova.documento && <> · documento {f.prova.documento}</>}{f.prova.gps && <><br /><a className="text-blue underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${f.prova.gps.lat},${f.prova.gps.lng}`}>Ver o local da entrega no mapa</a>{f.prova.gps.precisao ? ` (precisão de ${f.prova.gps.precisao} m)` : ""}</>}{f.prova.foto && <img src={f.prova.foto} alt="Foto da entrega" className="mt-2 max-h-48 rounded-xl" />}</div>}{f.ocorrencia && <div className="rounded-2xl bg-acc/10 p-3 text-sm text-ink"><b>Ocorrência:</b>{" "}{f.ocorrencia.motivo}{f.ocorrencia.resolvida ? " (resolvida)" : ""}{f.ocorrencia.detalhe && <><br />{f.ocorrencia.detalhe}</>}{f.ocorrencia.foto && <img src={f.ocorrencia.foto} alt="Foto da ocorrência" className="mt-2 max-h-40 rounded-xl" />}{f.ocorrencia.resolucao && <><br /><b>Combinado:</b> {f.ocorrencia.resolucao.nota} · nova data {P(f.ocorrencia.resolucao.novaData)}{f.ocorrencia.resolucao.por ? ` (${f.ocorrencia.resolucao.por})` : ""}</>}</div>}{m && <div className="space-y-3 rounded-2xl border border-ink/10 p-3"><label className="block text-xs font-semibold uppercase tracking-[.1em] text-ink/60">Atualizar status<select aria-label="Atualizar status" className={b + " mt-1 normal-case tracking-normal"} value={f.status === "ocorrencia" ? "" : f.status} onChange={e => {
          let t = e.target.value;
          t && t !== f.status && (t !== "cancelada" || confirm("Cancelar esta remessa?")) && (s(f.id, t), l("Status atualizado", tr[t]));
        }}>{f.status === "ocorrencia" && <option value="">Ocorrência</option>}{io.map(e => <option key={e} value={e}>{tr[e]}</option>)}</select></label><div className="flex flex-wrap gap-2">{f.status === "ocorrencia" && f.ocorrencia && !f.ocorrencia.resolvida && <R tone="acc" onClick={() => setRs(!0)}>Resolver e reprogramar</R>}<R tone="dark" onClick={() => d(!0)}>Ver etiqueta</R></div></div>}{!m && <R tone="dark" onClick={() => d(!0)}>Ver etiqueta</R>}{g && x.some(([, e]) => e) && <div className="rounded-2xl bg-ink/5 p-3 text-sm text-ink"><b className="mb-1 block">Repasses a motoboys</b>{x.map(([e, t]) => t && <p key={e} className="flex justify-between gap-3"><span>{or[e]} · {v(t.motoboyId) ?? "—"}</span><b>{N(t.valorC)}{t.pagoEm ? " · pago" : " · pendente"}</b></p>)}</div>}<div className="tema-escuro rounded-3xl bg-ink p-4 text-on"><Ui_ r={f} /></div>{m && <Co_ r={f} />}</div>{rs && <ResolverOcorrencia r={f} onClose={() => setRs(!1)} />}</>;
}

export function Uo_({
  id: e,
  titulo: t,
  className: n = "text-sky"
}) {
  let [r, i] = useState(!1),
    {
      remessas: a
    } = useSistema(),
    o = a.find(t => t.id === e);
  return <><button type="button" onClick={() => i(!0)} className={"min-h-11 text-xs font-semibold underline " + n}>Ver detalhes</button>{r && <Di_ aberto onFechar={() => i(!1)} titulo={t ?? o?.destinatario} largo><Lo_ id={e} /></Di_>}</>;
}

export var fo = [["todas", "Todas"], ["andamento", "Em andamento"], ["entregue", "Entregues"], ["ocorrencia", "Ocorrências"]];

export function MinhasRemessas() {
  let {
      minhasRemessas: e,
      clienteDe: t,
      usuario: n,
      cancelar: r
    } = useSistema(),
    i = useToast(),
    [a, o] = useState("todas"),
    [s, c] = useState(""),
    [l, u] = useState(null);
  t(n.clienteId);
  let d = e.filter(e => {
      if (a === "andamento" && ["entregue", "cancelada", "ocorrencia"].includes(e.status) || a === "entregue" && e.status !== "entregue" || a === "ocorrencia" && e.status !== "ocorrencia") return !1;
      let t = Qn(s);
      return !t || Qn(e.codigo + e.destinatario + e.cidade).includes(t);
    }),
    f = e.find(e => e.id === l);
  return <><Ii_ sub="Acompanhe cada pacote do pedido até a porta.">Minhas remessas</Ii_><div className="mb-3 flex flex-wrap items-center gap-2">{fo.map(([e, t]) => <button key={e} type="button" aria-pressed={a === e} onClick={() => o(e)} className={"min-h-11 rounded-full px-4 text-sm transition " + (a === e ? "bg-on text-frame" : "bg-g1 text-on2 hover:text-on")}>{t}</button>)}<input value={s} onChange={e => c(e.target.value)} placeholder="Buscar por código, nome ou cidade" aria-label="Buscar remessas" className="ml-auto min-h-11 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm outline-none focus:border-sky sm:w-72" /></div>{d.length === 0 ? <Li_ titulo="Nenhuma remessa aqui" texto="Gere a primeira em “Nova remessa”." /> : <div className="space-y-2">{d.map((e, t) => <button key={e.id} type="button" onClick={() => u(e.id)} style={{
        "--i": Math.min(t, 8)
      }} className="rise grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-3xl bg-g1 p-4 text-left transition hover:bg-g2 sm:grid-cols-[1.2fr_1fr_1fr_auto_auto]"><span className="min-w-0"><b className="block truncate">{e.destinatario}</b><small className="font-mono text-xs text-on2">{e.codigo}</small></span><span className="hidden text-sm sm:block">{e.cidade}<small className="block text-xs text-on2">{e.volumes} volume(s)</small></span><span className="hidden text-sm sm:block">{P(e.previsao)}<small className="block text-xs text-on2">criada há {Zn(e.criadoEm)}</small></span><span className="hidden text-sm font-semibold sm:block">{N(e.precoC)}</span><Si_ s={e.status} /></button>)}</div>}<Di_ aberto={!!f} onFechar={() => u(null)} titulo={f?.destinatario} largo>{f && <div className="space-y-4"><Lo_ id={f.id} />{f.status === "pedido" && !f.motoboyColetaId && <R tone="line" className="!border-ink/30 !text-ink hover:!bg-ink/5" onClick={() => {
          confirm("Tem certeza que deseja cancelar esta coleta?") && (r(f.id), u(null), i("Remessa cancelada"));
        }}>Cancelar esta coleta</R>}</div>}</Di_></>;
}

