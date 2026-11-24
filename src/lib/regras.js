import { createContext } from 'react';
import { CIDADES } from '../dados/cidades';

export var N = e => (e < 0 ? "−" : "") + "R$ " + (Math.abs(e) / 100).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+,)/g, ".");

export var Kn = e => (e / 1e3).toFixed(1).replace(".", ",") + " kg";

export var qn = e => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;

export var Jn = () => qn(new Date());

export var Yn = (e, t) => {
  let n = new Date(e + "T12:00:00");
  if (t < 0) return n.setDate(n.getDate() + t), qn(n);
  for (let e = 0; e < t;) n.setDate(n.getDate() + 1), n.getDay() !== 0 && n.getDay() !== 6 && e++;
  return qn(n);
};

export var P = e => new Date(e.length > 10 ? e : e + "T12:00:00").toLocaleDateString("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit"
}).replace(/\./g, "");

export var Xn = e => new Date(e).toLocaleTimeString("pt-BR", {
  hour: "2-digit",
  minute: "2-digit"
});

export var Zn = e => {
  let t = (Date.now() - new Date(e).getTime()) / 1e3;
  return t < 60 ? "agora" : t < 3600 ? Math.floor(t / 60) + " min" : t < 86400 ? Math.floor(t / 3600) + " h" : Math.floor(t / 86400) + " d";
};

export var Qn = e => e.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export var $n = e => (e / 100).toFixed(2);

export var er = e => Math.max(0, Math.round((parseFloat(e.replace(",", ".")) || 0) * 100));

export var tr = {
  pedido: "Aguardando coleta",
  a_caminho: "Motoboy a caminho",
  coletado: "Coletado",
  conferido: "Conferido na base",
  em_rota: "Em rota",
  entregue: "Entregue",
  ocorrencia: "Ocorrência",
  cancelada: "Cancelada"
};

export var nr = e => Qn(e.nome);

export function rr(e, t, n, r, i, a = new Date()) {
  if (!r.ativo) return {
    ok: !1,
    motivo: "inativo"
  };
  if (r.valorBaseC <= 0) return {
    ok: !1,
    motivo: "sem_valor"
  };
  let o = a.getHours() >= e.corteHora ? 2 : 1;
  if (i) return {
    ok: !0,
    precoC: i.valorC,
    tarifaC: i.valorC,
    excedenteKg: 0,
    dias: o,
    origem: "peso"
  };
  let s = nr(t),
    c = r.valorBaseC,
    l = "base";
  r.tarifas[s] === void 0 ? e.tarifas[s] !== void 0 && (c = e.tarifas[s], l = "rota") : (c = r.tarifas[s], l = "cliente");
  let u = Math.max(0, Math.ceil(n / 1e3 - e.limiteKg));
  return {
    ok: !0,
    precoC: c + u * e.excedenteKgC,
    tarifaC: c,
    excedenteKg: u,
    dias: o,
    origem: l
  };
}

export var ir = {
  cliente: "tarifa do seu contrato para esta cidade",
  rota: "tarifa da cidade",
  base: "seu valor base",
  peso: "peso personalizado"
};

export var ar = {
  limiteKg: 10,
  excedenteKgC: 100,
  corteHora: 12,
  tarifas: {
    "santo antonio da platina": 700
  },
  pesos: [{
    id: "p15",
    kg: 15,
    valorC: 3e3,
    ativo: !0
  }, {
    id: "p20",
    kg: 20,
    valorC: 4e3,
    ativo: !0
  }],
  comissaoIndicacaoC: 300,
  motoboyEntregaPadraoC: 200,
  motoboyColetaPadraoC: 0,
  motoboyFormaPadrao: "pix",
  motoboyPeriodoPadrao: "mensal",
  caixaAtivo: !0,
  saldoInicialC: 0,
  prazoFaturaDias: 7,
  categoriasEntrada: ["Fretes", "Outras entradas"],
  categoriasSaida: ["Motoboys", "Combustível", "Manutenção", "Aluguel", "Impostos", "Outras saídas"],
  metaEntregas: 0,
  metaResultadoC: 0,
  doisPassos: !1
};

