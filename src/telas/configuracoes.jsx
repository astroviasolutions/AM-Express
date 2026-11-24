import { useMemo, useRef, useState } from 'react';
import { useSistema } from '../sistema/estado';
import { Ur, useToast } from '../sistema/acesso-toast';
import { N, ar, gr, nr } from '../lib/regras';
import { B, Ci_, Ii_, L, R, V, Z } from '../componentes/ui';
import { Go_ } from './fila-coletas';
import { Es_ } from './financeiro';

export var Xo = {
  pix: "PIX",
  dinheiro: "Dinheiro",
  transferencia: "Transferência"
};

export var Zo = {
  semanal: "Semanal",
  quinzenal: "Quinzenal",
  mensal: "Mensal"
};

export var Qo = e => e.split(/[,\n]/).map(e => e.trim()).filter(Boolean);

export function Configuracoes() {
  let {
      cfg: e,
      salvarCfg: t,
      usuario: n,
      exportarCopia: r,
      importarCopia: i,
      resetDemo: a
    } = useSistema(),
    o = useToast(),
    s = Ur(n, "configuracoes", "editar"),
    [c, l] = useState(e),
    [u, d] = useState(e.categoriasEntrada.join(", ")),
    [f, p] = useState(e.categoriasSaida.join(", ")),
    m = useRef(null),
    h = e => l({
      ...c,
      ...e
    }),
    g = JSON.stringify(c) !== JSON.stringify(e),
    v = useMemo(() => [...gr].sort((e, t) => e.nome.localeCompare(t.nome, "pt-BR")), []),
    y = (e, t) => {
      let n = {
        ...c.tarifas
      };
      t === null ? delete n[e] : n[e] = t, h({
        tarifas: n
      });
    },
    b = (e, t) => h({
      pesos: c.pesos.map(n => n.id === e ? {
        ...n,
        ...t
      } : n)
    }),
    x = () => {
      let e = document.createElement("a");
      e.href = URL.createObjectURL(new Blob([r()], {
        type: "application/json"
      })), e.download = `copia-am-express-${new Date().toISOString().slice(0, 10)}.json`, e.click(), URL.revokeObjectURL(e.href), o("Cópia baixada", "Guarde o arquivo em local seguro.");
    },
    S = async e => {
      if (!e || !confirm("Restaurar substitui todos os dados atuais pelos do arquivo. Continuar?")) return;
      let t = i(await e.text());
      o(t ? "Não restaurou" : "Cópia restaurada", t ?? "Os dados foram substituídos.");
    };
  return <><Ii_ sub="Tudo que mexe com dinheiro fica aqui. Cada cliente (em Clientes) e cada motoboy (em Equipe) pode ter valores próprios, que valem antes destes." acao={<div className="flex gap-2"><R tone="line" disabled={!s} onClick={() => {
        l(ar), d(ar.categoriasEntrada.join(", ")), p(ar.categoriasSaida.join(", "));
      }}>Restaurar exemplo</R><R tone="acc" disabled={!g && u === e.categoriasEntrada.join(", ") && f === e.categoriasSaida.join(", ") || !s} onClick={() => {
        t({
          ...c,
          categoriasEntrada: Qo(u).length ? Qo(u) : c.categoriasEntrada,
          categoriasSaida: Qo(f).length ? Qo(f) : c.categoriasSaida
        }), o("Configurações salvas", "As novas regras já valem para as próximas remessas.");
      }}>Salvar</R></div>}>Configurações</Ii_>{!s && <p className="mb-3 rounded-2xl bg-warn/15 p-3 text-sm text-warn">Você só pode consultar as configurações. Para alterar, peça ao dono.</p>}<div className="grid gap-3 lg:grid-cols-2"><L><h2 className="disp mb-1 text-xl">Regras de preço</h2><p className="mb-4 text-xs text-on2">Ordem: tarifa do cliente para a cidade, depois a tarifa geral da cidade, depois o valor base do cliente.</p><div className="grid gap-4 sm:grid-cols-2"><Z label="Peso incluído na tarifa (kg)" type="number" min={1} value={c.limiteKg} onChange={e => h({
            limiteKg: Math.max(1, +e.target.value || 10)
          })} /><Go_ label="Excedente por kg (R$)" valorC={c.excedenteKgC} onChange={e => h({
            excedenteKgC: e
          })} /><Z label="Horário de corte (hora cheia)" type="number" min={0} max={23} value={c.corteHora} onChange={e => h({
            corteHora: Math.max(0, Math.min(23, +e.target.value || 12))
          })} /><Z label="Divisor de cubagem (cm³ por kg)" type="number" min={1000} max={10000} step={100} value={c.divisorCubagem || 6000} onChange={e => h({
            divisorCubagem: Math.max(1000, Math.min(10000, +e.target.value || 6000))
          })} /><Z label="Coleta parada após (horas)" type="number" min={1} max={72} value={c.coletaParadaHoras || 4} onChange={e => h({
            coletaParadaHoras: Math.max(1, Math.min(72, +e.target.value || 4))
          })} /></div><p className="mt-3 text-xs text-on2">Cubagem: peso cubado = comprimento × largura × altura (cm) ÷ divisor. O frete usa o maior entre o peso real e o cubado. Coleta sem motoboy, ou com motoboy que não coletou, passa a contar como atrasada depois do prazo em horas. Pedidos depois do corte saem um dia útil depois. Pacotes maiores que 1,00 × 1,00 m não são aceitos pelo formulário, como no amcoletas.</p></L><L tone="dark" i={1}><h2 className="disp mb-1 text-xl">Pagamento dos motoboys</h2><p className="mb-4 text-xs text-on2">Valores usados ao cadastrar um motoboy novo. Quem já está cadastrado mantém os seus; para mudar um motoboy, abra o cadastro dele em Equipe.</p><div className="grid gap-4 sm:grid-cols-2"><Go_ label="Por entrega (R$)" valorC={c.motoboyEntregaPadraoC} onChange={e => h({
            motoboyEntregaPadraoC: e
          })} /><Go_ label="Por coleta (R$)" valorC={c.motoboyColetaPadraoC} onChange={e => h({
            motoboyColetaPadraoC: e
          })} /><Go_ label="Comissão por coleta de cliente indicado (R$)" valorC={c.comissaoIndicacaoC} onChange={e => h({
            comissaoIndicacaoC: e
          })} className="sm:col-span-2" /><B label="Como recebe" value={c.motoboyFormaPadrao} onChange={e => h({
            motoboyFormaPadrao: e.target.value
          })}>{Object.keys(Xo).map(e => <option key={e} value={e}>{Xo[e]}</option>)}</B><B label="Quando recebe" value={c.motoboyPeriodoPadrao} onChange={e => h({
            motoboyPeriodoPadrao: e.target.value
          })}>{Object.keys(Zo).map(e => <option key={e} value={e}>{Zo[e]}</option>)}</B></div><p className="mt-3 text-xs text-on2">Cada valor é gravado na hora em que a entrega ou a coleta acontece. Mudar a taxa depois não altera o que já foi lançado.</p></L><L i={2}><div className="mb-1 flex items-center justify-between"><h2 className="disp text-xl">Caixa</h2><Ci_ label={c.caixaAtivo ? "Ligado" : "Desligado"} checked={c.caixaAtivo} onChange={e => h({
            caixaAtivo: e
          })} /></div><p className="mb-4 text-xs text-on2">Desligado, a aba Caixa some para todos e faturas e acertos deixam de gerar lançamentos. O que já foi lançado fica guardado.</p><div className={"grid gap-4 sm:grid-cols-2 " + (c.caixaAtivo ? "" : "pointer-events-none opacity-50")} aria-disabled={!c.caixaAtivo}><Go_ label="Saldo inicial (R$)" valorC={c.saldoInicialC} onChange={e => h({
            saldoInicialC: e
          })} /><Z label="Prazo da fatura (dias úteis)" type="number" min={0} max={90} value={c.prazoFaturaDias} onChange={e => h({
            prazoFaturaDias: Math.max(0, Math.min(90, +e.target.value || 0))
          })} /><label className="block sm:col-span-2"><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.13em] text-on2">Categorias de entrada (separe por vírgula)</span><input value={u} onChange={e => d(e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-[15px] outline-none focus:border-sky" /></label><label className="block sm:col-span-2"><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.13em] text-on2">Categorias de saída (separe por vírgula)</span><input value={f} onChange={e => p(e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-[15px] outline-none focus:border-sky" /></label></div></L><L tone="dark" i={3}><h2 className="disp mb-1 text-xl">Meta do mês</h2><p className="mb-4 text-xs text-on2">Aparece na tela de Análise, com o ritmo atual e a projeção para o fim do mês. Deixe em zero para não usar.</p><div className="grid gap-4 sm:grid-cols-2"><Z label="Entregas no mês" type="number" min={0} value={c.metaEntregas} onChange={e => h({
            metaEntregas: Math.max(0, Math.round(+e.target.value || 0))
          })} /><Go_ label="Margem no mês (R$)" valorC={c.metaResultadoC} onChange={e => h({
            metaResultadoC: e
          })} /></div></L><L i={4}><div className="mb-3 flex items-center justify-between"><h2 className="disp text-xl">Pesos personalizados</h2><R tone="line" disabled={!s} onClick={() => h({
            pesos: [...c.pesos, {
              id: "p" + Date.now().toString(36),
              kg: 25,
              ativo: !0
            }]
          })}>Adicionar</R></div><p className="mb-3 text-xs text-on2">O cliente escolhe um destes na hora do pedido. O peso vale como o informado: o preço segue a conta normal (tarifa da cidade + excedente por kg), sem valor fixo.</p><ul className="space-y-3">{c.pesos.map(e => <li key={e.id} className="grid grid-cols-[1fr_auto] items-end gap-3"><Z label="Peso (kg)" type="number" min={1} value={e.kg} onChange={t => b(e.id, {
              kg: Math.max(1, +t.target.value || 1)
            })} /><div className="flex items-center"><Ci_ label="Ativo" checked={e.ativo} onChange={t => b(e.id, {
                ativo: t
              })} /><button type="button" aria-label={`Remover peso de ${e.kg} kg`} className="min-h-11 min-w-11 rounded-xl text-on2 hover:bg-white/10" onClick={() => h({
                pesos: c.pesos.filter(t => t.id !== e.id)
              })}>✕</button></div></li>)}{c.pesos.length === 0 && <li className="text-sm text-on2">Nenhum peso personalizado.</li>}</ul></L><L tone="dark" i={5}><div className="mb-3 flex items-center justify-between"><h2 className="disp text-xl">Tarifa geral por cidade</h2><V tone="blue">A partir da matriz</V></div><p className="mb-3 text-xs text-on2">Deixe em branco para a cidade usar o valor base do cliente.</p><ul className="divide-y divide-white/10 text-sm">{v.map(e => {
            let t = nr(e),
              n = c.tarifas[t];
            return <li key={e.ibge} className="grid grid-cols-[1fr_120px] items-center gap-3 py-2"><span className="min-w-0"><b className="block truncate">{e.nome}</b><small className="text-on2">{n === void 0 ? "usa o valor base do cliente" : N(n)}</small></span><Es_ valorC={n} nome={e.nome} onChange={e => y(t, e)} /></li>;
          })}</ul></L><L i={6} className="lg:col-span-2"><h2 className="disp mb-1 text-xl">Segurança e cópia dos dados</h2><div className="grid gap-4 md:grid-cols-2"><div><h3 className="mb-1 font-semibold">Cópia de segurança</h3><p className="mb-3 text-xs text-on2">Baixe um arquivo com tudo (remessas, clientes, equipe, financeiro e caixa) ou restaure a partir de um. Neste protótipo os dados ficam só neste navegador; com o banco real a cópia diária é automática.</p><div className="flex flex-wrap gap-2"><R tone="on" onClick={x}>Baixar cópia (.json)</R><R tone="line" disabled={!s} onClick={() => m.current?.click()}>Restaurar de um arquivo</R><R tone="line" disabled={!s} onClick={() => {
                confirm("Voltar aos dados de exemplo? O que você fez aqui será perdido.") && (a(), o("Dados de exemplo reiniciados"));
              }}>Reiniciar exemplo</R><input ref={m} type="file" accept="application/json,.json" hidden onChange={e => {
                S(e.target.files?.[0]), e.target.value = "";
              }} /></div></div><div><h3 className="mb-1 font-semibold">Verificação em dois passos</h3><p className="mb-3 text-xs text-on2">Pede um código do celular além da senha no login. <b className="text-on">Neste protótipo a escolha só fica salva:</b> o login real, com e-mail e senha, entra junto com o banco de dados, e é nele que o código passa a ser exigido.</p><Ci_ label={c.doisPassos ? "Exigir verificação em dois passos" : "Não exigir"} checked={c.doisPassos} onChange={e => h({
              doisPassos: e
            })} /></div></div></L></div></>;
}

