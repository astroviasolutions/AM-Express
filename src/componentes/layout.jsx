import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Mr, useSistema } from '../sistema/estado';
import { Kr, Ur, useToast } from '../sistema/acesso-toast';
import { Di_, Ni_, Pi_, R, Ti_, ri } from './ui';
import { Zn } from '../lib/regras';

export function Layout() {
  let {
      usuario: e,
      sair: t,
      meusAvisos: n,
      marcarLidas: r,
      resetDemo: i,
      cfg: a,
      remessas: o,
      equipe: s
    } = useSistema(),
    c = useToast(),
    l = useNavigate(),
    [u, d] = useState(!1),
    [f, p] = useState(!1),
    m = useRef(null),
    [h, g] = useState(() => {
      try {
        return localStorage.getItem("am-menu") === "1";
      } catch {
        return !1;
      }
    }),
    v = () => g(e => {
      try {
        localStorage.setItem("am-menu", e ? "0" : "1");
      } catch {}
      return !e;
    }),
    y = o.filter(e => e.status === "ocorrencia"),
    [b, x] = useState(!1),
    S = n.filter(e => !e.lida).length;
  useEffect(() => {
    let e = new Set(n.map(e => e.id));
    m.current && n.filter(e => !m.current.has(e.id)).forEach(e => {
      c(e.titulo, e.corpo), "Notification" in window && Notification.permission === "granted" && new Notification(e.titulo, {
        body: e.corpo,
        icon: "/logo-cor.png"
      });
    }), m.current = e;
  }, [n, c]);
  let C = Ur(e, "operacao");
  useEffect(() => {
    if (!C) return;
    let e = 0;
    try {
      e = Number(sessionStorage.getItem("am-oc-visto") || 0);
    } catch {}
    if (y.length < e) try {
      sessionStorage.setItem("am-oc-visto", String(y.length));
    } catch {} else y.length > e && x(!0);
  }, [y.length, C]);
  let w = () => {
    x(!1);
    try {
      sessionStorage.setItem("am-oc-visto", String(y.length));
    } catch {}
  };
  if (!e) return null;
  let T = Kr(e, a.caixaAtivo);
  return <div style={{
    "--menu-w": h ? "236px" : "76px"
  }} className="mx-auto grid h-full max-w-[1500px] grid-rows-[auto_1fr] gap-3 p-3 pb-[88px] md:grid-rows-1 md:pb-3 md:[grid-template-columns:var(--menu-w)_1fr] md:transition-[grid-template-columns] md:duration-300 md:ease-out"><aside className={ri("fixed inset-x-3 bottom-3 z-40 md:static md:flex md:flex-col md:gap-3", h ? "md:items-stretch" : "md:items-center")}><div className={ri("mb-1 hidden items-center md:flex", h ? "justify-between pl-1" : "flex-col gap-2")}><div className="grid h-12 w-12 flex-none place-items-center rounded-full border border-white/10 bg-g1"><Ni_ className="h-7 w-auto" /></div><button type="button" onClick={v} aria-expanded={h} aria-label={h ? "Recolher o menu" : "Abrir o menu com os nomes"} title={h ? "Recolher o menu" : "Abrir o menu com os nomes"} className="group grid h-9 w-9 place-items-center rounded-full bg-g1 text-on2 transition hover:bg-g2 hover:text-on"><svg viewBox="0 0 24 24" className={ri("h-4 w-4 transition-transform duration-300", h ? "" : "rotate-180")} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 6l-6 6 6 6" /></svg></button></div><nav aria-label="Menu" className={ri("scroll-thin flex max-w-full gap-1 overflow-x-auto rounded-[30px] bg-light p-2 shadow-2xl md:justify-start md:max-h-[calc(100dvh-160px)] md:flex-col md:justify-start md:overflow-y-auto md:overflow-x-hidden", h ? "md:items-stretch" : "md:items-center")}>{T.map((e, t) => <NavLink key={e.to} to={e.to} end title={e.rotulo} aria-label={e.rotulo} className={({
          isActive: e
        }) => ri("group relative flex min-h-12 min-w-[64px] shrink-0 flex-col items-center justify-center rounded-full px-1 text-[10px] font-medium md:min-w-0 md:shrink transition-[width,background-color,color,transform] duration-300 md:h-12 md:flex-row md:text-sm", h ? "md:w-full md:justify-start md:gap-3 md:px-3.5" : "md:w-12 md:justify-center md:gap-0 md:px-0", e ? "bg-ink text-white" : "text-[#55607c] hover:bg-white")}><span className="relative inline-flex transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-active:scale-95"><Pi_ n={e.ic} />{e.to === "/op/ocorrencias" && y.length > 0 && <span className="ping2 absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-acc px-1 text-[9px] font-bold leading-none text-white">{y.length}</span>}</span><span className="mt-0.5 block max-w-[60px] truncate text-center md:hidden">{e.rotulo.split(" ")[0]}</span><span style={{
            transitionDelay: h ? `${70 + t * 28}ms` : "0ms"
          }} className={ri("hidden overflow-hidden whitespace-nowrap font-medium transition-all duration-300 ease-out md:inline-block", h ? "max-w-[160px] translate-x-0 opacity-100" : "max-w-0 -translate-x-2 opacity-0")}>{e.rotulo}</span></NavLink>)}</nav></aside><div className="flex min-h-0 min-w-0 flex-col gap-3 md:col-start-2"><header className="flex items-center justify-between gap-3 px-1"><div className="min-w-0"><div className="truncate text-xs text-on2">Matriz · Santo Antônio da Platina</div><div className="flex items-center gap-2"><span className="truncate text-sm font-semibold">{e.nome}</span><span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-on2">{Mr[e.papel]}</span></div></div><div className="relative flex items-center gap-2"><span className="hidden rounded-full border border-white/10 bg-g0 px-3 py-2 text-xs text-on2 sm:inline-flex"><i className="mr-2 mt-1.5 inline-block h-2 w-2 rounded-full bg-warn" />Dados de exemplo</span><Ti_ /><button type="button" aria-label={`Avisos, ${S} não lidos`} onClick={() => {
            d(e => !e), p(!1);
          }} className="relative grid h-11 w-11 place-items-center rounded-full bg-g1 hover:bg-g2"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 17V11a6 6 0 0112 0v6l2 2H4z" /><path d="M10 21h4" /></svg>{S > 0 && <span className="ping2 absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-acc px-1 text-[11px] font-bold">{S}</span>}</button><button type="button" aria-label="Menu da conta" onClick={() => {
            p(e => !e), d(!1);
          }} className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-acc to-acc-deep text-sm font-bold">{e.nome.slice(0, 2).toUpperCase()}</button>{u && <div className="pop absolute right-0 top-14 z-50 w-[min(360px,calc(100vw-24px))] rounded-3xl bg-light p-4 text-ink shadow-2xl"><div className="mb-2 flex items-center justify-between"><b>Avisos</b><button type="button" className="text-xs underline" onClick={r}>Marcar como lidos</button></div><ul className="scroll-thin max-h-80 space-y-2 overflow-auto">{n.length === 0 && <li className="p-4 text-center text-sm text-ink/60">Nada por aqui ainda.</li>}{n.slice(0, 12).map(e => <li key={e.id} className={ri("rounded-2xl p-3 text-sm", e.lida ? "bg-white" : "bg-white ring-2 ring-acc/60")}><div className="flex justify-between gap-2"><b>{e.titulo}</b><time className="text-xs text-ink/50">{Zn(e.em)}</time></div><span className="text-ink/70">{e.corpo}</span></li>)}</ul>{"Notification" in window && Notification.permission !== "granted" && <button type="button" onClick={() => Notification.requestPermission().then(e => c(e === "granted" ? "Avisos ativados neste aparelho" : "Avisos não ativados"))} className="mt-3 min-h-11 w-full rounded-full bg-ink text-sm font-semibold text-white">Ativar avisos neste aparelho</button>}</div>}{f && <div className="pop absolute right-0 top-14 z-50 w-64 rounded-3xl bg-light p-3 text-ink shadow-2xl"><div className="px-2 pb-2 text-sm"><b className="block">{e.nome}</b><span className="text-ink/60">{e.cargo}</span></div><button type="button" className="block min-h-11 w-full rounded-2xl px-3 text-left text-sm hover:bg-white" onClick={() => {
              t(), l("/login");
            }}>Trocar de perfil</button><button type="button" className="block min-h-11 w-full rounded-2xl px-3 text-left text-sm hover:bg-white" onClick={() => {
              i(), p(!1), c("Dados de exemplo reiniciados");
            }}>Reiniciar dados de exemplo</button></div>}</div></header><main className="scroll-thin min-h-0 flex-1 overflow-auto rounded-[28px] px-0.5 pb-6" id="conteudo"><Outlet /></main></div><Di_ aberto={b && C && y.length > 0} onFechar={w} titulo={`${y.length} ${y.length === 1 ? "ocorrência aberta" : "ocorrências abertas"}`}><div className="space-y-3 text-sm text-ink"><p className="text-ink/70">Entregas que não deram certo e esperam uma decisão. Quanto antes resolver, menos o cliente liga perguntando.</p><ul className="space-y-2">{y.slice(0, 5).map(e => <li key={e.id} className="rounded-2xl bg-acc/10 p-3"><b className="block">{e.ocorrencia?.motivo}</b><small className="text-ink/70">{e.destinatario} · {e.cidade}{s.find(t => t.id === e.motoristaId) ? ` · ${s.find(t => t.id === e.motoristaId)?.nome}` : ""}</small></li>)}{y.length > 5 && <li className="text-ink/60">e mais {y.length - 5}…</li>}</ul><div className="flex flex-wrap gap-2"><R tone="acc" onClick={() => {
            w(), l("/op/ocorrencias");
          }}>Ver as ocorrências</R><R tone="line" className="!border-ink/30 !text-ink" onClick={w}>Lembrar depois</R></div></div></Di_></div>;
}

