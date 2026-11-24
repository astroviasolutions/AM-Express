import { useState } from 'react';
import { useSistema } from '../sistema/estado';
import { useToast } from '../sistema/acesso-toast';
import { N, P, Xn, cr, dr, lr, or, sr, ur } from '../lib/regras';
import { H, Ii_, L, Li_, R, V } from '../componentes/ui';
import { Xo, Zo } from './configuracoes';
import { ss } from './financeiro';
import { Mo_ } from './extrato';

export function MeusGanhos() {
  let {
      remessas: e,
      ajustes: t,
      acertos: n,
      equipe: r,
      usuario: i
    } = useSistema(),
    a = useToast(),
    [o, s] = useState(null),
    c = r.find(e => e.id === i.id),
    l = c?.motoboy,
    u = sr(e, i.id),
    d = lr(u),
    f = ur(u),
    p = u.filter(e => e.pago),
    m = t.filter(e => e.motoboyId === i.id && !e.acertoId),
    h = dr(d, m),
    g = n.filter(e => e.motoboyId === i.id);
  return <><Ii_ sub={l ? `Você recebe por ${Xo[l.forma]}, ${Zo[l.periodo].toLowerCase()}. Os valores de exemplo seguem o seu cadastro.` : void 0} acao={<R tone="line" onClick={() => c && ss(c, "Pendente até agora", d, m).then(() => a("Extrato gerado", "Se o arquivo não abrir, procure em Downloads.")).catch(e => a("Não foi possível gerar o PDF", e instanceof Error ? e.message : "Tente de novo."))}>Baixar extrato (PDF)</R>}>Meus ganhos</Ii_><div className="grid gap-3 sm:grid-cols-3"><H i={0} rotulo="Ainda sem acerto" valor={N(h.liquidoC)} tone="acc" nota={`${d.length} lançamento(s)${h.descontosC ? ` · descontos ${N(h.descontosC)}` : ""}`} onClick={d.length ? () => s({
        titulo: "Ainda sem acerto",
        ids: [...new Set(d.map(e => e.remessaId))]
      }) : void 0} /><H i={1} rotulo="Aprovado, a pagar" valor={N(cr(f))} nota="a AM já aprovou o acerto" onClick={f.length ? () => s({
        titulo: "Aprovado, a pagar",
        ids: [...new Set(f.map(e => e.remessaId))]
      }) : void 0} /><H i={2} rotulo="Já recebido" valor={N(cr(p))} tone="light" nota={`${p.length} lançamento(s)`} onClick={p.length ? () => s({
        titulo: "Já recebido",
        ids: [...new Set(p.map(e => e.remessaId))]
      }) : void 0} /></div><div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_.7fr]"><L i={3}><h2 className="disp mb-3 text-xl">Lançamentos pendentes</h2>{d.length === 0 && m.length === 0 ? <Li_ titulo="Nada pendente" texto="Entregas, coletas e indicações aparecem aqui até serem acertadas." /> : <ul className="divide-y divide-white/10 text-sm">{d.map(e => <li key={e.remessaId + e.tipo} role="button" tabIndex={0} onClick={() => s({
            titulo: e.codigo,
            ids: [e.remessaId],
            inicial: e.remessaId
          })} onKeyDown={t => t.key === "Enter" && s({
            titulo: e.codigo,
            ids: [e.remessaId],
            inicial: e.remessaId
          })} className="flex cursor-pointer items-center justify-between gap-3 py-3 hover:bg-white/5"><span><b className="block">{or[e.tipo]}</b><small className="font-mono text-xs text-on2">{e.codigo} · {P(e.em)}</small></span><b>{N(e.valorC)}</b></li>)}{m.map(e => <li key={e.id} className="flex items-center justify-between gap-3 py-3"><span><b className="block">{e.tipo === "bonus" ? "Bônus" : e.tipo === "adiantamento" ? "Adiantamento" : "Desconto"}</b><small className="text-on2">{e.descricao}{e.reembolsado ? " · reembolsado pelo cliente, não descontado" : ""}</small></span><b className={e.tipo === "bonus" ? "text-ok" : e.reembolsado ? "text-on2 line-through" : "text-acc-hi"}>{e.tipo === "bonus" ? "+" : "−"}{" "}{N(e.valorC)}</b></li>)}</ul>}</L><L tone="dark" i={4} className="h-fit"><h2 className="disp mb-3 text-xl">Meus acertos</h2>{g.length === 0 ? <p className="text-sm text-on2">Ainda não houve acerto.</p> : <ul className="divide-y divide-white/10 text-sm">{g.map(e => <li key={e.id} className="flex items-center justify-between gap-3 py-3"><span><b className="block">{e.rotulo}</b><small className="text-on2">{P(e.criadoEm)}{" "}{Xn(e.criadoEm)}</small></span><span className="text-right"><b>{N(e.liquidoC)}</b><small className="block">{e.status === "pago" ? <V tone="ok">Pago</V> : <V tone="warn">A pagar</V>}</small></span></li>)}</ul>}</L></div>{o && <Mo_ titulo={o.titulo} ids={o.ids} inicial={o.inicial} onClose={() => s(null)} />}</>;
}

