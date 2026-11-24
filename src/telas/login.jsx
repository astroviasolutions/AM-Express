import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mr, useSistema } from '../sistema/estado';
import { qr } from '../sistema/acesso-toast';
import { Ni_, Ti_ } from '../componentes/ui';

export var hi = "https://am-express-site.vercel.app";

export var gi = {
  dono: "Vê todas as filiais, preços, clientes e equipe.",
  gerente: "Coordena a fila, a conferência e a expedição da matriz.",
  operacional: "Recebe os avisos de coleta e confere os pacotes.",
  motorista: "Vê só as próprias paradas e registra a entrega.",
  cliente: "Cota, gera a etiqueta e acompanha as remessas dele."
};

export function Login() {
  let {
      entrar: e,
      equipe: t,
      cfg: n
    } = useSistema(),
    r = useNavigate(),
    [i] = useSearchParams();
  useEffect(() => {
    let a = i.get("perfil"),
      o = a ? t.find(e => e.id === a) : void 0;
    o && (e(o), r(i.get("ir") || qr(o, n.caixaAtivo), {
      replace: !0
    }));
  }, []);
  let a = t => {
    e(t), r(qr(t, n.caixaAtivo));
  };
  return <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center gap-8 p-5 py-10"><div className="rise"><div className="flex items-center justify-between"><a href={hi} aria-label="Voltar ao site da AM Express" className="inline-flex min-h-11 items-center"><Ni_ className="h-12 w-auto" /></a><Ti_ /></div><h1 className="disp mt-6 text-[clamp(34px,6vw,64px)] leading-[.95]">Sistema de gestão</h1><p className="mt-3 max-w-xl text-on2">Demonstração com dados de exemplo. Escolha um perfil para ver as telas dele. Na versão real, cada pessoa entra com e-mail e senha e só enxerga o que é dela.</p><p className="mt-2 text-sm text-on2">Dica: abra o perfil <b className="text-on">Cliente</b> numa aba e o <b className="text-on">Operacional</b> em outra. Quando o lojista gera uma remessa, a equipe recebe o aviso na hora.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{["cliente", "operacional", "gerente", "motorista", "dono"].map((e, n) => {
        let r = t.filter(t => t.papel === e);
        return <section key={e} style={{
          "--i": n
        }} className="rise rounded-[28px] bg-g1 p-5"><b className="disp text-2xl">{Mr[e]}</b><p className="mt-1 min-h-10 text-sm text-on2">{gi[e]}</p><div className="mt-3 flex flex-col gap-2">{r.map(e => <button key={e.id} type="button" onClick={() => a(e)} className="flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 text-left text-sm transition hover:bg-white/15"><span><b className="block">{e.nome}</b><small className="text-on2">{e.cargo}</small></span><span aria-hidden>→</span></button>)}</div></section>;
      })}<section style={{
        "--i": 5
      }} className="rise rounded-[28px] bg-gradient-to-br from-acc to-acc-deep p-5"><b className="disp text-2xl">Comprador</b><p className="mt-1 min-h-10 text-sm text-white/85">Sem login. Acompanha o pacote pelo código ou pelo QR da etiqueta.</p><Link to="/rastreio" className="mt-3 flex min-h-12 items-center justify-between rounded-2xl bg-white/15 px-4 text-sm font-semibold hover:bg-white/25">Abrir o rastreio público <span aria-hidden>→</span></Link><Link to="/teste" className="mt-2 flex min-h-12 items-center justify-between rounded-2xl bg-white px-4 text-sm font-semibold text-ink hover:opacity-90">Roteiro de teste guiado <span aria-hidden>→</span></Link></section></div></div>;
}

