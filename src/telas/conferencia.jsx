import { useState } from 'react';
import { useSistema } from '../sistema/estado';
import { useToast } from '../sistema/acesso-toast';
import { Kn, N, hr, rr } from '../lib/regras';
import { Ii_, L, Li_, R, V, Z } from '../componentes/ui';
import { Uo_ } from './minhas-remessas';

export function Conferencia() {
  let {
      remessas: e,
      clienteDe: t,
      mudarStatus: n,
      ajustarPeso: r,
      cfg: i
    } = useSistema(),
    a = useToast(),
    [o, s] = useState(""),
    [c, l] = useState(""),
    u = e.filter(e => e.status === "coletado"),
    d = e.find(e => e.codigo === o.trim().toUpperCase() && e.status === "coletado"),
    f = Math.round((parseFloat(c.replace(",", ".")) || 0) * 1e3),
    p = d && f ? f - d.pesoRealG : 0,
    m = d ? t(d.clienteId) : void 0,
    h = d && f && p !== 0 && m ? rr(i, hr.find(e => e.nome === d.cidade), f, m, i.pesos.find(e => e.id === d.pesoPersonalizadoId)) : null,
    g = h && h.ok ? h : null,
    v = !!d && !!f && Math.abs(p) > Math.max(100, d.pesoRealG * .1);
  return <><Ii_ sub="Leia o QR ou o código da etiqueta e pese o pacote. Se o peso medido for diferente, o valor é ajustado.">Conferência</Ii_><div className="grid gap-3 lg:grid-cols-[1fr_1fr]"><L><Z label="Código da etiqueta" value={o} onChange={e => {
          s(e.target.value), l("");
        }} placeholder="Leia o código de barras ou digite" autoFocus autoComplete="off" className="font-mono" />{o && !d && <p className="mt-3 text-sm text-on2">Nenhum pacote coletado com esse código.</p>}{d && <div className="mt-5 space-y-4"><div><b className="text-lg">{m?.nome}</b><p className="text-sm text-on2">Para {d.destinatario} · {d.cidade} · {d.volumes} volume(s)</p></div><div className="grid grid-cols-2 gap-4"><div className="rounded-2xl bg-white/5 p-3 text-sm"><small className="block text-on2">Peso declarado</small><b>{Kn(d.pesoRealG)}</b></div><div className="rounded-2xl bg-white/5 p-3 text-sm"><small className="block text-on2">Valor atual</small><b>{N(d.precoC)}</b></div></div><Z label="Peso medido na balança (kg)" value={c} onChange={e => l(e.target.value)} inputMode="decimal" placeholder={String(d.pesoRealG / 1e3)} />{v && g && <div className="rounded-2xl bg-warn/15 p-3 text-sm text-warn">Divergência de {Kn(Math.abs(p))}{" "}{p > 0 ? "a mais" : "a menos"}. O valor passa de <b>{N(d.precoC)}</b> para <b>{N(g.precoC)}</b> e o lojista é avisado.</div>}<R tone="acc" className="w-full" onClick={() => {
            d && (f && p !== 0 && r(d.id, f), n(d.id, "conferido"), a("Pacote conferido", v ? "Cobrança ajustada pelo peso medido." : d.codigo), s(""), l(""));
          }}>{v ? "Confirmar com ajuste" : "Confirmar conferência"}</R></div>}</L><L tone="dark" i={1}><div className="mb-3 flex items-center justify-between"><h2 className="disp text-xl">Aguardando conferência</h2><V tone="blue">{u.length}</V></div>{u.length === 0 ? <Li_ titulo="Nada para conferir" texto="Os pacotes coletados aparecem aqui." /> : <ul className="space-y-2">{u.map(e => <li key={e.id} className="flex items-center gap-1"><button type="button" onClick={() => {
              s(e.codigo), l("");
            }} className="flex min-h-14 w-full flex-1 items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 text-left text-sm transition hover:bg-white/15"><span className="min-w-0"><b className="block truncate">{t(e.clienteId)?.nome}</b><small className="font-mono text-xs text-on2">{e.codigo} · {e.cidade}</small></span><span aria-hidden>→</span></button><Uo_ id={e.id} /></li>)}</ul>}</L></div></>;
}

