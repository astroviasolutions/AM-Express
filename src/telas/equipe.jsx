import { useState } from 'react';
import { Fr, Mr, Nr, useSistema } from '../sistema/estado';
import { Br, Hr, Rr, Ur, Vr, useToast, zr } from '../sistema/acesso-toast';
import { B, Ci_, Di_, Ii_, L, R, V, Z } from '../componentes/ui';
import { N, gr } from '../lib/regras';
import { Xo, Zo } from './configuracoes';
import { Go_ } from './fila-coletas';
import { Us } from './financeiro';

export var ws = ["gerente", "operacional", "motorista"];

export var Ts = {
  dono: "Vê e altera tudo.",
  gerente: "Acompanha a operação e as ocorrências.",
  operacional: "Recebe, confere, despacha e resolve ocorrências.",
  motorista: "Aceita coletas, entrega e registra a prova. Só vê o que é dele.",
  cliente: "Só vê as próprias remessas."
};

export var Es = {
  nenhum: "",
  ver: " (só vê)",
  editar: ""
};

export var Ds = e => ({
  valorEntregaC: e.motoboyEntregaPadraoC,
  valorColetaC: e.motoboyColetaPadraoC,
  cidade: "Santo Antônio da Platina",
  ativo: !0,
  disponivel: !0,
  todasCidades: !1,
  forma: e.motoboyFormaPadrao,
  chavePix: "",
  periodo: e.motoboyPeriodoPadrao,
  codigoIndicacao: "",
  whatsapp: "",
  cnh: "",
  placa: "",
  modelo: ""
});

