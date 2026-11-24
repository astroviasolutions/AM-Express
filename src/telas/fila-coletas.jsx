import { useEffect, useMemo, useState } from 'react';
import { $n, Kn, N, P, Zn, er, gr, ir, pesoTarifavelG, rr } from '../lib/regras';
import { B, Di_, H, Ii_, L, Li_, R, V, Z } from '../componentes/ui';
import { useSistema } from '../sistema/estado';
import { Ur, useToast } from '../sistema/acesso-toast';
import { Eo_ } from './nova-remessa';
import { Mo_ } from './extrato';

export function Go_({
  label: e,
  valorC: t,
  onChange: n,
  className: r,
  disabled: i
}) {
  let [a, o] = useState($n(t));
  return useEffect(() => o($n(t)), [t]), <Z label={e} inputMode="decimal" value={a} disabled={i} className={r} onChange={e => o(e.target.value)} onBlur={() => n(er(a))} />;
}

export function _o({
  onClose: e
}) {
  let {
      clientes: t,
      motoristas: n,
      cfg: r,
      criarRemessa: i,
      atribuirColeta: a,
      clienteDe: o
    } = useSistema(),
    s = useToast(),
    c = useMemo(() => [...gr].sort((e, t) => e.nome.localeCompare(t.nome, "pt-BR")), []),
    l = t.filter(e => e.ativo),
    [u, d] = useState({
      clienteId: l[0]?.id ?? "",
      destinatario: "",
      telefone: "",
      endereco: "",
      origem: l[0]?.cidade ?? "Santo Antônio da Platina",
      enderecoColeta: "",
      c: 20,
      l: 15,
      a: 10,
      cidade: c.find(e => e.km > 0)?.nome ?? "",
      peso: "1",
      volumes: 1,
      pers: "",
      manualC: 0,
      motoboy: ""
    }),
    [f, p] = useState(null),
    m = (e, t) => d(n => ({
      ...n,
      [e]: t
    })),
    h = t.find(e => e.id === u.clienteId),
    g = c.find(e => e.nome === u.cidade),
    v = r.pesos.find(e => e.id === u.pers && e.ativo) ?? null,
    y = Math.round(v ? v.kg * 1e3 : (parseFloat(u.peso.replace(",", ".")) || 0) * 1e3),
    cb = pesoTarifavelG(r, y, u.c, u.l, u.a, u.volumes),
    b = h && g && y > 0 ? rr(r, g, cb.tarifavelG, h, v) : null,
    x = !!h && !!g && y > 0 && u.destinatario.trim().length > 1 && u.endereco.trim().length > 4 && (b && b.ok || u.manualC > 0);
  return <Di_ aberto onFechar={e} titulo={f ? "Processo criado" : "Novo processo"} largo>{f ? <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start"><Eo_ r={f} cliente={o(f.clienteId)} /><div className="space-y-3 text-sm text-ink"><p><b>{f.codigo}</b> para <b>{f.cidade}</b>, de {o(f.clienteId)?.nome}. O cliente e a equipe foram avisados.</p><p className="text-ink/70">Imprima em etiqueta térmica 100×150 mm e cole no volume.</p><div className="flex flex-wrap gap-2"><R tone="dark" onClick={() => window.print()}>Imprimir etiqueta</R><R tone="line" className="!border-ink/30 !text-ink" onClick={() => {
            p(null), d(e => ({
              ...e,
              destinatario: "",
              telefone: "",
              endereco: "",
              manualC: 0,
              motoboy: ""
            }));
          }}>Criar outro</R><R tone="line" className="!border-ink/30 !text-ink" onClick={e}>Fechar</R></div></div></div> : <div className={"space-y-4 [&_input]:!border-ink/20 [&_input]:!bg-white [&_input]:!text-ink [&_select]:!border-ink/20 [&_select]:!bg-white [&_select]:!text-ink [&_span]:!text-ink/60"}><p className="rounded-2xl bg-ink/5 p-3 text-xs text-ink/70">Use quando o pedido chegou por telefone, WhatsApp ou balcão. O processo entra na fila como se o cliente tivesse pedido, e fica registrado quem criou.</p><div className="grid gap-4 sm:grid-cols-2"><B label="Cliente" value={u.clienteId} className="sm:col-span-2" onChange={e => {
          let n = t.find(t => t.id === e.target.value);
          d(t => ({
            ...t,
            clienteId: e.target.value,
            origem: n?.cidade ?? t.origem
          }));
        }}>{l.map(e => <option key={e.id} value={e.id}>{e.nome}{e.valorBaseC <= 0 ? " (sem valor base)" : ""}</option>)}</B><Z label="Nome do destinatário" value={u.destinatario} onChange={e => m("destinatario", e.target.value)} autoComplete="off" /><Z label="Telefone do destinatário" value={u.telefone} onChange={e => m("telefone", e.target.value)} inputMode="tel" placeholder="(43) 9 0000-0000" /><Z label="Endereço de entrega" className="sm:col-span-2" value={u.endereco} onChange={e => m("endereco", e.target.value)} placeholder="Rua, número, bairro" /><B label="Cidade de coleta" value={u.origem} onChange={e => m("origem", e.target.value)}>{c.map(e => <option key={e.ibge} value={e.nome}>{e.nome}</option>)}</B><Z label="Endereço de coleta" className="sm:col-span-2" value={u.enderecoColeta || h?.endereco || ""} onChange={e => m("enderecoColeta", e.target.value)} placeholder="Rua, número, bairro" /><B label="Cidade de entrega" value={u.cidade} onChange={e => m("cidade", e.target.value)}>{c.map(e => <option key={e.ibge} value={e.nome}>{e.nome}</option>)}</B><Z label="Peso (kg)" value={v ? String(v.kg) : u.peso} disabled={!!v} onChange={e => m("peso", e.target.value)} inputMode="decimal" /><Z label="Volumes" type="number" min={1} value={u.volumes} onChange={e => m("volumes", Math.max(1, +e.target.value || 1))} /><Z label="Compr. (cm)" type="number" min={1} value={u.c} onChange={e => m("c", +e.target.value)} /><Z label="Larg. (cm)" type="number" min={1} value={u.l} onChange={e => m("l", +e.target.value)} /><Z label="Alt. (cm)" type="number" min={1} value={u.a} onChange={e => m("a", +e.target.value)} />{r.pesos.some(e => e.ativo) && <B label="Peso personalizado (opcional)" value={u.pers} onChange={e => m("pers", e.target.value)} className="sm:col-span-2"><option value="">Usar o peso informado</option>{r.pesos.filter(e => e.ativo).map(e => <option key={e.id} value={e.id}>{e.kg} kg · {N(e.valorC)}</option>)}</B>}<B label="Motoboy da coleta (opcional)" value={u.motoboy} onChange={e => m("motoboy", e.target.value)} className="sm:col-span-2"><option value="">Deixar no mural da cidade</option>{n.map(e => <option key={e.id} value={e.id}>{e.nome}{e.motoboy?.cidade ? ` · ${e.motoboy.cidade}` : ""}</option>)}</B></div><div className="rounded-2xl border border-ink/10 p-3 text-sm text-ink">{b && b.ok ? <p>Valor calculado: <b>{N(b.precoC)}</b>{" "}<small className="text-ink/60">({ir[b.origem]}{b.excedenteKg > 0 ? `, com ${b.excedenteKg} kg de excedente` : ""})</small></p> : <p className="text-acc">{h ? b && !b.ok && b.motivo === "inativo" ? "Cliente desativado." : "Este cliente ainda não tem valor base. Informe o valor à mão abaixo." : "Escolha um cliente."}</p>}<div className="mt-2 max-w-xs"><Go_ label={b && b.ok ? "Valor à mão (opcional, substitui o calculado)" : "Valor à mão (R$)"} valorC={u.manualC} onChange={e => m("manualC", e)} /></div></div><R tone="dark" className="w-full" disabled={!x} onClick={() => {
        if (!x || !h) return;
        let e = i({
          clienteId: h.id,
          destinatario: u.destinatario.trim(),
          telefone: u.telefone.trim(),
          endereco: u.endereco.trim(),
          cidade: u.cidade,
          origem: u.origem,
          enderecoColeta: (u.enderecoColeta || h?.endereco || "").trim(),
          volumes: u.volumes,
          pesoRealG: y,
          pesoPersonalizadoId: v?.id,
          c: u.c,
          l: u.l,
          a: u.a,
          valorDeclC: 0,
          precoManualC: u.manualC > 0 ? u.manualC : void 0
        });
        u.motoboy && a(e.id, u.motoboy), p(e), s("Processo criado", `${e.codigo} para ${e.cidade}.`);
      }}>Criar processo e gerar etiqueta</R>{!x && <p className="-mt-2 text-xs text-ink/60">Falta o nome, o endereço ou o valor.</p>}</div>}</Di_>;
}

