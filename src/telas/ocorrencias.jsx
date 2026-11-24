import { useState } from 'react';
import { useSistema } from '../sistema/estado';
import { useToast } from '../sistema/acesso-toast';
import { Ii_, L, Li_, R, V } from '../componentes/ui';
import { Zn, atrasoDe, rotuloAtraso } from '../lib/regras';
import { ResolverOcorrencia } from '../componentes/acoes';
import { Uo_ } from './minhas-remessas';

export function Ocorrencias() {
  let {
      remessas: e,
      clienteDe: t,
      equipe: n,
      cfg: cg
    } = useSistema(),
    [rs, setRs] = useState(null),
    atr = e.map(x => [x, atrasoDe(x, cg)]).filter(x => x[1]),
    a = e.filter(e => e.status === "ocorrencia"),
    o = e.filter(e => e.ocorrencia?.resolvida);
  return <><Ii_ sub="Atrasos e entregas que não deram certo. Ao resolver, anote o que foi combinado e a nova data: o pacote volta para a expedição.">Ocorrências</Ii_>{atr.length > 0 && <div className="mb-5"><h2 className="disp mb-2 px-1 text-xl">Atrasadas <V tone="warn">{atr.length}</V></h2><p className="mb-2 px-1 text-xs text-on2">Coletas paradas e entregas com a previsão vencida. Abra o processo para trocar o motoboy ou ajustar.</p><div className="space-y-2">{atr.sort((x, y) => (y[1].horas ?? y[1].dias * 24) - (x[1].horas ?? x[1].dias * 24)).map(([x, at]) => <L key={x.id} tone="dark" className="!p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><b className="block truncate">{x.destinatario} · {x.cidade}</b><small className="text-on2">{t(x.clienteId)?.nome} · {x.codigo}</small><p className="mt-1 text-sm font-semibold text-warn">{rotuloAtraso(at)}</p></div><Uo_ id={x.id} className="text-sky" /></div></L>)}</div></div>}{a.length === 0 ? <Li_ titulo="Sem ocorrências abertas" texto="Quando o motorista registrar um problema, ele aparece aqui na hora." /> : <div className="space-y-3">{a.map((e, a) => <L key={e.id} i={a} tone="acc" className="!p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><b className="text-lg">{e.ocorrencia?.motivo}</b><span className="rounded-full bg-white/20 px-3 py-1 text-xs">{e.cidade}</span></div><p className="mt-1 text-sm text-white/85">{t(e.clienteId)?.nome} · {e.destinatario} · {e.endereco}</p>{e.ocorrencia?.detalhe && <p className="mt-1 text-sm text-white/90">“{e.ocorrencia.detalhe}”</p>}{e.ocorrencia?.foto && <img src={e.ocorrencia.foto} alt="Foto registrada pelo motoboy" className="mt-2 max-h-32 rounded-xl" />}<small className="font-mono text-xs text-white/70">{e.codigo} · motorista {n.find(t => t.id === e.motoristaId)?.nome ?? "—"} · há {Zn(e.eventos[e.eventos.length - 1].em)}</small><div><Uo_ id={e.id} className="text-white" /></div></div><R tone="on" onClick={() => setRs(e)}>Resolver e reprogramar</R></div></L>)}</div>}{o.length > 0 && <p className="mt-4 text-sm text-on2"><V tone="ok">{o.length}</V> ocorrência(s) já resolvida(s).</p>}{rs && <ResolverOcorrencia r={rs} onClose={() => setRs(null)} />}</>;
}

