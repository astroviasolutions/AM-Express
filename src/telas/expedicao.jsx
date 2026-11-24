import { useState } from 'react';
import { useSistema } from '../sistema/estado';
import { useToast } from '../sistema/acesso-toast';
import { B, Ii_, L, Li_, R, Si_, V } from '../componentes/ui';
import { Kn, P } from '../lib/regras';
import { Uo_ } from './minhas-remessas';

export function Expedicao() {
  let {
      remessas: e,
      motoristas: t,
      equipe: n,
      clienteDe: r,
      sairParaRota: i
    } = useSistema(),
    a = useToast(),
    [o, s] = useState({}),
    c = e.filter(e => e.status === "conferido"),
    l = e.filter(e => e.status === "em_rota"),
    u = [...new Set(c.map(e => e.cidade))].sort(),
    d = e => n.find(t => t.id === e)?.nome ?? "—";
  return <><Ii_ sub="Agrupe por cidade, escolha o motorista e mande para a rota. O motorista e o lojista recebem o aviso.">Expedição</Ii_><div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]"><div className="space-y-3">{c.length === 0 ? <Li_ titulo="Nada pronto para sair" texto="Depois da conferência, os pacotes aparecem aqui por cidade." /> : u.map((e, n) => <L key={e} i={n}><div className="mb-3 flex items-center justify-between"><h2 className="disp text-2xl">{e}</h2><V tone="blue">{c.filter(t => t.cidade === e).length} pacote(s)</V></div><ul className="space-y-2">{c.filter(t => t.cidade === e).map(e => <li key={e.id} className="grid gap-3 rounded-2xl bg-white/5 p-3 sm:grid-cols-[1fr_190px_auto] sm:items-end"><span className="min-w-0 text-sm"><b className="block truncate">{e.destinatario}</b><small className="text-on2">{r(e.clienteId)?.nome} · {e.volumes} vol · {Kn(e.pesoTaxG)} · previsão {P(e.previsao)}</small><Uo_ id={e.id} /></span><B label="Motorista" value={o[e.id] ?? ""} onChange={t => s(n => ({
                ...n,
                [e.id]: t.target.value
              }))}><option value="">Escolher</option>{t.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</B><R tone="acc" disabled={!o[e.id]} onClick={() => {
                i(e.id, o[e.id]), a("Saiu para a rota", `${d(o[e.id])} foi avisado.`);
              }}>Sair para rota</R></li>)}</ul></L>)}</div><L tone="dark" i={2} className="h-fit"><div className="mb-3 flex items-center justify-between"><h2 className="disp text-xl">Em rota agora</h2><V tone="warn">{l.length}</V></div>{l.length === 0 ? <p className="text-sm text-on2">Nenhum pacote na rua.</p> : <ul className="space-y-2">{l.map(e => <li key={e.id} className="rounded-2xl bg-white/5 p-3 text-sm"><div className="flex items-center justify-between gap-2"><b className="truncate">{e.cidade}</b><Si_ s={e.status} /></div><small className="text-on2">{e.destinatario} · {d(e.motoristaId)}</small><div><Uo_ id={e.id} /></div></li>)}</ul>}</L></div></>;
}

