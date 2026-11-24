import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../sistema/acesso-toast';
import { useSistema } from '../sistema/estado';
import { hi } from './login';
import { L, Ni_, R, Ti_, V } from '../componentes/ui';
import { P, Xn } from '../lib/regras';

export var vi = [["pedido", "Pedido recebido"], ["a_caminho", "Motoboy a caminho da coleta"], ["coletado", "Pacote coletado"], ["conferido", "No centro de distribuição"], ["em_rota", "Saiu para entrega"], ["entregue", "Entregue"]];

export var yi = e => e.replace(/[^a-z0-9]/gi, "").toUpperCase();

export function Rastreio() {
  let {
      codigo: e
    } = useParams(),
    t = useNavigate(),
    n = useToast(),
    {
      remessas: r
    } = useSistema(),
    [i, a] = useState(e ?? ""),
    [o, s] = useState(() => "Notification" in window ? Notification.permission : "denied"),
    c = e ? r.find(t => yi(t.codigo) === yi(e)) : void 0,
    l = c ? vi.findIndex(([e]) => e === (c.status === "ocorrencia" ? "em_rota" : c.status)) : -1,
    u = useRef(null);
  useEffect(() => {
    if (!c) u.current = null;else {
      if (u.current && u.current !== c.status && o === "granted") {
        let e = c.status === "entregue" ? "Seu pacote foi entregue" : c.status === "em_rota" ? "Seu pacote saiu para entrega" : "Seu pacote avançou";
        new Notification(e, {
          body: `${c.codigo} · ${c.cidade}`,
          icon: "/logo-cor.png"
        });
      }
      u.current = c.status;
    }
  }, [c, o]);
  let d = c ? c.status === "entregue" ? "Entregue" : c.status === "ocorrencia" ? "Tentativa de entrega sem sucesso" : c.status === "cancelada" ? "Coleta cancelada" : `A caminho de ${c.cidade}` : "",
    f = c && c.status !== "entregue" && c.status !== "cancelada",
    p = c?.eventos.find(e => e.tipo === "entregue")?.em;
  return <main className="mx-auto min-h-dvh max-w-2xl px-4 py-6"><header className="mb-6 flex items-center justify-between gap-3"><a href={hi} aria-label="Voltar ao site da AM Express" className="inline-flex min-h-11 items-center"><Ni_ className="h-9 w-auto" /></a><Ti_ /></header><h1 className="disp text-[clamp(30px,6vw,46px)] leading-none">Onde está meu pacote?</h1><p className="mt-2 text-on2">Digite o código que veio na etiqueta ou no aviso.</p><form className="mt-5 flex gap-2" onSubmit={e => {
      e.preventDefault(), i.trim() && t(`/rastreio/${encodeURIComponent(i.trim())}`);
    }}><input value={i} onChange={e => a(e.target.value)} aria-label="Código de rastreio" placeholder="AM-XXXXXXXX" autoCapitalize="characters" autoComplete="off" className="min-h-12 min-w-0 flex-1 rounded-full border border-white/15 bg-g1 px-5 font-mono text-base uppercase text-on outline-none focus-visible:ring-2 focus-visible:ring-sky" /><R tone="acc" type="submit">Rastrear</R></form>{e && !c && <L className="mt-6"><b>Não encontramos esse código.</b><p className="mt-1 text-sm text-on2">Confira se digitou igual à etiqueta. Se o pedido foi feito agora há pouco, tente de novo em alguns minutos.</p></L>}{c && <L className="mt-6" i={1}><div className="flex flex-wrap items-center justify-between gap-3"><span className="font-mono text-sm text-on2">{c.codigo}</span>{c.status === "entregue" ? <V tone="ok">Entregue</V> : c.status === "ocorrencia" ? <V tone="bad">Ocorrência</V> : c.status === "cancelada" ? <V>Cancelada</V> : <V tone="blue">Em andamento</V>}</div><h2 className="disp mt-3 text-[clamp(24px,5vw,34px)] leading-tight">{d}</h2>{f && <p className="mt-1 text-on2">Previsão de entrega: <b className="text-on">{P(c.previsao)}</b></p>}{c.status === "entregue" && p && <p className="mt-1 text-on2">Entregue em <b className="text-on">{P(p)} às {Xn(p)}</b>. O comprovante da entrega foi registrado.</p>}{c.status === "ocorrencia" && <p className="mt-1 text-sm text-on2">A transportadora vai reprogramar a entrega e entrar em contato.</p>}<ol className="mt-6" aria-label="Etapas da entrega">{vi.map(([e, t], n) => {
          let r = c.eventos.find(t => t.tipo === e),
            i = !!r && c.status !== "cancelada",
            a = n === l && c.status !== "entregue" && c.status !== "cancelada";
          return <li key={e} className="relative grid grid-cols-[22px_1fr_auto] gap-3 pb-5 last:pb-0">{n < vi.length - 1 && <span className={"absolute left-[10px] top-6 h-[calc(100%-12px)] w-0.5 " + (i && c.eventos.find(e => e.tipo === vi[n + 1][0]) ? "bg-ok" : "bg-white/15")} aria-hidden />}<span className={"mt-1 h-[14px] w-[14px] justify-self-center rounded-full border-2 " + (i ? "border-ok bg-ok" : a ? "border-sky" : "border-on2/50")} aria-hidden /><span className={"text-sm " + (i ? "font-medium" : "text-on2")}>{t}{a && !i && <small className="block text-xs text-sky">próxima etapa</small>}</span><time className="text-xs text-on2">{r ? `${P(r.em)} · ${Xn(r.em)}` : ""}</time></li>;
        })}</ol><div className="mt-6 flex flex-wrap items-center gap-2 border-t border-dashed border-white/15 pt-4">{o !== "granted" && "Notification" in window && <R tone="line" onClick={() => Notification.requestPermission().then(e => {
          s(e), n(e === "granted" ? "Avisos ativados neste aparelho" : "Avisos não ativados");
        })}>Avisar neste aparelho</R>}<R tone="line" onClick={() => navigator.clipboard?.writeText(location.href).then(() => n("Link copiado"))}>Copiar link</R></div><p className="mt-3 text-xs text-on2">Neste protótipo o aviso aparece enquanto esta página estiver aberta. Na versão real ele chega como notificação do celular, igual aos apps de compra, mesmo com a página fechada.</p></L>}<p className="mt-8 text-xs text-on2">Por segurança, esta página não mostra nome, endereço, telefone nem valor.</p></main>;
}

