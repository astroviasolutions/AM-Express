import { useEffect, useMemo, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { Jn, Kn, N, P, Yn, gr, ir, rr } from '../lib/regras';
import { useSistema } from '../sistema/estado';
import { useToast } from '../sistema/acesso-toast';
import { B, Ci_, Di_, Ii_, L, R, V, Z } from '../componentes/ui';

export function Eo_({
  r: e,
  cliente: t
}) {
  let n = useRef(null),
    [r, i] = useState("");
  return useEffect(() => {
    n.current && JsBarcode(n.current, e.codigo, {
      format: "CODE128",
      displayValue: !1,
      height: 56,
      margin: 0,
      width: 2,
      background: "#ffffff"
    }), QRCode.toDataURL(`${location.origin}/rastreio/${e.codigo}`, {
      margin: 0,
      width: 220
    }).then(i).catch(() => i(""));
  }, [e.codigo]), <div className="print-area mx-auto flex aspect-[2/3] w-[300px] flex-col gap-2 bg-white p-4 font-mono text-[#111] shadow-xl" style={{
    maxWidth: "100%"
  }}><div className="flex items-center justify-between border-b-2 border-[#111] pb-2"><img src="/logo-cor.png" alt="AM Express" className="h-9 w-auto" /><div className="text-right"><small className="block text-[8px] uppercase tracking-widest text-[#555]">Remessa</small><b className="text-[15px] tracking-wide">{e.codigo}</b></div></div><div className="border-b border-[#111] pb-2"><small className="block text-[8px] uppercase tracking-widest text-[#555]">Destino</small><b className="disp block text-[26px] leading-[1.02] !tracking-normal">{e.cidade}</b><div className="mt-1 text-[11px] font-semibold leading-tight">{e.destinatario}</div><div className="text-[10px] leading-tight">{e.endereco}</div></div><div className="grid grid-cols-3 gap-2 border-b border-[#111] pb-2"><div><small className="block text-[8px] uppercase tracking-widest text-[#555]">Peso cobrado</small><b className="text-[12px]">{Kn(e.pesoTaxG)}</b></div><div><small className="block text-[8px] uppercase tracking-widest text-[#555]">Volumes</small><b className="text-[12px]">{e.volumes}</b></div><div><small className="block text-[8px] uppercase tracking-widest text-[#555]">Previsão</small><b className="text-[12px]">{P(e.previsao)}</b></div></div><div className="border-b border-[#111] pb-2 text-[10px] leading-tight"><small className="block text-[8px] uppercase tracking-widest text-[#555]">Remetente</small>{t?.nome ?? "—"}<small className="mt-1 block text-[8px] uppercase tracking-widest text-[#555]">Filial de coleta</small>Matriz · Santo Antônio da Platina</div><div className="mt-auto flex items-center gap-3"><svg ref={n} className="h-14 min-w-0 flex-1" />{r && <img src={r} alt="QR do rastreio" className="h-16 w-16 flex-none" />}</div><div className="text-center text-[7px] uppercase tracking-widest text-[#777]">Etiqueta de exemplo · sem validade</div></div>;
}

export var to = [["Envelope", 300, [35, 25, 3]], ["Caixa P", 1200, [20, 15, 10]], ["Caixa M", 2400, [30, 20, 15]], ["Caixa G", 6e3, [45, 35, 25]]];

export var no = ["Mesmo dia", "Dia seguinte", "Em 2 dias", "Em 3 dias"];

export function NovaRemessa() {
  let {
      usuario: e,
      cfg: t,
      clienteDe: n,
      criarRemessa: r
    } = useSistema(),
    i = useToast(),
    a = n(e.clienteId),
    o = useMemo(() => [...gr].sort((e, t) => e.nome.localeCompare(t.nome, "pt-BR")), []),
    [s, c] = useState({
      destinatario: "",
      telefone: "",
      endereco: "",
      cidade: o.find(e => e.km > 0).nome,
      origem: a.cidade,
      volumes: 1,
      peso: "1.2",
      c: 20,
      l: 15,
      a: 10,
      valor: "",
      pers: "",
      grande: !1
    }),
    [l, u] = useState(1),
    [d, f] = useState(null),
    p = (e, t) => c(n => ({
      ...n,
      [e]: t
    })),
    m = o.find(e => e.nome === s.cidade),
    h = t.pesos.find(e => e.id === s.pers && e.ativo) ?? null,
    g = Math.round(h ? h.kg * 1e3 : (parseFloat(s.peso.replace(",", ".")) || 0) * 1e3),
    v = Math.round((parseFloat(s.valor.replace(",", ".")) || 0) * 100),
    y = g > 0 && s.c > 0 && s.l > 0 && s.a > 0 && s.volumes > 0 ? rr(t, m, g, a, h) : null,
    b = y && y.ok ? y : null,
    x = !!b && !s.grande && s.destinatario.trim().length > 1 && s.endereco.trim().length > 4,
    S = () => {
      if (!x) return;
      let e = r({
        clienteId: a.id,
        destinatario: s.destinatario.trim(),
        telefone: s.telefone.trim(),
        endereco: s.endereco.trim(),
        cidade: s.cidade,
        origem: s.origem,
        volumes: s.volumes,
        pesoRealG: g,
        pesoPersonalizadoId: h?.id,
        c: s.c,
        l: s.l,
        a: s.a,
        valorDeclC: v
      });
      f(e), i("Etiqueta gerada", "A equipe da matriz foi avisada agora.");
    },
    C = () => {
      f(null), c(e => ({
        ...e,
        destinatario: "",
        telefone: "",
        endereco: "",
        valor: ""
      }));
    };
  return <><Ii_ sub="Informe o destino, o peso e as medidas. O valor e o prazo aparecem na hora, e a etiqueta sai pronta para imprimir.">Nova remessa</Ii_><div className="grid gap-3 lg:grid-cols-[1.15fr_.85fr]"><L><div className="grid gap-4 sm:grid-cols-2"><Z label="Nome do destinatário" value={s.destinatario} onChange={e => p("destinatario", e.target.value)} placeholder="Quem vai receber" autoComplete="off" /><Z label="Telefone (opcional)" value={s.telefone} onChange={e => p("telefone", e.target.value)} placeholder="(43) 9 0000-0000" inputMode="tel" /><Z label="Endereço de entrega" className="sm:col-span-2" value={s.endereco} onChange={e => p("endereco", e.target.value)} placeholder="Rua, número, bairro" /><B label="Cidade de coleta" className="sm:col-span-2" value={s.origem} onChange={e => p("origem", e.target.value)}>{gr.map(e => <option key={e.ibge} value={e.nome}>{e.nome}</option>)}</B><B label="Cidade de destino" className="sm:col-span-2" value={s.cidade} onChange={e => p("cidade", e.target.value)}>{o.map(e => <option key={e.ibge} value={e.nome}>{e.nome}</option>)}</B></div><div className="mt-5"><span className="mb-2 block text-[11px] font-semibold uppercase tracking-[.13em] text-on2">Embalagem</span><div className="flex flex-wrap gap-2" role="group" aria-label="Embalagens comuns">{to.map((e, t) => <button key={e[0]} type="button" aria-pressed={l === t} onClick={() => {
              u(t), c(t => ({
                ...t,
                peso: String(e[1] / 1e3),
                c: e[2][0],
                l: e[2][1],
                a: e[2][2]
              }));
            }} className={"min-h-11 rounded-full border px-4 text-sm transition " + (l === t ? "border-on bg-on text-frame" : "border-white/20 hover:bg-white/10")}>{e[0]}</button>)}</div></div><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4"><Z label="Peso real (kg)" value={s.peso} onChange={e => {
            p("peso", e.target.value), u(-1);
          }} inputMode="decimal" /><Z label="Volumes" type="number" min={1} value={s.volumes} onChange={e => p("volumes", Math.max(1, +e.target.value || 1))} /><Z label="Valor declarado (R$)" value={s.valor} onChange={e => p("valor", e.target.value)} inputMode="decimal" placeholder="0" className="col-span-2" /></div><div className="mt-4 grid grid-cols-3 gap-4"><Z label="Compr. (cm)" type="number" min={1} value={s.c} onChange={e => {
            p("c", +e.target.value), u(-1);
          }} /><Z label="Larg. (cm)" type="number" min={1} value={s.l} onChange={e => {
            p("l", +e.target.value), u(-1);
          }} /><Z label="Alt. (cm)" type="number" min={1} value={s.a} onChange={e => {
            p("a", +e.target.value), u(-1);
          }} /></div>{t.pesos.some(e => e.ativo) && <B label="Ou escolha um peso personalizado" className="mt-4" value={s.pers} onChange={e => p("pers", e.target.value)}><option value="">Usar o peso informado</option>{t.pesos.filter(e => e.ativo).map(e => <option key={e.id} value={e.id}>{e.kg} kg · {N(e.valorC)}</option>)}</B>}<Ci_ label="Pacote maior que 1,00 × 1,00 m" checked={s.grande} onChange={e => p("grande", e)} className="mt-2" />{s.grande && <p className="mt-1 rounded-2xl bg-warn/15 p-3 text-sm text-warn">Pacotes maiores que 1,00 × 1,00 m não são aceitos para coleta regular. Fale com a AM Express para verificar uma entrega especial.</p>}</L><div className="flex flex-col gap-3"><L tone="dark" i={1} className="relative overflow-hidden">{y && !y.ok ? <div className="space-y-2 text-sm"><V tone="warn">{y.motivo === "inativo" ? "Conta desativada" : "Valor base não configurado"}</V><b className="block text-base">Não é possível solicitar coletas no momento</b><p className="text-on2">{y.motivo === "inativo" ? "Sua conta está temporariamente desativada." : "Para solicitar coletas, entre em contato com a AM Express para configurar seu valor base."}</p></div> : b ? <><div className="flex flex-wrap items-center justify-between gap-2"><V tone={b.dias >= 2 ? "warn" : "blue"}>{no[b.dias]}</V><span className="text-xs text-on2">{m.km === 0 ? "Dentro da cidade" : `${m.km} km por estrada${m.estimado ? " (estimado)" : ""}`}</span></div><div className="mt-4 grid grid-cols-2 gap-4"><div><small className="text-[10px] font-semibold uppercase tracking-[.13em] text-sky">Previsão de entrega</small><b className="disp mt-1 block text-[clamp(24px,3vw,32px)] leading-none">{P(Yn(Jn(), b.dias))}</b></div><div><small className="text-[10px] font-semibold uppercase tracking-[.13em] text-sky">Valor</small><b className="disp mt-1 block text-[clamp(24px,3vw,32px)] leading-none">{N(b.precoC)}</b></div></div><p className="mt-4 border-t border-dashed border-white/20 pt-3 text-xs leading-relaxed text-on2">Para {m.nome}: <b className="text-on">{N(b.tarifaC)}</b> ({ir[b.origem]}){b.origem === "peso" ? "." : <> até {t.limiteKg} kg.{" "}{b.excedenteKg > 0 ? <>Excedente de <b className="text-on">{b.excedenteKg} kg</b> a {N(t.excedenteKgC)} por kg.</> : <>Seu pacote ({Kn(g)}) está dentro do limite.</>}</>}</p></> : <p className="text-sm text-on2">Preencha peso e medidas para ver o valor.</p>}</L><L tone="light" i={2}><p className="text-sm text-ink/70">Ao gerar a etiqueta, a equipe da matriz recebe o aviso na hora, no painel e no celular.</p><R tone="acc" className="mt-4 w-full" disabled={!x} onClick={S}>Gerar etiqueta e avisar a equipe</R>{!x && <p className="mt-2 text-xs text-ink/60">Falta o nome do destinatário e o endereço.</p>}</L></div></div><Di_ aberto={!!d} onFechar={C} titulo="Etiqueta pronta" largo>{d && <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start"><Eo_ r={d} cliente={a} /><div className="space-y-3 text-sm"><p><b>{d.codigo}</b> para <b>{d.cidade}</b>. A equipe da matriz já foi avisada.</p><p className="text-ink/70">Imprima em etiqueta térmica 100×150 mm (escolha esse tamanho na impressão) e cole no volume. O QR leva o comprador direto ao rastreio.</p><div className="flex flex-wrap gap-2"><R tone="dark" onClick={() => window.print()}>Imprimir etiqueta</R><R tone="line" className="!border-ink/30 !text-ink hover:!bg-white" onClick={C}>Nova remessa</R></div></div></div>}</Di_></>;
}

