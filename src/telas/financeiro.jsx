import { useState } from 'react';
import { N, P, Xn, cr, dr, fr, lr, or, sr, ur } from '../lib/regras';
import { Xo, Zo } from './configuracoes';
import { useSistema } from '../sistema/estado';
import { Ur, useToast } from '../sistema/acesso-toast';
import { Bo, Fo, Po, Ro, zo } from '../lib/prazos-metas';
import { B, Ci_, Di_, H, Ii_, L, Li_, R, V, Z } from '../componentes/ui';
import { Mo_ } from './extrato';
import { Go_ } from './fila-coletas';

export function Es_({
  valorC: e,
  nome: t,
  onChange: n
}) {
  let [r, i] = useState(e === void 0 ? "" : (e / 100).toFixed(2));
  return <input aria-label={`Tarifa geral para ${t}`} inputMode="decimal" value={r} placeholder="—" onChange={e => i(e.target.value)} onBlur={() => {
    let e = r.trim() === "" ? null : Math.max(0, Math.round((parseFloat(r.replace(",", ".")) || 0) * 100));
    n(e), i(e === null ? "" : (e / 100).toFixed(2));
  }} className="min-h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky" />;
}

export var ts = "modulepreload";

export var ns = function (e) {
  return "/" + e;
};

export var rs = {};

export var is = function (e) {
  return e.pathname.endsWith(".css");
};

export var as = function (e, t, n) {
  if (t in e) return e[t];
  let r = n();
  if (!r) {
    e[t] = void 0;
    return;
  }
  let i = r.then(() => {
    e[t] = void 0;
  }, n => {
    throw e[t] = void 0, n;
  });
  return e[t] = i, i;
};

export var os = function (e, t, n) {
  let r = Promise.resolve();
  if (t && t.length > 0) {
    let e,
      i = document.querySelector("meta[property=csp-nonce]"),
      a = i?.nonce || i?.getAttribute("nonce");
    function o(e) {
      return Promise.all(e.map(e => Promise.resolve(e).then(e => ({
        status: "fulfilled",
        value: e
      }), e => ({
        status: "rejected",
        reason: e
      }))));
    }
    function s(e) {
      return import.meta.resolve ? new URL(import.meta.resolve(e)) : new URL(e, import.meta.url);
    }
    r = o(t.map(t => {
      t = ns(t, n);
      let r = s(t),
        i = is(r);
      return as(rs, r.href, () => {
        if (e === void 0) {
          e = {
            all: new Set(),
            styles: new Set()
          };
          let t = document.getElementsByTagName("link");
          for (let n = t.length - 1; n >= 0; n--) {
            let r = t[n];
            e.all.add(r.href), r.rel === "stylesheet" && e.styles.add(r.href);
          }
        }
        if ((i ? e.styles : e.all).has(r.href)) return;
        let t = document.createElement("link");
        if (t.rel = i ? "stylesheet" : ts, i || (t.as = "script"), t.crossOrigin = "", t.href = r.href, a && t.setAttribute("nonce", a), document.head.appendChild(t), i) return new Promise((e, n) => {
          t.addEventListener("load", e), t.addEventListener("error", () => n(Error(`Unable to preload CSS for ${r}`)));
        });
      });
    }).filter(e => e !== void 0));
  }
  function i(e) {
    let t = new Event("vite:preloadError", {
      cancelable: !0
    });
    if (t.payload = e, window.dispatchEvent(t), !t.defaultPrevented) throw e;
  }
  return r.then(t => {
    for (let e of t || []) e.status === "rejected" && i(e.reason);
    return e().catch(i);
  });
};

export async function ss(e, t, n, r) {
  let {
      extratoMotoboyPdf: i
    } = await import("../lib/pdf.js"),
    a = dr(n, r);
  await i({
    motoboy: e.nome,
    periodo: t,
    forma: Xo[e.motoboy?.forma ?? "pix"],
    linhas: n.map(e => [P(e.em), or[e.tipo], e.codigo, N(e.valorC)]),
    ajustes: r.map(e => [P(e.data), e.tipo === "bonus" ? "Bônus" : e.tipo === "adiantamento" ? "Adiantamento" : "Desconto", e.descricao + (e.reembolsado ? " (reembolsado pelo cliente)" : ""), `${e.tipo === "bonus" ? "+" : "−"} ${N(e.valorC)}`]),
    resumo: {
      bruto: N(a.brutoC),
      descontos: N(a.descontosC),
      bonus: N(a.bonusC),
      liquido: N(a.liquidoC),
      naoCobrado: N(a.naoCobradoC)
    }
  });
}