export function Equipe() {
  let {
      equipe: e,
      cfg: t,
      usuario: n,
      addUsuario: r,
      salvarUsuario: i
    } = useSistema(),
    a = useToast(),
    o = Ur(n, "equipe", "editar"),
    [s, c] = useState(null),
    [l, u] = useState(null),
    d = e.filter(e => e.papel !== "cliente"),
    f = e => c(t => t && {
      ...t,
      ...e
    }),
    p = e => c(t => t && t.motoboy ? {
      ...t,
      motoboy: {
        ...t.motoboy,
        ...e
      }
    } : t),
    m = () => ({
      nome: "",
      papel: "operacional",
      cargo: "",
      permissoes: Br.operacional
    }),
    h = (e, t) => c(n => n && {
      ...n,
      permissoes: {
        ...Vr(n),
        [e]: t
      }
    }),
    g = e => c(n => n && {
      ...n,
      papel: e,
      permissoes: e === "motorista" ? void 0 : Br[e],
      motoboy: e === "motorista" ? n.motoboy ?? Ds(t) : void 0
    }),
    v = () => {
      if (!s || s.nome.trim().length < 2) return;
      let e = {
        ...s,
        nome: s.nome.trim(),
        cargo: s.cargo.trim() || Mr[s.papel]
      };
      e.id ? i(e) : r(e), a(s.id ? "Cadastro atualizado" : "Acesso criado", s.id ? void 0 : "Na versão real, a pessoa recebe o convite por e-mail."), c(null);
    },
    y = e => Nr.filter(t => Hr(e, t.id) !== "nenhum");
  return <><Ii_ sub="Cada pessoa entra com o próprio acesso e só enxerga o que o cargo permite. Motoboys têm aqui quanto ganham e como recebem." acao={<R tone="acc" disabled={!o} onClick={() => c(m())}>Novo acesso</R>}>Equipe</Ii_>{!o && <p className="mb-3 rounded-2xl bg-warn/15 p-3 text-sm text-warn">Você pode ver a equipe, mas só o dono altera acessos e permissões.</p>}<div className="grid gap-3 md:grid-cols-2">{d.map((e, t) => <L key={e.id} i={t}><div className="flex items-start justify-between gap-3"><span className="min-w-0"><b className="block truncate text-lg">{e.nome}</b><small className="text-on2">{e.cargo}</small></span><V tone={e.papel === "dono" ? "warn" : "blue"}>{Mr[e.papel]}</V></div>{e.papel === "motorista" ? <p className="mt-3 text-sm text-on2">{Ts[e.papel]}</p> : <div className="mt-3 flex flex-wrap gap-1.5">{y(e).map(t => <V key={t.id}>{t.rotulo}{Es[Hr(e, t.id)]}</V>)}{y(e).length === 0 && <span className="text-sm text-on2">Nenhuma área liberada</span>}</div>}{e.motoboy && <div className="mt-3 grid grid-cols-2 gap-2 text-sm"><div className="rounded-2xl bg-white/5 p-3"><small className="block text-on2">Por entrega</small><b>{N(e.motoboy.valorEntregaC)}</b></div><div className="rounded-2xl bg-white/5 p-3"><small className="block text-on2">Recebe</small><b>{Xo[e.motoboy.forma]} · {Zo[e.motoboy.periodo].toLowerCase()}</b></div><div className="col-span-2 flex flex-wrap gap-2">{!e.motoboy.ativo && <V tone="bad">Acesso desativado</V>}<V>{e.motoboy.disponivel ? "Disponível" : "Indisponível"}</V><V>{e.motoboy.cidade}</V></div></div>}<div className="mt-3 flex justify-end gap-2">{e.motoboy && <R tone="line" onClick={() => u(e.id)}>Ficha</R>}<R tone="line" disabled={!o} onClick={() => c(e)}>Editar</R></div></L>)}</div><Di_ aberto={!!s} onFechar={() => c(null)} titulo={s?.id ? "Editar cadastro" : "Novo acesso"} largo>{s && <div className={"space-y-4 [&_input]:!border-ink/20 [&_input]:!bg-white [&_input]:!text-ink [&_select]:!border-ink/20 [&_select]:!bg-white [&_select]:!text-ink [&_span]:!text-ink/60"}><div className="grid gap-4 sm:grid-cols-2"><Z label="Nome" value={s.nome} onChange={e => f({
            nome: e.target.value
          })} /><B label="Papel" value={s.papel} disabled={s.papel === "dono"} onChange={e => g(e.target.value)}>{(s.papel === "dono" ? ["dono"] : ws).map(e => <option key={e} value={e}>{Mr[e]}</option>)}</B></div><Z label="Cargo (opcional)" value={s.cargo} onChange={e => f({
          cargo: e.target.value
        })} />{s.papel === "motorista" ? <p className="rounded-2xl bg-ink/5 p-3 text-xs text-ink/70"><b>O que esta conta acessa:</b>{" "}{Ts[s.papel]}</p> : <div className="rounded-2xl border border-ink/10 p-4"><h3 className="text-sm font-semibold text-ink">O que esta conta acessa</h3><p className="mb-3 text-xs text-ink/60">{s.papel === "dono" ? "O dono sempre vê e altera tudo." : "Escolha um cargo pronto e ajuste módulo por módulo. A mudança vale na hora."}</p>{s.papel !== "dono" && <B label="Cargo pronto" value={zr(Vr(s))} onChange={e => {
            let t = Rr.find(t => t.id === e.target.value);
            t && f({
              permissoes: t.perm
            });
          }} className="mb-3">{Rr.map(e => <option key={e.id} value={e.id}>{e.nome} · {e.resumo}</option>)}{zr(Vr(s)) === "personalizado" && <option value="personalizado">Personalizado</option>}</B>}<div className="divide-y divide-ink/10">{Nr.map(e => {
              let t = s.papel === "dono" || s.id === n?.id && e.id === "equipe";
              return <div key={e.id} className="grid items-center gap-2 py-2 sm:grid-cols-[1fr_170px]"><span className="text-sm text-ink"><b className="block">{e.rotulo}</b><small className="text-ink/60">{e.texto}</small></span><select aria-label={`Nível de ${e.rotulo}`} value={Vr(s)[e.id]} disabled={t} onChange={t => h(e.id, t.target.value)} className="min-h-11 rounded-xl border border-ink/20 bg-white px-3 text-sm text-ink disabled:opacity-60">{Fr.map(([e, t]) => <option key={e} value={e}>{t}</option>)}</select></div>;
            })}</div></div>}{s.motoboy && <div className="space-y-4 rounded-2xl border border-ink/10 p-4"><h3 className="text-sm font-semibold text-ink">Motoboy: contato, veículo e pagamento</h3><div className="grid gap-4 sm:grid-cols-2"><Z label="WhatsApp" value={s.motoboy.whatsapp} onChange={e => p({
              whatsapp: e.target.value
            })} inputMode="tel" placeholder="(43) 9 0000-0000" /><Z label="CNH" value={s.motoboy.cnh} onChange={e => p({
              cnh: e.target.value
            })} /><Z label="Modelo do veículo" value={s.motoboy.modelo} onChange={e => p({
              modelo: e.target.value
            })} /><Z label="Placa" value={s.motoboy.placa} onChange={e => p({
              placa: e.target.value
            })} /><Go_ label="Por entrega (R$)" valorC={s.motoboy.valorEntregaC} onChange={e => p({
              valorEntregaC: e
            })} /><Go_ label="Por coleta (R$)" valorC={s.motoboy.valorColetaC} onChange={e => p({
              valorColetaC: e
            })} /><B label="Como recebe" value={s.motoboy.forma} onChange={e => p({
              forma: e.target.value
            })}>{Object.keys(Xo).map(e => <option key={e} value={e}>{Xo[e]}</option>)}</B><B label="Quando recebe" value={s.motoboy.periodo} onChange={e => p({
              periodo: e.target.value
            })}>{Object.keys(Zo).map(e => <option key={e} value={e}>{Zo[e]}</option>)}</B>{s.motoboy.forma === "pix" && <Z label="Chave PIX" value={s.motoboy.chavePix} onChange={e => p({
              chavePix: e.target.value
            })} className="sm:col-span-2" />}<B label="Cidade de atuação (mural de coletas)" value={s.motoboy.cidade} onChange={e => p({
              cidade: e.target.value
            })}>{gr.map(e => <option key={e.ibge} value={e.nome}>{e.nome}</option>)}</B><Z label="Código de indicação" value={s.motoboy.codigoIndicacao} onChange={e => p({
              codigoIndicacao: e.target.value
            })} placeholder="gerado ao salvar" /></div><div className="flex flex-wrap gap-x-6"><Ci_ label="Acesso ativo" checked={s.motoboy.ativo} onChange={e => p({
              ativo: e
            })} className={"[&_*]:!text-ink"} /><Ci_ label="Disponível para coletas" checked={s.motoboy.disponivel} onChange={e => p({
              disponivel: e
            })} className={"[&_*]:!text-ink"} /><Ci_ label="Vê e aceita coletas de qualquer cidade" checked={s.motoboy.todasCidades} onChange={e => p({
              todasCidades: e
            })} className={"[&_*]:!text-ink"} /></div></div>}<R tone="dark" className="w-full" onClick={v} disabled={s.nome.trim().length < 2}>{s.id ? "Salvar alterações" : "Criar acesso"}</R></div>}</Di_>{l && <Us id={l} onClose={() => u(null)} />}</>;
}

