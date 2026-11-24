import { pr } from './regras';

export var jo = e => e.toLocaleDateString("pt-BR", {
  day: "2-digit",
  month: "2-digit"
});

export var Mo = e => new Date(e.getFullYear(), e.getMonth(), e.getDate());

export var No = e => new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59, 999);

export function Po(e, t = new Date()) {
  if (e === "semanal") {
    let e = Mo(new Date(t.getFullYear(), t.getMonth(), t.getDate() - (t.getDay() + 6) % 7)),
      n = No(new Date(e.getFullYear(), e.getMonth(), e.getDate() + 6));
    return {
      ini: e,
      fim: n,
      rotulo: `Semana de ${jo(e)} a ${jo(n)}`
    };
  }
  if (e === "quinzenal") {
    let e = t.getDate() <= 15;
    return {
      ini: new Date(t.getFullYear(), t.getMonth(), e ? 1 : 16),
      fim: No(e ? new Date(t.getFullYear(), t.getMonth(), 15) : new Date(t.getFullYear(), t.getMonth() + 1, 0)),
      rotulo: `${e ? "1ª" : "2ª"} quinzena de ${t.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
      })}`
    };
  }
  return {
    ini: new Date(t.getFullYear(), t.getMonth(), 1),
    fim: No(new Date(t.getFullYear(), t.getMonth() + 1, 0)),
    rotulo: t.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric"
    })
  };
}

export var Fo = (e, t) => Po(e, new Date(t.ini.getTime() - 1));

export var Io = (e, t) => {
  let n = new Date(e).getTime();
  return n >= t.ini.getTime() && n <= t.fim.getTime();
};

export var Lo = [["hoje", "Hoje"], ["7", "Últimos 7 dias"], ["30", "Últimos 30 dias"], ["mes", "Este mês"], ["mesant", "Mês anterior"]];

export function Ro(e, t = new Date()) {
  let n = Mo(t),
    r = (e, t, n) => ({
      ini: e,
      fim: No(t),
      rotulo: n
    });
  return e === "hoje" ? r(n, n, "Hoje") : e === "7" ? r(new Date(n.getTime() - 5184e5), n, "Últimos 7 dias") : e === "30" ? r(new Date(n.getTime() - 25056e5), n, "Últimos 30 dias") : e === "mes" ? r(new Date(t.getFullYear(), t.getMonth(), 1), new Date(t.getFullYear(), t.getMonth() + 1, 0), "Este mês") : r(new Date(t.getFullYear(), t.getMonth() - 1, 1), new Date(t.getFullYear(), t.getMonth(), 0), "Mês anterior");
}

export function zo(e) {
  let t = e.fim.getTime() - e.ini.getTime() + 1;
  return {
    ini: new Date(e.ini.getTime() - t),
    fim: new Date(e.ini.getTime() - 1),
    rotulo: "período anterior"
  };
}

export var W = (e, t) => e.eventos.find(e => e.tipo === t)?.em;

export var G = (e, t) => {
  let n = new Map();
  for (let r of e) n.set(t(r), [...(n.get(t(r)) ?? []), r]);
  return [...n.entries()].map(([e, t]) => ({
    k: e,
    n: t.length,
    ids: t.map(e => e.id)
  })).sort((e, t) => t.n - e.n);
};

export function Bo(e, t, n = {}) {
  let r = e.remessas.filter(e => e.status !== "cancelada" && (!n.cliente || e.clienteId === n.cliente) && (!n.motoboy || e.motoristaId === n.motoboy)),
    i = r.filter(e => {
      let n = W(e, "entregue");
      return n && Io(n, t);
    }),
    a = r.filter(e => e.eventos.some(e => e.tipo === "ocorrencia" && Io(e.em, t))),
    o = i.filter(e => (W(e, "entregue") ?? "").slice(0, 10) > e.previsao),
    s = i.length + a.filter(e => !i.includes(e)).length,
    c = i.reduce((e, t) => e + t.precoC, 0),
    l = i.reduce((e, t) => e + pr(t), 0),
    u = c - l,
    d = e.clientes.map(e => {
      let t = i.filter(t => t.clienteId === e.id),
        n = t.reduce((e, t) => e + t.precoC, 0),
        r = t.reduce((e, t) => e + pr(t), 0);
      return {
        cliente: e,
        n: t.length,
        receitaC: n,
        repasseC: r,
        margemC: n - r,
        pct: c ? n / c : 0,
        ids: t.map(e => e.id)
      };
    }).filter(e => e.n > 0).sort((e, t) => t.receitaC - e.receitaC),
    f = e.equipe.filter(e => e.papel === "motorista").map(e => {
      let t = i.filter(t => t.motoristaId === e.id),
        n = a.filter(n => n.motoristaId === e.id && !t.includes(n));
      return {
        m: e,
        entregas: t.length,
        ocorrencias: n.length,
        taxa: t.length + n.length ? t.length / (t.length + n.length) : null,
        ganhoC: t.reduce((e, t) => e + pr(t), 0),
        ids: t.map(e => e.id)
      };
    }).filter(e => e.entregas + e.ocorrencias > 0).sort((e, t) => t.entregas - e.entregas);
  return {
    entregues: i,
    foraPrazo: o,
    ocorrencias: a,
    noPrazoPct: i.length ? 1 - o.length / i.length : null,
    ocorrPct: s ? a.length / s : null,
    receitaC: c,
    repasseC: l,
    margemC: u,
    margemPct: c ? u / c : null,
    porCliente: d,
    porMotoboy: f,
    falhasCidade: G(a, e => e.cidade),
    falhasMotivo: G(a, e => e.ocorrencia?.motivo ?? "Sem motivo")
  };
}

export var Vo = (e, t) => e == null || t == null || t === 0 ? null : (e - t) / Math.abs(t);

export function Ho(e, t = new Date()) {
  let n = Mo(t);
  return Array.from({
    length: 14
  }, (t, r) => {
    let i = new Date(n.getTime() - (13 - r) * 864e5),
      a = {
        ini: i,
        fim: No(i)
      };
    return {
      k: i.toLocaleDateString("pt-BR"),
      l: String(i.getDate()).padStart(2, "0"),
      v: e.filter(e => e.status === "entregue" && (W(e, "entregue") ?? "") !== "" && Io(W(e, "entregue"), a)).length
    };
  });
}

