import { useSistema } from '../sistema/estado';
import { useToast } from '../sistema/acesso-toast';
import { Ii_, L, Li_, R, V } from '../componentes/ui';
import { Zn } from '../lib/regras';
import { Uo_ } from './minhas-remessas';

export function Ocorrencias() {
  let {
      remessas: e,
      clienteDe: t,
      equipe: n,
      resolverOcorrencia: r
    } = useSistema(),
    i = useToast(),
    a = e.filter(e => e.status === "ocorrencia"),
    o = e.filter(e => e.ocorrencia?.resolvida);
  return <><Ii_ sub="Entregas que não deram certo. Resolva e reprograme: o pacote volta para a expedição.">Ocorrências</Ii_>{a.length === 0 ? <Li_ titulo="Sem ocorrências abertas" texto="Quando o motorista registrar um problema, ele aparece aqui na hora." /> : <div className="space-y-3">{a.map((e, a) => <L key={e.id} i={a} tone="acc" className="!p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><b className="text-lg">{e.ocorrencia?.motivo}</b><span className="rounded-full bg-white/20 px-3 py-1 text-xs">{e.cidade}</span></div><p className="mt-1 text-sm text-white/85">{t(e.clienteId)?.nome} · {e.destinatario} · {e.endereco}</p><small className="font-mono text-xs text-white/70">{e.codigo} · motorista {n.find(t => t.id === e.motoristaId)?.nome ?? "—"} · há {Zn(e.eventos[e.eventos.length - 1].em)}</small><div><Uo_ id={e.id} className="text-white" /></div></div><R tone="on" onClick={() => {
            r(e.id), i("Ocorrência resolvida", "O pacote voltou para a expedição.");
          }}>Resolver e reprogramar</R></div></L>)}</div>}{o.length > 0 && <p className="mt-4 text-sm text-on2"><V tone="ok">{o.length}</V> ocorrência(s) já resolvida(s).</p>}</>;
}