export function cs(e, t, n, r) {
  let i = dr(n, r),
    a = e => n.filter(t => t.tipo === e).length,
    o = `Olá, ${e.nome.split(" ")[0]}! Seu acerto (${t}):\n${a("entrega")} entrega(s), ${a("coleta")} coleta(s), ${a("indicacao")} indicação(ões): ${N(i.brutoC)}\n${i.bonusC ? `Bônus: + ${N(i.bonusC)}\n` : ""}${i.descontosC ? `Descontos: − ${N(i.descontosC)}\n` : ""}Total a receber: ${N(i.liquidoC)}\nPagamento por ${Xo[e.motoboy?.forma ?? "pix"]}.`,
    s = (e.motoboy?.whatsapp ?? "").replace(/\D/g, "");
  window.open(`https://wa.me/${s ? s.startsWith("55") ? s : "55" + s : ""}?text=${encodeURIComponent(o)}`, "_blank", "noopener");
}

export var ls = e => e == null ? "—" : `${Math.round(e * 100)}%`;

export function Us({
  id: e,
  onClose: t
}) {
  let {
      equipe: n,
      remessas: r,
      clientes: i,
      acertos: a,
      usuario: o
    } = useSistema(),
    [s, c] = useState(null),
    l = n.find(t => t.id === e),
    u = l?.motoboy;
  if (!l || !u) return null;
  let d = Ur(o, "financeiro"),
    f = Ro("30"),
    p = Bo({
      remessas: r,
      clientes: i,
      equipe: n
    }, f, {
      motoboy: e
    }),
    m = Bo({
      remessas: r,
      clientes: i,
      equipe: n
    }, zo(f), {
      motoboy: e
    }),
    h = sr(r, e),
    g = a.filter(t => t.motoboyId === e).slice(0, 4),
    v = u.whatsapp.replace(/\D/g, ""),
    Comp_y = ({
      t: e,
      children: t
    }) => <div className="grid grid-cols-[120px_1fr] gap-3 border-b border-ink/10 py-2 text-sm last:border-0"><dt className="text-ink/60">{e}</dt><dd className="min-w-0 break-words font-medium text-ink">{t}</dd></div>,
    Comp_b = ({
      t: e,
      v: t,
      onClick: n
    }) => <button type="button" disabled={!n} onClick={n} className="rounded-2xl bg-ink/5 p-3 text-left text-ink transition enabled:hover:bg-ink/10"><small className="block text-ink/60">{e}</small><b className="text-lg">{t}</b></button>;
  return <><Di_ aberto={!s} onFechar={t} titulo={l.nome} largo><div className="space-y-4"><div className="flex flex-wrap gap-2">{!u.ativo && <V tone="bad">Acesso desativado</V>}<V>{u.disponivel ? "Disponível" : "Indisponível"}</V><V tone="blue">{u.cidade}</V>{u.todasCidades && <V>Todas as cidades</V>}<V>Indicação {u.codigoIndicacao}</V></div><dl><y t="WhatsApp">{v ? <a className="text-blue underline" href={`https://wa.me/${v.startsWith("55") ? v : "55" + v}`} target="_blank" rel="noreferrer">{u.whatsapp}</a> : "—"}</y><y t="Veículo">{[u.modelo, u.placa].filter(Boolean).join(" · ") || "—"}</y><y t="CNH">{u.cnh || "—"}</y>{d && <y t="Ganha por">{N(u.valorEntregaC)} por entrega{u.valorColetaC > 0 && <> · {N(u.valorColetaC)} por coleta</>}</y>}{d && <y t="Recebe">{Xo[u.forma]}{u.forma === "pix" && u.chavePix ? ` (${u.chavePix})` : ""} · {Zo[u.periodo].toLowerCase()}</y>}</dl><div><h3 className="mb-2 text-sm font-semibold text-ink">Últimos 30 dias</h3><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><b t="Entregas" v={p.entregues.length} onClick={() => c({
              titulo: "Entregas nos últimos 30 dias",
              ids: p.entregues.map(e => e.id)
            })} /><b t="Taxa de entrega" v={ls(p.porMotoboy[0]?.taxa ?? null)} /><b t="Ocorrências" v={p.ocorrencias.length} onClick={p.ocorrencias.length ? () => c({
              titulo: "Ocorrências nos últimos 30 dias",
              ids: p.ocorrencias.map(e => e.id)
            }) : void 0} /><b t="Antes (30 dias)" v={m.entregues.length} /></div></div>{d && <div><h3 className="mb-2 text-sm font-semibold text-ink">Dinheiro</h3><div className="grid grid-cols-3 gap-2"><b t="Sem acerto" v={N(cr(lr(h)))} /><b t="Aprovado a pagar" v={N(cr(ur(h)))} /><b t="Já pago" v={N(cr(h.filter(e => e.pago)))} /></div>{g.length > 0 && <ul className="mt-3 space-y-1 text-sm text-ink">{g.map(e => <li key={e.id} className="flex justify-between gap-3 rounded-xl bg-ink/5 px-3 py-2"><span>{e.rotulo}<small className="block text-ink/60">{P(e.criadoEm)}{" "}{Xn(e.criadoEm)}</small></span><b>{N(e.liquidoC)} · {e.status === "pago" ? "pago" : "a pagar"}</b></li>)}</ul>}</div>}</div></Di_>{s && <Mo_ titulo={s.titulo} ids={s.ids} onClose={() => c(null)} />}</>;
}