export var or = {
  entrega: "Entrega",
  coleta: "Coleta",
  indicacao: "Indicação"
};

export function sr(e, t) {
  let n = [];
  for (let r of e) {
    if (r.status === "cancelada") continue;
    let e = e => r.eventos.find(t => t.tipo === e)?.em ?? r.criadoEm,
      i = (e, i, a) => {
        i && i.motoboyId === t && n.push({
          remessaId: r.id,
          codigo: r.codigo,
          tipo: e,
          valorC: i.valorC,
          pago: !!i.pagoEm,
          em: a,
          acertoId: i.acertoId
        });
      };
    i("entrega", r.pgEntrega, e("entregue")), i("coleta", r.pgColeta, e("coletado")), i("indicacao", r.comissao, r.criadoEm);
  }
  return n.sort((e, t) => e.em.localeCompare(t.em));
}

export var cr = e => e.reduce((e, t) => e + t.valorC, 0);

export var lr = e => e.filter(e => !e.pago && !e.acertoId);

export var ur = e => e.filter(e => !e.pago && e.acertoId);

export function dr(e, t) {
  let n = cr(e),
    r = t.filter(e => e.tipo === "bonus").reduce((e, t) => e + t.valorC, 0),
    i = t.filter(e => e.tipo !== "bonus"),
    a = i.filter(e => !e.reembolsado).reduce((e, t) => e + t.valorC, 0),
    o = i.filter(e => e.reembolsado).reduce((e, t) => e + t.valorC, 0);
  return {
    brutoC: n,
    descontosC: a,
    bonusC: r,
    liquidoC: n + r - a,
    naoCobradoC: o
  };
}

export var fr = (e, t) => e.filter(e => e.clienteId === t && e.status !== "cancelada" && !e.faturaId);

export var pr = e => (e.pgEntrega?.valorC ?? 0) + (e.pgColeta?.valorC ?? 0) + (e.comissao?.valorC ?? 0);

export var hr = CIDADES;

export var gr = hr.filter(e => e.ativa);

export var _r = "am-sistema-v6";

export var vr = "am-sistema-usuario";

export var yr = createContext(null);

export var br = () => new Date().toISOString();

export var xr = e => new Date(Date.now() - e * 36e5).toISOString();

export var Sr = () => crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);

export var Cr = () => "AM-" + Array.from(crypto.getRandomValues(new Uint8Array(4))).map(e => e.toString(16).padStart(2, "0")).join("").toUpperCase();

export var wr = () => String(Math.floor(Math.random() * 900) + 100);

export var Tr = e => ({
  valorColetaC: 0,
  cidade: "Santo Antônio da Platina",
  ativo: !0,
  disponivel: !0,
  todasCidades: !1,
  forma: "pix",
  chavePix: "",
  periodo: "mensal",
  whatsapp: "",
  cnh: "",
  placa: "",
  modelo: "",
  ...e
});

export var Er = [{
  id: "u-dono",
  nome: "Dono da AM Express",
  papel: "dono",
  cargo: "Diretoria (exemplo)"
}, {
  id: "u-ger",
  nome: "Gerente da matriz",
  papel: "gerente",
  cargo: "Matriz · Santo Antônio da Platina"
}, {
  id: "u-op",
  nome: "Operacional da matriz",
  papel: "operacional",
  cargo: "Matriz · Santo Antônio da Platina"
}, {
  id: "u-m1",
  nome: "Rafael M.",
  papel: "motorista",
  cargo: "Motorista · Van",
  motoboy: Tr({
    valorEntregaC: 200,
    codigoIndicacao: "101",
    chavePix: "rafael@exemplo",
    whatsapp: "(43) 90000-1001",
    placa: "AAA-0A00",
    modelo: "Van (exemplo)",
    cidade: "Santo Antônio da Platina"
  })
}, {
  id: "u-m2",
  nome: "Camila S.",
  papel: "motorista",
  cargo: "Motorista · Moto",
  motoboy: Tr({
    valorEntregaC: 250,
    valorColetaC: 100,
    codigoIndicacao: "102",
    forma: "dinheiro",
    periodo: "semanal",
    whatsapp: "(43) 90000-1002",
    placa: "BBB-0B00",
    modelo: "Moto (exemplo)",
    cidade: "Jacarezinho"
  })
}, {
  id: "u-c1",
  nome: "Papelaria Aurora",
  papel: "cliente",
  clienteId: "c1",
  cargo: "Lojista (exemplo)"
}, {
  id: "u-c2",
  nome: "Ótica Horizonte",
  papel: "cliente",
  clienteId: "c2",
  cargo: "Lojista (exemplo)"
}, {
  id: "u-c3",
  nome: "Brindes Vale Norte",
  papel: "cliente",
  clienteId: "c3",
  cargo: "Lojista (exemplo)"
}];

