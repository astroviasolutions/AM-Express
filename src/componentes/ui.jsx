import { useEffect, useState } from 'react';
import { $r, Qr, Zr } from '../sistema/acesso-toast';
import { P, Xn, tr } from '../lib/regras';

export function ei() {
  let e = $r() === "claro" ? "escuro" : "claro";
  document.documentElement.dataset.tema = e, document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", Qr[e]);
  try {
    localStorage.setItem(Zr, e);
  } catch {}
  return e;
}

export function Ti_({
  className: e = ""
}) {
  let [t, n] = useState($r),
    r = t === "escuro";
  return <button type="button" onClick={() => n(ei())} aria-label={r ? "Mudar para o tema claro" : "Mudar para o tema escuro"} title={r ? "Tema claro" : "Tema escuro"} className={"grid h-11 w-11 flex-none place-items-center rounded-full bg-g1 text-on transition hover:bg-g2 " + e}><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{r ? <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" /></> : <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />}</svg></button>;
}

export function Ni_({
  className: e = "h-9 w-auto"
}) {
  return <><img src="/logo-branca.png" alt="AM Express" className={"logo-escuro " + e} /><img src="/logo-cor.png" alt="AM Express" className={"logo-claro " + e} /></>;
}

export var ri = (...e) => e.filter(Boolean).join(" ");

export function L({
  children: e,
  className: t,
  tone: n = "g1",
  i: r = 0
}) {
  let i = {
    g1: "bg-g1 text-on",
    dark: "bg-g0 text-on border border-white/10",
    light: "bg-light text-ink",
    acc: "bg-gradient-to-br from-acc to-acc-deep text-white"
  }[n];
  return <section style={{
    "--i": r
  }} className={ri("rise min-w-0 rounded-[28px] p-5 sm:p-6", i, t)}>{e}</section>;
}

export function Ii_({
  children: e,
  sub: t,
  acao: n
}) {
  return <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div className="min-w-0"><h1 className="disp text-[clamp(26px,3.4vw,40px)] leading-none">{e}</h1>{t && <p className="mt-2 max-w-xl text-sm text-on2">{t}</p>}</div>{n}</div>;
}

export function R({
  tone: e = "on",
  className: t,
  ...n
}) {
  let r = {
    on: "bg-on text-frame hover:opacity-90",
    acc: "bg-acc text-white hover:bg-acc-hi",
    line: "border border-white/30 text-on hover:bg-white/10",
    dark: "bg-ink text-white hover:opacity-85",
    ok: "bg-ok text-frame hover:brightness-110"
  }[e];
  return <button type="button" {...n} className={ri("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40", r, t)} />;
}

export var ai = "min-h-12 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-[15px] text-on outline-none transition placeholder:text-on2/60 focus:border-sky focus:bg-white/10";

export function Z({
  label: e,
  className: t,
  ...n
}) {
  return <label className={ri("block", t)}><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.13em] text-on2">{e}</span><input {...n} className={ai} /></label>;
}

export function B({
  label: e,
  children: t,
  className: n,
  ...r
}) {
  return <label className={ri("block", n)}><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.13em] text-on2">{e}</span><select {...r} className={ri(ai, "[&>option]:text-ink")}>{t}</select></label>;
}

export var oi = {
  pedido: "bg-sky/20 text-sky",
  a_caminho: "bg-sky/20 text-sky",
  coletado: "bg-sky/20 text-sky",
  conferido: "bg-blue/25 text-sky",
  em_rota: "bg-warn/20 text-warn",
  entregue: "bg-ok/20 text-ok",
  ocorrencia: "bg-acc-hi/20 text-acc-hi",
  cancelada: "bg-white/10 text-on2"
};

export function Si_({
  s: e
}) {
  return <span className={ri("inline-flex h-7 items-center gap-2 whitespace-nowrap rounded-full px-3 text-xs font-medium", oi[e])}><i className="h-1.5 w-1.5 rounded-full bg-current" />{tr[e]}</span>;
}

export function Ci_({
  label: e,
  checked: t,
  onChange: n,
  className: r
}) {
  return <label className={ri("flex min-h-11 cursor-pointer items-center gap-3 text-sm", r)}><input type="checkbox" checked={t} onChange={e => n(e.target.checked)} className="size-5 accent-[#d63a37]" />{e}</label>;
}

export function V({
  children: e,
  tone: t = "neu"
}) {
  let n = {
    neu: "bg-white/10 text-on2",
    ok: "bg-ok/20 text-ok",
    warn: "bg-warn/20 text-warn",
    bad: "bg-acc-hi/20 text-acc-hi",
    blue: "bg-blue/25 text-sky"
  }[t];
  return <span className={ri("inline-flex h-7 items-center whitespace-nowrap rounded-full px-3 text-xs font-medium", n)}>{e}</span>;
}

export function Li_({
  titulo: e,
  texto: t
}) {
  return <div className="grid place-items-center rounded-3xl border border-dashed border-white/15 p-10 text-center"><div><b className="block text-lg">{e}</b><span className="mt-1 block text-sm text-on2">{t}</span></div></div>;
}