export var ds = {
  desconto: "Desconto",
  adiantamento: "Adiantamento",
  bonus: "Bônus"
};

export function Financeiro() {
  let {
      remessas: e,
      clientes: t,
      motoristas: n,
      faturas: r,
      acertos: i,
      ajustes: a,
      usuario: o,
      fecharFatura: s,
      lancarAjuste: c,
      removerAjuste: l,
      aprovarAcerto: u,
      pagarAcerto: d
    } = useSistema(),
    f = useToast(),
    p = Ur(o, "financeiro", "editar"),
    [m, h] = useState(null),
    [g, v] = useState("clientes"),
    [y, b] = useState({}),
    [x, S] = useState(null),
    [C, w] = useState(null),
    T = e => t.find(t => t.id === e)?.nome ?? "—",
    E = e => n.find(t => t.id === e)?.nome ?? "—",
    D = t => {
      let n = Po(t.motoboy.periodo),
        r = y[t.id] ?? "atual",
        i = r === "atual" ? n : Fo(t.motoboy.periodo, n),
        o = r === "tudo" ? null : i.fim.toISOString(),
        s = lr(sr(e, t.id)).filter(e => !o || e.em <= o),
        c = a.filter(e => e.motoboyId === t.id && !e.acertoId);
      return {
        sel: r,
        ate: o,
        rotulo: r === "tudo" ? "Tudo que está pendente" : i.rotulo,
        linhas: s,
        ajs: c,
        r: dr(s, c)
      };
    },
    ee = t.reduce((t, n) => t + fr(e, n.id).reduce((e, t) => e + t.precoC, 0), 0),
    te = n.reduce((t, n) => {
      let r = sr(e, n.id);
      return t + cr(lr(r)) + cr(ur(r));
    }, 0);
  return <><Ii_ sub="Fechamento por cliente e acerto com motoboys. Cada fechamento fica no histórico; nada é apagado nem zerado.">Financeiro</Ii_>{!p && <p className="mb-3 rounded-2xl bg-warn/15 p-3 text-sm text-warn">Você só pode consultar o financeiro. Para fechar faturas ou aprovar acertos, peça ao dono.</p>}<div className="grid gap-3 sm:grid-cols-3"><H i={0} rotulo="A faturar (clientes)" valor={N(ee)} tone="acc" nota="inclui pedidos ainda em andamento" onClick={() => h({
        titulo: "A faturar (clientes)",
        ids: t.flatMap(t => fr(e, t.id).map(e => e.id))
      })} /><H i={1} rotulo="A pagar (motoboys)" valor={N(te)} nota="sem acerto ou aprovado" onClick={() => h({
        titulo: "A pagar (motoboys)",
        ids: [...new Set(n.flatMap(t => sr(e, t.id).filter(e => !e.pago).map(e => e.remessaId)))]
      })} /><H i={2} rotulo="Margem bruta" valor={N(ee - te)} tone="light" nota="a faturar menos a pagar" /></div><div className="mb-3 mt-4 flex gap-2" role="tablist">{[["clientes", "Clientes"], ["motoboys", "Motoboys"]].map(([e, t]) => <button key={e} type="button" role="tab" aria-selected={g === e} onClick={() => v(e)} className={"min-h-11 rounded-full px-5 text-sm transition " + (g === e ? "bg-on text-frame" : "bg-g1 text-on2 hover:text-on")}>{t}</button>)}</div>{g === "clientes" ? <div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]"><div className="space-y-3">{t.map((t, n) => {
          let r = fr(e, t.id),
            i = r.reduce((e, t) => e + t.precoC, 0);
          return <L key={t.id} i={n + 3}><div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><b className="block truncate text-lg">{t.nome}</b><small className="text-on2">{r.length} remessa(s) sem fatura</small></div><div className="flex flex-wrap items-center gap-2"><b className="disp text-2xl">{N(i)}</b><R tone="line" disabled={!r.length} onClick={() => h({
                  titulo: `A faturar · ${t.nome}`,
                  ids: r.map(e => e.id)
                })}>Ver</R><R tone="acc" disabled={!r.length || !p} onClick={() => {
                  s(t.id), f("Fatura fechada", `${r.length} remessa(s) de ${t.nome}.`);
                }}>Fechar fatura</R></div></div></L>;
        })}</div><L tone="dark" i={4} className="h-fit"><h2 className="disp mb-3 text-xl">Faturas fechadas</h2>{r.length === 0 ? <Li_ titulo="Nenhuma ainda" texto="As faturas fechadas aparecem aqui." /> : <ul className="divide-y divide-white/10 text-sm">{r.slice(0, 10).map(e => <li key={e.id} className="flex items-center justify-between gap-3 py-3"><span><b className="block">{T(e.clienteId)}</b><small className="text-on2">{P(e.em)}{" "}{Xn(e.em)} · {e.remessas} remessa(s)</small></span><b>{N(e.totalC)}</b></li>)}</ul>}</L></div> : <div className="grid gap-3 lg:grid-cols-[1.25fr_.75fr]"><div className="space-y-3">{n.map((e, t) => {
          let n = D(e),
            r = i.find(t => t.motoboyId === e.id && t.status === "aprovado"),
            a = e => n.linhas.filter(t => t.tipo === e);
          return <L key={e.id} i={t + 3}><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><button type="button" className="block max-w-full truncate text-left text-lg font-bold underline-offset-4 hover:underline" onClick={() => S(e.id)}>{e.nome}</button><small className="text-on2">{Xo[e.motoboy.forma]} · {Zo[e.motoboy.periodo].toLowerCase()}{e.motoboy.forma === "pix" && e.motoboy.chavePix ? " · " + e.motoboy.chavePix : ""}</small></div><div className="text-right"><small className="block text-on2">Líquido do acerto</small><b className="disp text-2xl">{N(n.r.liquidoC)}</b></div></div><div className="mt-3 flex flex-wrap items-center gap-2"><B label="Período" value={n.sel} onChange={t => b({
                ...y,
                [e.id]: t.target.value
              })} className={"min-w-52 [&_span]:sr-only"}><option value="atual">Período atual</option><option value="anterior">Período anterior</option><option value="tudo">Tudo que está pendente</option></B><small className="text-on2">{n.rotulo}</small></div>{(n.linhas.length > 0 || n.ajs.length > 0) && <div className="mt-3 flex flex-wrap gap-2 text-xs">{["entrega", "coleta", "indicacao"].map(e => a(e).length > 0 && <V key={e} tone={e === "indicacao" ? "blue" : "neu"}>{a(e).length}{" "}{or[e].toLowerCase()}(s) · {N(cr(a(e)))}</V>)}{n.r.bonusC > 0 && <V tone="ok">Bônus + {N(n.r.bonusC)}</V>}{n.r.descontosC > 0 && <V tone="bad">Descontos − {N(n.r.descontosC)}</V>}{n.r.naoCobradoC > 0 && <V>{N(n.r.naoCobradoC)} reembolsado pelo cliente (não cobrado)</V>}</div>}{n.ajs.length > 0 && <ul className="mt-3 space-y-1 text-sm">{n.ajs.map(e => <li key={e.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2"><span className="min-w-0 truncate">{ds[e.tipo]} · {e.descricao}{e.reembolsado && <small className="text-on2"> · reembolsado</small>}</span><span className="flex items-center gap-1"><b>{e.tipo === "bonus" ? "+" : "−"}{" "}{N(e.valorC)}</b>{p && <button type="button" aria-label={`Remover ${e.descricao}`} className="min-h-9 min-w-9 rounded-lg text-on2 hover:bg-white/10" onClick={() => l(e.id)}>✕</button>}</span></li>)}</ul>}{r && <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ok/15 p-3 text-sm"><span><b className="block">Acerto aprovado: {N(r.liquidoC)}</b><small className="text-on2">{r.rotulo} · aprovado por {r.por}</small></span><R tone="ok" disabled={!p} onClick={() => {
                d(r.id), f("Pagamento registrado", `${N(r.liquidoC)} para ${e.nome}.`);
              }}>Registrar pagamento</R></div>}<div className="mt-3 flex flex-wrap gap-2"><R tone="line" disabled={!p} onClick={() => w({
                motoboyId: e.id,
                tipo: "desconto",
                descricao: "",
                valorC: 0,
                reembolsado: !1
              })}>Lançar ajuste</R><R tone="acc" disabled={!p || !n.linhas.length && !n.ajs.length} onClick={() => {
                u(e.id, n.rotulo, n.ate), f("Acerto aprovado", "Falta registrar o pagamento.");
              }}>Aprovar acerto</R><R tone="line" onClick={() => ss(e, n.rotulo, n.linhas, n.ajs).then(() => f("Extrato gerado", "Se o arquivo não abrir, procure em Downloads.")).catch(e => f("Não foi possível gerar o PDF", e instanceof Error ? e.message : "Tente de novo."))}>Extrato (PDF)</R><R tone="line" disabled={!n.linhas.length && !n.ajs.length} onClick={() => cs(e, n.rotulo, n.linhas, n.ajs)}>WhatsApp</R></div></L>;
        })}</div><L tone="dark" i={4} className="h-fit"><h2 className="disp mb-3 text-xl">Acertos</h2>{i.length === 0 ? <Li_ titulo="Nenhum ainda" texto="Aprove um acerto para ele aparecer aqui." /> : <ul className="divide-y divide-white/10 text-sm">{i.slice(0, 12).map(t => {
            let r = n.find(e => e.id === t.motoboyId),
              i = sr(e, t.motoboyId).filter(e => e.acertoId === t.id),
              o = a.filter(e => e.acertoId === t.id);
            return <li key={t.id} className="flex items-center justify-between gap-3 py-3"><span className="min-w-0"><b className="block truncate">{E(t.motoboyId)}</b><small className="text-on2">{t.rotulo} · {t.linhas} lançamento(s)</small><button type="button" className="block min-h-9 text-xs text-sky underline" onClick={() => r && ss(r, t.rotulo, i, o).then(() => f("Extrato gerado")).catch(e => f("Não foi possível gerar o PDF", e instanceof Error ? e.message : "Tente de novo."))}>Extrato (PDF)</button></span><span className="text-right"><b>{N(t.liquidoC)}</b><small className="block">{t.status === "pago" ? <V tone="ok">Pago</V> : <V tone="warn">A pagar</V>}</small></span></li>;
          })}</ul>}</L></div>}<Di_ aberto={!!C} onFechar={() => w(null)} titulo={`Lançar ajuste · ${C ? E(C.motoboyId) : ""}`}>{C && <div className={"space-y-4 [&_input]:!border-ink/20 [&_input]:!bg-white [&_input]:!text-ink [&_select]:!border-ink/20 [&_select]:!bg-white [&_select]:!text-ink [&_span]:!text-ink/60"}><B label="Tipo" value={C.tipo} onChange={e => w({
          ...C,
          tipo: e.target.value,
          reembolsado: !1
        })}>{Object.keys(ds).map(e => <option key={e} value={e}>{ds[e]}</option>)}</B><Z label="Descrição" value={C.descricao} onChange={e => w({
          ...C,
          descricao: e.target.value
        })} placeholder="Ex.: avaria do pacote AM-00A1B2C3" /><Go_ label="Valor (R$)" valorC={C.valorC} onChange={e => w({
          ...C,
          valorC: e
        })} />{C.tipo === "desconto" && <Ci_ label="O cliente reembolsou: registra, mas não desconta do motoboy" checked={C.reembolsado} onChange={e => w({
          ...C,
          reembolsado: e
        })} className={"[&_*]:!text-ink"} />}<R tone="dark" className="w-full" disabled={C.descricao.trim().length < 3 || C.valorC <= 0} onClick={() => {
          c({
            motoboyId: C.motoboyId,
            tipo: C.tipo,
            descricao: C.descricao.trim(),
            valorC: C.valorC,
            reembolsado: C.reembolsado
          }), w(null), f("Ajuste lançado", "Entra no próximo acerto aprovado.");
        }}>Lançar</R></div>}</Di_>{x && <Us id={x} onClose={() => S(null)} />}{m && <Mo_ titulo={m.titulo} ids={m.ids} onClose={() => h(null)} />}</>;
}