export function Vo_() {
  let {
      meusAvisos: e
    } = useSistema(),
    t = e[0];
  return <div className="tema-escuro mx-auto w-full max-w-[290px] rounded-[34px] border border-white/10 bg-gradient-to-b from-g2 to-g0 p-4 shadow-2xl"><div className="mb-3 text-center text-[11px] text-on2">Tela de bloqueio do celular</div><div className="text-center font-display text-5xl font-semibold tracking-tight text-on/90">{new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      })}</div><div key={t?.id} className="mt-4 rounded-2xl bg-white/90 p-3 text-ink backdrop-blur"><div className="flex items-center gap-2 text-[11px] text-ink/60"><img src="/logo-cor.png" alt="" className="h-4 w-auto" />AM EXPRESS<span className="ml-auto">{t ? Zn(t.em) : "agora"}</span></div><b className="mt-1 block text-sm">{t?.titulo ?? "Nova coleta"}</b><span className="block text-xs text-ink/70">{t?.corpo ?? "Os avisos chegam aqui, como no Mercado Livre."}</span></div></div>;
}

export function FilaColetas() {
  let {
      remessas: e,
      clienteDe: t,
      mudarStatus: n,
      usuario: r
    } = useSistema(),
    [i, a] = useState(!1),
    o = useToast(),
    [s, c] = useState(null),
    l = (e, t) => c({
      titulo: e,
      ids: t.map(e => e.id)
    }),
    u = e.filter(e => e.status === "pedido" || e.status === "a_caminho"),
    d = e.filter(e => e.criadoEm.slice(0, 10) === new Date().toISOString().slice(0, 10)),
    f = e.filter(e => !["entregue", "cancelada", "pedido", "a_caminho"].includes(e.status));
  return <><Ii_ sub="Cada pedido do lojista cai aqui na hora, com aviso no painel e no celular." acao={<R tone="acc" disabled={!Ur(r, "operacao", "editar")} onClick={() => a(!0)}>Novo processo</R>}>Fila de coletas</Ii_><div className="grid gap-3 lg:grid-cols-[1fr_320px]"><div className="space-y-3"><div className="grid gap-3 sm:grid-cols-3"><H i={0} rotulo="Para coletar" valor={u.length} tone="acc" nota="aguardando a equipe" onClick={() => l("Para coletar", u)} /><H i={1} rotulo="Pedidos hoje" valor={d.length} onClick={() => l("Pedidos de hoje", d)} /><H i={2} rotulo="Em andamento" valor={f.length} tone="light" onClick={() => l("Em andamento", f)} /></div>{u.length === 0 ? <Li_ titulo="Fila vazia" texto="Quando um lojista gerar uma etiqueta, o pedido aparece aqui." /> : u.map((e, r) => <L key={e.id} i={r + 3} className="!p-4 sm:!p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><b className="text-base">{t(e.clienteId)?.nome}</b><V tone="blue">{e.volumes} volume(s)</V><V>{Kn(e.pesoTaxG)}</V>{e.status === "a_caminho" && <V tone="warn">Motoboy a caminho</V>}</div><p className="mt-1 text-sm text-on2">Coleta em {e.origem} · para <b className="text-on">{e.destinatario}</b> · {e.cidade} · previsão {P(e.previsao)} · {N(e.precoC)}</p><small className="font-mono text-xs text-on2">{e.codigo} · pedido há {Zn(e.criadoEm)}</small></div><div className="flex flex-wrap gap-2"><R tone="line" onClick={() => c({
                titulo: e.destinatario,
                ids: [e.id],
                inicial: e.id
              })}>Detalhes</R><R tone="on" onClick={() => {
                n(e.id, "coletado"), o("Coleta registrada", "O lojista foi avisado.");
              }}>Marcar como coletado</R></div></div></L>)}</div><L tone="dark" i={2} className="h-fit"><h2 className="disp text-xl">Aviso no celular</h2><p className="mb-4 mt-1 text-xs text-on2">Com o app instalado na tela inicial, o aviso aparece mesmo com a tela bloqueada.</p><Vo_ /></L></div>{i && <_o onClose={() => a(!1)} />}{s && <Mo_ titulo={s.titulo} ids={s.ids} inicial={s.inicial} onClose={() => c(null)} />}</>;
}