export function H({
  rotulo: e,
  valor: t,
  nota: n,
  tone: r = "g1",
  i,
  onClick: a
}) {
  let o = r === "light" ? "text-ink/60" : r === "acc" ? "text-white/85" : "text-on2",
    s = <><span className={ri("text-xs font-medium", o)}>{e}</span><div className={ri("disp mt-1 text-[clamp(34px,4vw,52px)] leading-none", r === "acc" && "text-white")}>{t}</div>{n && <span className={ri("mt-2 block text-xs", o)}>{n}</span>}{a && <span className={ri("mt-3 inline-flex items-center gap-1 text-xs font-semibold", r === "light" ? "text-blue" : r === "acc" ? "text-white" : "text-sky")}>ver os processos →</span>}</>;
  return <L tone={r} i={i} className={ri("!p-5", a && "transition hover:-translate-y-0.5 hover:shadow-xl")}>{a ? <button type="button" onClick={a} aria-label={`${e}: ver os processos`} className="-m-5 block w-[calc(100%+40px)] rounded-[28px] p-5 text-left">{s}</button> : s}</L>;
}

export function Ui_({
  r: e
}) {
  let t = ["pedido", "a_caminho", "coletado", "conferido", "em_rota", "entregue"];
  return <ol className="relative space-y-0">{t.map((n, r) => {
      let i = e.eventos.find(e => e.tipo === n),
        a = !!i;
      return <li key={n} className="relative grid grid-cols-[22px_1fr_auto] gap-3 pb-4 last:pb-0">{r < t.length - 1 && <span className={ri("absolute left-[10px] top-6 h-[calc(100%-12px)] w-0.5", a && e.eventos.find(e => e.tipo === t[r + 1]) ? "bg-blue" : "bg-white/15")} />}<span className={ri("mt-1 h-[14px] w-[14px] justify-self-center rounded-full border-2", a ? "border-blue bg-blue" : "border-white/30 bg-transparent")} /><span className={ri("text-sm", a ? "text-on" : "text-on2/70")}>{tr[n]}{i?.por && <small className="block text-xs text-on2">{i.por}</small>}</span><time className="text-right text-xs text-on2" title={i?.original ? `Horário original: ${P(i.original)} ${Xn(i.original)}${i.editadoPor ? ` · corrigido por ${i.editadoPor}` : ""}` : void 0}>{i ? `${P(i.em)} ${Xn(i.em)}` : ""}{i?.original && <small className="block text-[10px] text-warn">corrigido</small>}</time></li>;
    })}{e.ocorrencia && <li className="mt-2 rounded-2xl bg-acc-hi/15 p-3 text-sm text-acc-hi">Ocorrência: {e.ocorrencia.motivo}{e.ocorrencia.resolvida ? " (resolvida)" : ""}</li>}</ol>;
}

export function Di_({
  aberto: e,
  onFechar: t,
  children: n,
  titulo: r,
  largo: i
}) {
  return useEffect(() => {
    if (!e) return;
    let n = e => e.key === "Escape" && t();
    return window.addEventListener("keydown", n), () => window.removeEventListener("keydown", n);
  }, [e, t]), e ? <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-3 backdrop-blur-sm" onMouseDown={e => e.target === e.currentTarget && t()}><div role="dialog" aria-modal="true" aria-label={r} className={ri("pop scroll-thin max-h-[92dvh] w-full overflow-auto rounded-[28px] bg-light p-5 text-ink sm:p-6", i ? "max-w-3xl" : "max-w-lg")}>{r && <div className="mb-3 flex items-center justify-between gap-3"><h2 className="disp text-2xl">{r}</h2><button type="button" aria-label="Fechar" onClick={t} className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl">×</button></div>}{n}</div></div> : null;
}

export var fi = {
  home: "<rect x=\"4\" y=\"4\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"13\" y=\"4\" width=\"7\" height=\"5\" rx=\"2\"/><rect x=\"13\" y=\"11\" width=\"7\" height=\"9\" rx=\"2\"/><rect x=\"4\" y=\"13\" width=\"7\" height=\"7\" rx=\"2\"/>",
  inbox: "<path d=\"M4 13l2-8h12l2 8\"/><path d=\"M4 13v6h16v-6h-5l-1 2h-4l-1-2z\"/>",
  scan: "<path d=\"M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M7 12h10\"/>",
  truck: "<path d=\"M3 7h11v9H3z\"/><path d=\"M14 10h4l3 3v3h-7z\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/><circle cx=\"17\" cy=\"18\" r=\"2\"/>",
  alert: "<path d=\"M12 4l9 16H3z\"/><path d=\"M12 10v4M12 17v.5\"/>",
  plus: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 8v8M8 12h8\"/>",
  list: "<path d=\"M8 6h12M8 12h12M8 18h12M4 6h.5M4 12h.5M4 18h.5\"/>",
  money: "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"2.5\"/>",
  users: "<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6\"/><path d=\"M16 5.5a3 3 0 010 5.5M18 14.5c1.8.7 3 2.5 3 5.5\"/>",
  tag: "<path d=\"M3 12V4h8l10 10-8 8z\"/><circle cx=\"8\" cy=\"8\" r=\"1.5\"/>",
  chart: "<path d=\"M4 20V10M10 20V4M16 20v-7M22 20H2\"/>",
  wallet: "<path d=\"M4 7h15a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1z\"/><path d=\"M4 7l12-3v3M16 13h2\"/>",
  pin: "<path d=\"M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/>"
};

export var Pi_ = ({
  n: e
}) => <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{
  __html: fi[e]
}} />;

