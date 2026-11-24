import { createContext, useCallback, useContext, useState } from 'react';
import { Ir, Lr, Pr } from './estado';

export var Rr = [{
  id: "gerente",
  nome: "Gerente",
  resumo: "Operação e clientes; sem dinheiro",
  perm: {
    ...Lr("nenhum"),
    visao: "ver",
    analise: "ver",
    operacao: "editar",
    clientes: "editar",
    equipe: "ver",
    registros: "ver"
  }
}, {
  id: "financeiro",
  nome: "Financeiro",
  resumo: "Faturas, acertos e caixa; consulta o resto",
  perm: {
    ...Lr("nenhum"),
    visao: "ver",
    analise: "ver",
    operacao: "ver",
    clientes: "ver",
    financeiro: "editar",
    caixa: "editar"
  }
}, {
  id: "operacional",
  nome: "Operacional",
  resumo: "Processos e clientes; sem dinheiro",
  perm: {
    ...Lr("nenhum"),
    visao: "ver",
    operacao: "editar",
    clientes: "ver"
  }
}, {
  id: "atendimento",
  nome: "Atendimento",
  resumo: "Só consulta os processos",
  perm: {
    ...Lr("nenhum"),
    visao: "ver",
    operacao: "ver"
  }
}, {
  id: "leitura",
  nome: "Somente leitura",
  resumo: "Vê tudo, não altera nada",
  perm: Lr("ver")
}];

export var zr = e => Rr.find(t => Pr.every(n => e[n] === t.perm[n]))?.id ?? "personalizado";

export var Br = {
  dono: Lr("editar"),
  gerente: Rr[0].perm,
  operacional: Rr[2].perm,
  motorista: Lr("nenhum"),
  cliente: Lr("nenhum")
};

export var Vr = e => e.papel === "dono" ? Br.dono : e.permissoes ?? Br[e.papel];

export var Hr = (e, t) => e ? Vr(e)[t] ?? "nenhum" : "nenhum";

export var Ur = (e, t, n = "ver") => Ir[Hr(e, t)] >= Ir[n];

export var Wr = [{
  perm: "visao",
  itens: [{
    to: "/dono",
    rotulo: "Visão geral",
    ic: "home"
  }]
}, {
  perm: "analise",
  itens: [{
    to: "/dono/analise",
    rotulo: "Análise",
    ic: "chart"
  }]
}, {
  perm: "operacao",
  itens: [{
    to: "/op/processos",
    rotulo: "Processos",
    ic: "list"
  }, {
    to: "/op/fila",
    rotulo: "Fila de coletas",
    ic: "inbox"
  }, {
    to: "/op/conferencia",
    rotulo: "Conferência",
    ic: "scan"
  }, {
    to: "/op/expedicao",
    rotulo: "Expedição",
    ic: "truck"
  }, {
    to: "/op/ocorrencias",
    rotulo: "Ocorrências",
    ic: "alert"
  }]
}, {
  perm: "clientes",
  itens: [{
    to: "/dono/clientes",
    rotulo: "Clientes",
    ic: "users"
  }]
}, {
  perm: "financeiro",
  itens: [{
    to: "/dono/financeiro",
    rotulo: "Financeiro",
    ic: "money"
  }]
}, {
  perm: "caixa",
  itens: [{
    to: "/dono/caixa",
    rotulo: "Caixa",
    ic: "wallet"
  }]
}, {
  perm: "configuracoes",
  itens: [{
    to: "/dono/configuracoes",
    rotulo: "Configurações",
    ic: "tag"
  }]
}, {
  perm: "equipe",
  itens: [{
    to: "/dono/equipe",
    rotulo: "Equipe",
    ic: "pin"
  }]
}, {
  perm: "registros",
  itens: [{
    to: "/dono/registros",
    rotulo: "Registros",
    ic: "list"
  }]
}];

export var Gr = {
  motorista: [{
    to: "/mot",
    rotulo: "Minhas paradas",
    ic: "truck"
  }, {
    to: "/mot/ganhos",
    rotulo: "Meus ganhos",
    ic: "money"
  }],
  cliente: [{
    to: "/cli/nova",
    rotulo: "Nova remessa",
    ic: "plus"
  }, {
    to: "/cli/remessas",
    rotulo: "Minhas remessas",
    ic: "list"
  }, {
    to: "/cli/extrato",
    rotulo: "Extrato",
    ic: "money"
  }]
};

export function Kr(e, t = !0) {
  return Gr[e.papel] || Wr.filter(n => Ur(e, n.perm) && (n.perm !== "caixa" || t)).flatMap(e => e.itens);
}

export var qr = (e, t = !0) => Kr(e, t)[0]?.to ?? "/sem-acesso";

export var Jr = createContext(() => {});

export function ToastProvider({
  children: e
}) {
  let [t, n] = useState([]),
    r = useCallback((e, t) => {
      let r = Date.now() + Math.random();
      n(n => [...n.slice(-3), {
        id: r,
        titulo: e,
        corpo: t
      }]), setTimeout(() => n(e => e.filter(e => e.id !== r)), 4200);
    }, []);
  return <Jr.Provider value={r}>{e}<div className="pointer-events-none fixed inset-x-0 top-3 z-[90] flex flex-col items-center gap-2 px-3" role="status" aria-live="polite">{t.map(e => <div key={e.id} className="pop pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-light p-3 pr-4 text-ink shadow-2xl"><span className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-full bg-ok text-white"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg></span><span className="min-w-0 text-sm"><b className="block">{e.titulo}</b>{e.corpo && <span className="block truncate text-ink/70">{e.corpo}</span>}</span></div>)}</div></Jr.Provider>;
}

export var useToast = () => useContext(Jr);

export var Zr = "am-tema";

export var Qr = {
  claro: "#e9edf6",
  escuro: "#0F1E3D"
};

export var $r = () => document.documentElement.dataset.tema === "claro" ? "claro" : "escuro";