export var Dr = [{
  id: "c1",
  nome: "Papelaria Aurora",
  documento: "00.000.000/0001-00",
  whatsapp: "(43) 90000-0001",
  email: "contato@aurora.exemplo",
  cidade: "Santo Antônio da Platina",
  valorBaseC: 2e3,
  tarifas: {},
  ativo: !0
}, {
  id: "c2",
  nome: "Ótica Horizonte",
  documento: "00.000.000/0001-01",
  whatsapp: "(43) 90000-0002",
  email: "contato@horizonte.exemplo",
  cidade: "Jacarezinho",
  valorBaseC: 1700,
  tarifas: {},
  ativo: !0,
  indicadoPorId: "u-m2"
}, {
  id: "c3",
  nome: "Brindes Vale Norte",
  documento: "00.000.000/0001-02",
  whatsapp: "(43) 90000-0003",
  email: "contato@valenorte.exemplo",
  cidade: "Cambará",
  valorBaseC: 3500,
  tarifas: {
    jacarezinho: 3e3
  },
  ativo: !0
}];

export function Or(e, t, n, r, i, a, o, s, c, l, u, d) {
  let f = hr.find(e => e.nome === r),
    p = Dr.find(e => e.id === n),
    m = rr(e, f, l, p);
  if (!m.ok) throw Error("semente sem preço");
  let h = ["pedido", "a_caminho", "coletado", "conferido", "em_rota", "entregue"],
    g = Math.max(0, h.indexOf(o === "ocorrencia" ? "em_rota" : o)),
    _ = h.slice(0, g + 1).map((e, t) => ({
      tipo: e,
      em: new Date(Date.now() - (s - t * .9) * 36e5).toISOString()
    })),
    v = {
      id: t,
      codigo: "AM-" + (10597059 + t.length * 7919 + Number(t.replace(/\D/g, "")) * 104729).toString(16).toUpperCase().padStart(8, "0").slice(-8),
      clienteId: n,
      destinatario: i,
      telefone: "(43) 9 9999-0000",
      endereco: a,
      cidade: r,
      origem: p.cidade,
      volumes: c,
      pesoRealG: l,
      c: u[0],
      l: u[1],
      a: u[2],
      pesoTaxG: l,
      valorDeclC: 0,
      precoC: m.precoC,
      prazo: m.dias,
      previsao: Yn(Jn(), m.dias - Math.floor(s / 24)),
      status: o,
      motoristaId: d,
      criadoEm: xr(s),
      eventos: _
    };
  if (p.indicadoPorId && e.comissaoIndicacaoC > 0 && (v.comissao = {
    motoboyId: p.indicadoPorId,
    valorC: e.comissaoIndicacaoC
  }), o === "entregue") {
    v.prova = {
      recebedor: i,
      documento: "000.000.000-00",
      em: br()
    };
    let e = Er.find(e => e.id === d)?.motoboy;
    d && e && (v.pgEntrega = {
      motoboyId: d,
      valorC: e.valorEntregaC
    });
  }
  return o === "ocorrencia" && (v.eventos.push({
    tipo: "ocorrencia",
    em: xr(1)
  }), v.ocorrencia = {
    motivo: "Destinatário ausente",
    resolvida: !1
  }), v;
}

