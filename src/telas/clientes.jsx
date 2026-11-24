import { useState } from 'react';
import { N, fr, gr, nr } from '../lib/regras';
import { useSistema } from '../sistema/estado';
import { Ur, useToast } from '../sistema/acesso-toast';
import { B, Ci_, Di_, Ii_, L, R, V, Z } from '../componentes/ui';
import { Go_ } from './fila-coletas';

export var qo = {
  nome: "",
  documento: "",
  whatsapp: "",
  email: "",
  cidade: "Santo Antônio da Platina",
  valorBaseC: 0,
  tarifas: {},
  ativo: !0
};

export var Jo = e => gr.find(t => nr(t) === e)?.nome ?? e;

export function Clientes() {
  let {
      clientes: e,
      remessas: t,
      motoristas: n,
      addCliente: r,
      salvarCliente: i,
      usuario: a
    } = useSistema(),
    o = Ur(a, "clientes", "editar"),
    s = useToast(),
    [c, l] = useState(null),
    u = e => l(t => t && {
      ...t,
      ...e
    }),
    d = c ? gr.filter(e => c.tarifas[nr(e)] === void 0).sort((e, t) => e.nome.localeCompare(t.nome, "pt-BR")) : [];
  return <><Ii_ sub="Lojistas que enviam pela AM. Aqui fica quanto cada um paga: o valor base e, se houver contrato, tarifas por cidade." acao={<R tone="acc" disabled={!o} onClick={() => l(qo)}>Novo cliente</R>}>Clientes</Ii_><div className="grid gap-3 md:grid-cols-2">{e.map((e, r) => {
        let i = fr(t, e.id),
          a = n.find(t => t.id === e.indicadoPorId),
          s = Object.keys(e.tarifas).length;
        return <L key={e.id} i={r}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><b className="block truncate text-lg">{e.nome}</b><small className="text-on2">{e.documento}</small></div>{e.ativo ? <V tone="ok">Ativo</V> : <V tone="bad">Desativado</V>}</div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-white/5 p-3"><small className="block text-on2">Valor base</small><b>{e.valorBaseC > 0 ? N(e.valorBaseC) : "Não configurado"}</b></div><div className="rounded-2xl bg-white/5 p-3"><small className="block text-on2">A faturar</small><b>{N(i.reduce((e, t) => e + t.precoC, 0))}</b><small className="text-on2"> · {i.length}</small></div></div><div className="mt-3 flex flex-wrap gap-2">{s > 0 && <V tone="blue">{s} tarifa(s) de contrato</V>}{a && <V>Indicado por {a.nome}</V>}{e.valorBaseC <= 0 && <V tone="warn">Não consegue pedir coleta</V>}</div><div className="mt-4 flex items-center justify-between gap-3"><p className="min-w-0 truncate text-xs text-on2">{e.whatsapp} · {e.email}</p><R tone="line" disabled={!o} onClick={() => l(e)}>Editar</R></div></L>;
      })}</div><Di_ aberto={!!c} onFechar={() => l(null)} titulo={c?.id ? "Editar cliente" : "Novo cliente"} largo>{c && <div className={"space-y-4 [&_input]:!border-ink/20 [&_input]:!bg-white [&_input]:!text-ink [&_select]:!border-ink/20 [&_select]:!bg-white [&_select]:!text-ink [&_span]:!text-ink/60"}><div className="grid gap-4 sm:grid-cols-2"><Z label="Nome da empresa" value={c.nome} onChange={e => u({
            nome: e.target.value
          })} /><Z label="CNPJ ou CPF" value={c.documento} onChange={e => u({
            documento: e.target.value
          })} /><Z label="WhatsApp" value={c.whatsapp} onChange={e => u({
            whatsapp: e.target.value
          })} inputMode="tel" /><Z label="E-mail" value={c.email} onChange={e => u({
            email: e.target.value
          })} type="email" /></div><B label="Cidade de coleta padrão" value={c.cidade} onChange={e => u({
          cidade: e.target.value
        })}>{gr.map(e => <option key={e.ibge} value={e.nome}>{e.nome}</option>)}</B><div className="grid gap-4 sm:grid-cols-2"><div><Go_ label="Valor base (R$)" valorC={c.valorBaseC} onChange={e => u({
              valorBaseC: e
            })} /><small className="mt-1 block text-xs text-ink/60">Quanto o cliente paga por entrega quando não há tarifa para a cidade. Zero impede o pedido.</small></div><B label="Indicado por (comissão)" value={c.indicadoPorId ?? ""} onChange={e => u({
            indicadoPorId: e.target.value || void 0
          })}><option value="">Ninguém</option>{n.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</B></div><Ci_ label="Cliente ativo (desativado não pede coleta)" checked={c.ativo} onChange={e => u({
          ativo: e
        })} className={"[&_*]:!text-ink"} /><div><h3 className="mb-1 text-sm font-semibold text-ink">Tarifas deste cliente por cidade</h3><p className="mb-3 text-xs text-ink/60">Valem antes da tarifa geral da cidade e do valor base.</p><ul className="space-y-2">{Object.entries(c.tarifas).map(([e, t]) => <li key={e} className="grid grid-cols-[1fr_130px_auto] items-end gap-3"><span className="pb-3 text-sm font-medium text-ink">{Jo(e)}</span><Go_ label="R$" valorC={t} onChange={t => u({
                tarifas: {
                  ...c.tarifas,
                  [e]: t
                }
              })} /><button type="button" aria-label={`Remover tarifa de ${Jo(e)}`} className="min-h-11 min-w-11 rounded-xl text-ink/60 hover:bg-ink/10" onClick={() => {
                let t = {
                  ...c.tarifas
                };
                delete t[e], u({
                  tarifas: t
                });
              }}>✕</button></li>)}</ul>{d.length > 0 && <B label="Adicionar cidade" value="" className="mt-3" onChange={e => {
            e.target.value && u({
              tarifas: {
                ...c.tarifas,
                [e.target.value]: c.valorBaseC || 2e3
              }
            });
          }}><option value="">Escolher cidade…</option>{d.map(e => <option key={e.ibge} value={nr(e)}>{e.nome}</option>)}</B>}</div><R tone="dark" className="w-full" onClick={() => {
          if (!c || c.nome.trim().length < 2) return;
          let e = {
            ...c,
            nome: c.nome.trim()
          };
          e.id ? i(e) : r(e), s(c.id ? "Cliente atualizado" : "Cliente cadastrado", c.id ? void 0 : "Na versão real, ele recebe o convite por e-mail."), l(null);
        }} disabled={c.nome.trim().length < 2}>{c.id ? "Salvar alterações" : "Cadastrar cliente"}</R></div>}</Di_></>;
}

