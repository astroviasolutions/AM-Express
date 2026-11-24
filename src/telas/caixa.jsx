import { useState } from 'react';
import { Jn, N, P } from '../lib/regras';
import { useSistema } from '../sistema/estado';
import { Ur, useToast } from '../sistema/acesso-toast';
import { B, H, Ii_, L, Li_, R, V, Z } from '../componentes/ui';
import { Go_ } from './fila-coletas';

export function Vs({
  rotulo: e,
  atual: t,
  meta: n,
  proj: r,
  fmt: i
}) {
  let a = Math.min(1, Math.max(0, t / n));
  return <div><div className="mb-1 flex justify-between text-sm"><b>{e}</b><span>{i(t)} de {i(n)} ({Math.round(t / n * 100)}%)</span></div><div className="h-3 overflow-hidden rounded-full bg-white/10" role="img" aria-label={`${e}: ${Math.round(a * 100)}% da meta`}><i className="block h-full rounded-full bg-gradient-to-r from-blue to-acc-hi" style={{
        width: `${a * 100}%`
      }} /></div><p className="mt-1 text-xs text-on2">{r == null ? "A projeção aparece a partir do dia 5 do mês." : r >= n ? `No ritmo atual fecha o mês em ${i(r)}: bate a meta.` : `No ritmo atual fecha o mês em ${i(r)}: abaixo da meta.`}</p></div>;
}

export var ys = e => e.reduce((e, t) => e + t.valorC, 0);

export var bs = e => Math.round((new Date(e + "T12:00:00").getTime() - new Date(Jn() + "T12:00:00").getTime()) / 864e5);

export var xs = [["Vencido", e => e < 0], ["Vence hoje", e => e === 0], ["Em até 7 dias", e => e >= 1 && e <= 7], ["Em 8 a 30 dias", e => e >= 8 && e <= 30], ["Depois de 30 dias", e => e > 30]];

