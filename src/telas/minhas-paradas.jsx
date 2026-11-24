import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSistema } from '../sistema/estado';
import { useToast } from '../sistema/acesso-toast';
import { H, Ii_, L, Li_, R, Si_, V } from '../componentes/ui';
import { N, P, Zn } from '../lib/regras';
import { Mo_ } from './extrato';

export function MinhasParadas() {
  let {
      remessas: e,
      minhasRemessas: t,
      equipe: n,
      usuario: r,
      clienteDe: i,
      aceitarColeta: a,
      mudarStatus: o,
      alternarDisponivel: s
    } = useSistema(),
    c = useToast(),
    [l, u] = useState(null),
    d = n.find(e => e.id === r.id)?.motoboy;
  if (d && !d.ativo) return <L><b className="disp text-xl">Acesso desativado</b><p className="mt-2 text-sm text-on2">Fale com a AM Express para reativar o seu acesso.</p></L>;
  let f = e.filter(e => e.status === "pedido" && !e.motoboyColetaId && (!d || d.todasCidades || e.origem === d.cidade)),
    p = e.filter(e => e.status === "a_caminho" && e.motoboyColetaId === r.id),
    m = t.filter(e => e.status === "em_rota"),
    h = e.filter(e => e.motoboyColetaId === r.id && !["pedido", "a_caminho", "cancelada"].includes(e.status)).sort((e, t) => t.criadoEm.localeCompare(e.criadoEm)),
    g = t.filter(e => e.status === "entregue"),
    v = g.length,
    y = (e, t) => u({
      titulo: e,
      ids: t.map(e => e.id)
    }),
    b = [...new Set(m.map(e => e.cidade))].sort();
  return <><Ii_ sub="Aceite coletas e faça as entregas que a matriz atribuiu a você." acao={d && <R tone={d.disponivel ? "ok" : "line"} aria-pressed={d.disponivel} onClick={() => s(r.id)}>{d.disponivel ? "Disponível" : "Indisponível"}</R>}>Minhas paradas</Ii_><div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4"><H i={0} rotulo="Coletas livres" valor={f.length} onClick={() => y("Coletas livres", f)} /><H i={1} rotulo="Para entregar" valor={m.length} tone="acc" onClick={() => y("Para entregar", m)} /><H i={2} rotulo="Entregues" valor={v} tone="light" onClick={() => y("Entregues por mim", g)} /><H i={3} rotulo="Coletas feitas" valor={h.length} onClick={() => y("Coletas que já fiz", h)} /></div>{p.length > 0 && <div className="mb-4"><h2 className="disp mb-2 px-1 text-xl">Coletas que aceitei</h2><div className="space-y-2">{p.map(e => <L key={e.id} tone="dark" className="!p-4"><div className="flex flex-wrap items-center justify-between gap-3"><span className="min-w-0"><b className="block truncate">{i(e.clienteId)?.nome}</b><small className="text-on2">{e.volumes} volume(s) · para {e.cidade} · {e.codigo}</small></span><R tone="acc" onClick={() => {
              o(e.id, "coletado"), c("Coleta registrada", "O lojista foi avisado.");
            }}>Marcar como coletado</R></div></L>)}</div></div>}{h.length > 0 && <div className="mb-4"><h2 className="disp mb-1 px-1 text-xl">Coletas que já fiz</h2><p className="mb-2 px-1 text-xs text-on2">Depois que você marca como coletado, o pacote segue para a conferência na base e sai da sua fila. Ele continua aqui para você acompanhar até a entrega.</p><div className="space-y-2">{h.slice(0, 8).map(e => <L key={e.id} tone="dark" className="!p-4"><div className="flex flex-wrap items-center justify-between gap-3"><span className="min-w-0"><b className="block truncate">{i(e.clienteId)?.nome}</b><small className="text-on2">Coleta em {e.origem} · para {e.cidade} · {e.codigo}</small></span><Si_ s={e.status} /></div></L>)}</div></div>}<div className="mb-4"><h2 className="disp mb-2 px-1 text-xl">Coletas disponíveis</h2>{f.length === 0 ? <Li_ titulo="Nenhuma coleta livre" texto={`Quando um lojista pedir uma coleta em ${d?.todasCidades ? "qualquer cidade" : d?.cidade ?? "sua cidade"}, o aviso chega no seu celular.`} /> : <div className="space-y-2">{f.map(e => <L key={e.id} className="!p-4"><div className="flex flex-wrap items-center justify-between gap-3"><span className="min-w-0"><b className="block truncate">{i(e.clienteId)?.nome}</b><small className="text-on2">Coleta em {e.origem} · para {e.cidade} · pedido há {Zn(e.criadoEm)}</small></span><R tone="on" disabled={!d?.disponivel} title={d?.disponivel ? void 0 : "Fique disponível para aceitar"} onClick={() => {
              a(e.id, r.id), c("Coleta aceita", "O lojista foi avisado de que você está a caminho.");
            }}>Aceitar coleta</R></div></L>)}</div>}</div><h2 className="disp mb-2 px-1 text-xl">Entregas</h2>{m.length === 0 ? <Li_ titulo="Sem entregas agora" texto="Quando a matriz mandar um pacote para a rota, o aviso chega no seu celular." /> : b.map((e, t) => <div key={e} className="mb-4"><h3 className="mb-2 px-1 text-sm font-semibold uppercase tracking-[.12em] text-on2">{e}</h3><div className="space-y-2">{m.filter(t => t.cidade === e).map((e, n) => <Link key={e.id} to={`/mot/${e.id}`} style={{
          "--i": t + n
        }} className="rise block rounded-3xl bg-g1 p-4 transition active:scale-[.98] hover:bg-g2"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><b className="block truncate text-base">{e.destinatario}</b><span className="block text-sm text-on2">{e.endereco}</span></div><V tone="warn">{e.volumes} vol</V></div><div className="mt-3 flex items-center justify-between text-xs text-on2"><span>{i(e.clienteId)?.nome} · {P(e.previsao)}{d && <> · você recebe {N(d.valorEntregaC)}</>}</span><span className="font-semibold text-sky">Abrir entrega →</span></div></Link>)}</div></div>)}{l && <Mo_ titulo={l.titulo} ids={l.ids} onClose={() => u(null)} />}</>;
}