export function kr() {
  let e = ar,
    t = gr.filter(e => e.km > 0).map(e => e.nome),
    n = e => t[e % t.length],
    r = [Or(e, "r1", "c1", n(0), "Marcos Lima", "Rua das Flores, 120", "pedido", .4, 2, 2400, [30, 20, 15]), Or(e, "r2", "c2", n(1), "Beatriz Nunes", "Av. Brasil, 845", "pedido", 1.1, 1, 800, [20, 15, 10]), Or(e, "r3", "c3", n(2), "Loja Casa Azul", "Rua XV, 33", "coletado", 3, 4, 6200, [45, 35, 25]), Or(e, "r4", "c1", n(3), "Ana Paula Reis", "Rua Sete, 410", "coletado", 4, 1, 1200, [25, 18, 12]), Or(e, "r5", "c2", n(0), "Carlos Teixeira", "Travessa Luz, 9", "conferido", 6, 1, 500, [20, 15, 8]), Or(e, "r6", "c1", n(1), "Joana Prado", "Rua Minas, 77", "conferido", 7, 3, 3900, [35, 25, 20]), Or(e, "r7", "c3", n(2), "Eletro Planalto", "Av. Central, 1020", "em_rota", 9, 2, 5200, [40, 30, 25], "u-m1"), Or(e, "r8", "c2", n(3), "Sandra Moura", "Rua do Comércio, 51", "em_rota", 10, 1, 700, [20, 15, 10], "u-m2"), Or(e, "r9", "c1", n(0), "Pedro Alves", "Rua Paraná, 300", "ocorrencia", 20, 1, 1500, [25, 20, 15], "u-m1"), Or(e, "r10", "c3", n(1), "Mercado Bom Preço", "Rua Goiás, 12", "entregue", 28, 5, 9e3, [50, 40, 30], "u-m1"), Or(e, "r11", "c1", n(2), "Lúcia Ferraz", "Rua Ipê, 88", "entregue", 30, 1, 900, [20, 15, 10], "u-m2"), Or(e, "r12", "c2", n(3), "Rodrigo Dias", "Av. Norte, 5", "entregue", 52, 2, 2100, [30, 20, 15], "u-m1")],
    i = r[1];
  return r[1] = {
    ...i,
    status: "a_caminho",
    motoboyColetaId: "u-m2",
    eventos: [...i.eventos, {
      tipo: "a_caminho",
      em: xr(.5),
      por: "Camila S."
    }]
  }, {
    remessas: r,
    clientes: Dr,
    equipe: Er,
    notifs: [{
      id: "n1",
      para: ["gerente", "operacional", "motorista"],
      titulo: "Nova coleta",
      corpo: "Papelaria Aurora · 2 volumes · " + r[0].codigo,
      em: xr(.4),
      lida: !1,
      remessaId: "r1"
    }],
    cfg: e,
    faturas: [],
    acertos: [],
    ajustes: [],
    registros: [],
    caixa: [{
      id: "cx1",
      tipo: "saida",
      descricao: "Combustível da semana (exemplo)",
      categoria: "Combustível",
      valorC: 35e3,
      data: Jn(),
      pago: !0,
      pagoEm: xr(30),
      origem: "manual"
    }, {
      id: "cx2",
      tipo: "saida",
      descricao: "Aluguel da base (exemplo)",
      categoria: "Aluguel",
      valorC: 12e4,
      data: Yn(Jn(), 5),
      pago: !1,
      origem: "manual"
    }, {
      id: "cx3",
      tipo: "entrada",
      descricao: "Adiantamento de cliente (exemplo)",
      categoria: "Outras entradas",
      valorC: 8e4,
      data: Yn(Jn(), 3),
      pago: !1,
      origem: "manual"
    }]
  };
}

export function Ar() {
  try {
    let e = localStorage.getItem(_r);
    if (e) return JSON.parse(e);
  } catch {}
  return kr();
}