export function Caixa() {
  let {
      caixa: e,
      cfg: t,
      usuario: n,
      addLancamento: r,
      pagarLancamento: i,
      estornarLancamento: a,
      removerLancamento: o
    } = useSistema(),
    s = useToast(),
    c = Ur(n, "caixa", "editar"),
    [l, u] = useState({
      tipo: "saida",
      descricao: "",
      categoria: t.categoriasSaida[0] ?? "",
      valorC: 0,
      data: Jn()
    }),
    d = e.filter(e => e.pago),
    f = e.filter(e => !e.pago).sort((e, t) => e.data.localeCompare(t.data)),
    p = f.filter(e => e.tipo === "saida"),
    m = f.filter(e => e.tipo === "entrada"),
    h = t.saldoInicialC + ys(d.filter(e => e.tipo === "entrada")) - ys(d.filter(e => e.tipo === "saida")),
    g = e => bs(e.data) <= 30,
    v = h + ys(m.filter(g)) - ys(p.filter(g)),
    y = Jn().slice(0, 7),
    b = d.filter(e => e.tipo === "saida" && (e.pagoEm ?? e.data).slice(0, 7) === y),
    x = [...new Set(b.map(e => e.categoria))].map(e => ({
      c: e,
      v: ys(b.filter(t => t.categoria === e))
    })).sort((e, t) => t.v - e.v),
    S = Math.max(1, ...x.map(e => e.v)),
    C = l.tipo === "entrada" ? t.categoriasEntrada : t.categoriasSaida,
    Comp_w = ({
      l: e
    }) => {
      let t = bs(e.data);
      return <li className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><span className="min-w-0"><b className="block truncate">{e.descricao}</b><small className="text-on2">{e.categoria} · vence {P(e.data)}{!e.pago && t < 0 && <span className="text-acc-hi"> · vencido há {-t} dia(s)</span>}{e.origem !== "manual" && <> · automático</>}</small></span><span className="flex items-center gap-2"><b>{N(e.valorC)}</b>{!e.pago && <R tone="line" className="!min-h-9 !px-3 !text-xs" disabled={!c} onClick={() => {
            i(e.id), s(e.tipo === "saida" ? "Pagamento baixado" : "Recebimento baixado", e.descricao);
          }}>{e.tipo === "saida" ? "Pagar" : "Receber"}</R>}{e.pago && <R tone="line" className="!min-h-9 !px-3 !text-xs" disabled={!c} onClick={() => {
            a(e.id), s("Baixa estornada", e.descricao);
          }}>Estornar</R>}{!e.pago && e.origem === "manual" && c && <button type="button" aria-label={`Remover ${e.descricao}`} className="min-h-9 min-w-9 rounded-lg text-on2 hover:bg-white/10" onClick={() => {
            confirm("Remover este lançamento?") && o(e.id);
          }}>✕</button>}</span></li>;
    };
  return <><Ii_ sub="Entradas, saídas e vencimentos. Faturas fechadas e acertos pagos entram aqui sozinhos. Dados de exemplo.">Caixa</Ii_>{!c && <p className="mb-3 rounded-2xl bg-warn/15 p-3 text-sm text-warn">Você só pode consultar o caixa. Para lançar ou baixar, peça ao dono.</p>}<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><H i={0} rotulo="Saldo hoje" valor={N(h)} tone="acc" nota={`saldo inicial ${N(t.saldoInicialC)} + movimentos pagos`} /><H i={1} rotulo="Previsto em 30 dias" valor={N(v)} nota="saldo + a receber − a pagar" tone={v < 0 ? "light" : "g1"} /><H i={2} rotulo="A pagar" valor={N(ys(p))} nota={`${p.length} conta(s) em aberto`} /><H i={3} rotulo="A receber" valor={N(ys(m))} tone="light" nota={`${m.length} conta(s) em aberto`} /></div>{v < 0 && <p className="mt-3 rounded-2xl bg-acc-hi/15 p-3 text-sm text-acc-hi">Atenção: com o que está em aberto, o saldo previsto em 30 dias fica negativo.</p>}<div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_.8fr]"><div className="space-y-3"><L i={4}><h2 className="disp mb-3 text-xl">Novo lançamento</h2><div className="grid gap-3 sm:grid-cols-2"><B label="Tipo" value={l.tipo} onChange={e => {
              let n = e.target.value;
              u({
                ...l,
                tipo: n,
                categoria: (n === "entrada" ? t.categoriasEntrada : t.categoriasSaida)[0] ?? ""
              });
            }}><option value="saida">Saída (conta a pagar)</option><option value="entrada">Entrada (a receber)</option></B><B label="Categoria" value={l.categoria} onChange={e => u({
              ...l,
              categoria: e.target.value
            })}>{C.map(e => <option key={e}>{e}</option>)}</B><Z label="Descrição" value={l.descricao} onChange={e => u({
              ...l,
              descricao: e.target.value
            })} className="sm:col-span-2" placeholder="Ex.: conta de energia" /><Go_ label="Valor (R$)" valorC={l.valorC} onChange={e => u({
              ...l,
              valorC: e
            })} /><Z label="Vencimento" type="date" value={l.data} onChange={e => u({
              ...l,
              data: e.target.value
            })} /></div><R tone="acc" className="mt-3" disabled={!c || l.descricao.trim().length < 3 || l.valorC <= 0 || !l.data} onClick={() => {
            r({
              tipo: l.tipo,
              descricao: l.descricao.trim(),
              categoria: l.categoria,
              valorC: l.valorC,
              data: l.data
            }), u({
              ...l,
              descricao: "",
              valorC: 0
            }), s("Lançamento criado");
          }}>Lançar</R></L><L tone="dark" i={5}><h2 className="disp mb-1 text-xl">Contas a pagar</h2>{p.length === 0 ? <Li_ titulo="Nada a pagar" texto="Contas em aberto aparecem aqui, da mais próxima para a mais distante." /> : <ul className="divide-y divide-white/10">{p.map(e => <w key={e.id} l={e} />)}</ul>}</L><L i={6}><h2 className="disp mb-1 text-xl">A receber</h2>{m.length === 0 ? <Li_ titulo="Nada a receber" texto="Faturas fechadas viram contas a receber aqui." /> : <ul className="divide-y divide-white/10">{m.map(e => <w key={e.id} l={e} />)}</ul>}</L></div><div className="space-y-3"><L tone="dark" i={7}><h2 className="disp mb-3 text-xl">Vencimentos por idade</h2>{["saida", "entrada"].map(e => <div key={e} className="mb-3 last:mb-0"><h3 className="mb-1 text-sm font-semibold text-on2">{e === "saida" ? "A pagar" : "A receber"}</h3><ul className="space-y-1 text-sm">{xs.map(([t, n]) => {
                let r = f.filter(t => t.tipo === e && n(bs(t.data)));
                return <li key={t} className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2"><span>{t === "Vencido" ? <V tone={r.length ? "bad" : "neu"}>{t}</V> : t}</span><b>{r.length ? `${N(ys(r))} · ${r.length}` : "—"}</b></li>;
              })}</ul></div>)}</L><L i={8}><h2 className="disp mb-3 text-xl">Saídas por categoria (mês)</h2>{x.length === 0 ? <p className="text-sm text-on2">Nenhuma saída paga neste mês.</p> : <ul className="space-y-3 text-sm">{x.map(e => <li key={e.c}><div className="mb-1 flex justify-between"><span>{e.c}</span><b>{N(e.v)}</b></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><i className="block h-full rounded-full bg-gradient-to-r from-blue to-acc-hi" style={{
                  width: `${e.v / S * 100}%`
                }} /></div></li>)}</ul>}</L><L tone="dark" i={9}><h2 className="disp mb-1 text-xl">Já pagos e recebidos</h2>{d.length === 0 ? <p className="text-sm text-on2">Nada baixado ainda.</p> : <ul className="divide-y divide-white/10">{[...d].sort((e, t) => (t.pagoEm ?? "").localeCompare(e.pagoEm ?? "")).slice(0, 8).map(e => <w key={e.id} l={e} />)}</ul>}</L></div></div></>;
}

