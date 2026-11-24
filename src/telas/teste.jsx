import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSistema } from '../sistema/estado';
import { useToast } from '../sistema/acesso-toast';
import { L, Ni_, R, Ti_ } from '../componentes/ui';

export var xi = [{
  id: "c1",
  grupo: "Cliente pede a coleta",
  titulo: "Pedir uma coleta",
  perfil: "u-c2",
  rota: "/cli/nova",
  texto: "Preencha o destinatário, o endereço e escolha uma cidade. Gere a etiqueta.",
  olhar: "O valor é o valor base do cliente (ou a tarifa da rota)? O prazo faz sentido? A etiqueta tem o que vocês usam hoje?"
}, {
  id: "c2",
  grupo: "Cliente pede a coleta",
  titulo: "Casos especiais do pedido",
  perfil: "u-c2",
  rota: "/cli/nova",
  texto: "Marque \"pacote maior que 1,00 × 1,00 m\" e depois escolha um peso personalizado (15 ou 20 kg).",
  olhar: "O pacote grande bloqueia o envio, como no amcoletas? O peso personalizado cobra o valor certo?"
}, {
  id: "c3",
  grupo: "Cliente pede a coleta",
  titulo: "Acompanhar e cancelar",
  perfil: "u-c2",
  rota: "/cli/remessas",
  texto: "Abra a remessa que acabou de criar. Veja a linha do tempo. Cancele-a (só deve deixar antes de um motoboy aceitar).",
  olhar: "A regra de cancelamento é a mesma do amcoletas? O que o cliente vê basta?"
}, {
  id: "m1",
  grupo: "Motoboy coleta",
  titulo: "Mural de coletas",
  perfil: "u-m2",
  rota: "/mot",
  texto: "Como a Camila (Jacarezinho), veja as coletas disponíveis e aceite uma. Fique \"Indisponível\" e veja se deixa de aceitar.",
  olhar: "O mural só mostra a cidade do motoboy? Aceitar coleta funciona como no amcoletas?"
}, {
  id: "m2",
  grupo: "Motoboy coleta",
  titulo: "Marcar como coletado",
  perfil: "u-m2",
  rota: "/mot",
  texto: "Marque a coleta como coletada. Depois procure o pacote em \"Coletas que já fiz\".",
  olhar: "Ficou claro para onde o pacote foi depois de coletado? O motoboy sabe o que acontece em seguida?"
}, {
  id: "o1",
  grupo: "Operação",
  titulo: "Processos: buscar, abrir e mudar",
  perfil: "u-op",
  rota: "/op/processos",
  texto: "Filtre por etapa, busque por código ou nome. Abra um processo, troque o motoboy da coleta ou da entrega e mude o status.",
  olhar: "Dá para achar qualquer pedido rápido? As ações que a operação mais usa estão à mão?"
}, {
  id: "o2",
  grupo: "Operação",
  titulo: "Corrigir data e hora",
  perfil: "u-op",
  rota: "/op/processos",
  texto: "Abra um processo e use \"Corrigir datas e horários\" para mudar a hora de uma etapa.",
  olhar: "Isso resolve quando o motoboy esquece de dar a baixa na hora? Falta guardar o motivo da correção?"
}, {
  id: "o3",
  grupo: "Operação",
  titulo: "Criar um processo sem o cliente pedir",
  perfil: "u-op",
  rota: "/op/processos",
  texto: "Clique em \"Novo processo\" e crie um pedido de balcão ou telefone, escolhendo o cliente.",
  olhar: "Os campos bastam? O valor à mão atende os casos em que o preço foge da tabela?"
}, {
  id: "o4",
  grupo: "Operação",
  titulo: "Conferência na base",
  perfil: "u-op",
  rota: "/op/conferencia",
  texto: "Digite o código de um pacote coletado e informe um peso diferente do declarado.",
  olhar: "A conferência reflete o que fazem na base? O ajuste de valor pelo peso faz sentido?"
}, {
  id: "o5",
  grupo: "Operação",
  titulo: "Expedição: sair para a rota",
  perfil: "u-op",
  rota: "/op/expedicao",
  texto: "Escolha o motoboy da entrega e clique em \"Sair para rota\".",
  olhar: "Agrupar por cidade ajuda? O motoboy e o cliente receberam o aviso?"
}, {
  id: "e1",
  grupo: "Motoboy entrega",
  titulo: "Entregar com prova",
  perfil: "u-m1",
  rota: "/mot",
  texto: "Como o Rafael, abra uma entrega, informe quem recebeu e o documento, tire a foto (opcional) e confirme.",
  olhar: "A prova pede o que vocês exigem hoje (nome, documento, foto)? O GPS atrapalha ou ajuda?"
}, {
  id: "e2",
  grupo: "Motoboy entrega",
  titulo: "Entrega que não deu certo",
  perfil: "u-m1",
  rota: "/mot",
  texto: "Em outra entrega, use \"Não consegui entregar\" e registre o motivo.",
  olhar: "Os motivos são os que acontecem de verdade? Falta algum?"
}, {
  id: "o6",
  grupo: "Operação",
  titulo: "Resolver a ocorrência",
  perfil: "u-op",
  rota: "/op/ocorrencias",
  texto: "Ao entrar como operacional deve aparecer um aviso das ocorrências abertas. Resolva e reprograme uma.",
  olhar: "O aviso ajuda a não esquecer? A reprogramação leva o pacote de volta à expedição?"
}, {
  id: "p1",
  grupo: "Comprador",
  titulo: "Rastreio público",
  rota: "/rastreio",
  texto: "Sem entrar, abra o rastreio e digite o código de uma etiqueta que você criou.",
  olhar: "A linha do tempo mostra o que o comprador precisa? Sobrou ou faltou alguma informação?"
}, {
  id: "d1",
  grupo: "Dono",
  titulo: "Acerto do motoboy",
  perfil: "u-dono",
  rota: "/dono/financeiro",
  texto: "Na aba Motoboys, confira o valor de um acerto, lance um desconto, aprove e registre o pagamento.",
  olhar: "As contas batem com o que o amcoletas mostra (valor por entrega, R$ 3,00 por indicação)? O que mais entra no acerto?"
}, {
  id: "d2",
  grupo: "Dono",
  titulo: "Fatura do cliente",
  perfil: "u-dono",
  rota: "/dono/financeiro",
  texto: "Na aba Clientes, feche a fatura de um cliente.",
  olhar: "O fechamento equivale ao \"resetar faturamento\" do amcoletas? Falta algum dado na fatura?"
}, {
  id: "d3",
  grupo: "Dono",
  titulo: "Visão geral, análise e caixa",
  perfil: "u-dono",
  rota: "/dono",
  texto: "Veja a Visão geral (meta e ocorrências), a Análise e o Caixa. Se não usarem caixa, desligue em Configurações.",
  olhar: "Que números vocês olham no dia a dia e não aparecem aqui?"
}, {
  id: "d4",
  grupo: "Dono",
  titulo: "Equipe e permissões",
  perfil: "u-dono",
  rota: "/dono/equipe",
  texto: "Abra o cadastro do Gerente, mude o que ele acessa e depois entre como Gerente para conferir.",
  olhar: "Os cargos prontos são os certos? Quem na equipe de vocês precisa de qual acesso?"
}];

export var Si = ["Não testei", "Igual ao amcoletas", "Diferente do amcoletas", "Falta algo", "Não existe no amcoletas"];

export var Ci = "am-teste-v1";

export function RoteiroTeste() {
  let {
      resetDemo: e
    } = useSistema(),
    t = useToast(),
    [n, r] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem(Ci) || "{}");
      } catch {
        return {};
      }
    });
  useEffect(() => {
    try {
      localStorage.setItem(Ci, JSON.stringify(n));
    } catch {}
  }, [n]);
  let i = e => n[e] ?? {
      feito: !1,
      resp: "Não testei",
      nota: ""
    },
    a = (e, t) => r(n => ({
      ...n,
      [e]: {
        ...i(e),
        ...t
      }
    })),
    o = xi.filter(e => i(e.id).feito).length,
    s = useMemo(() => [...new Set(xi.map(e => e.grupo))], []),
    c = () => {
      let e = ["Teste do sistema AM Express (substituto do amcoletas)", `Gerado em ${new Date().toLocaleString("pt-BR")} · ${o} de ${xi.length} passos feitos`, ""];
      for (let t of s) {
        e.push(t.toUpperCase());
        for (let n of xi.filter(e => e.grupo === t)) {
          let t = i(n.id);
          e.push(`${t.feito ? "[x]" : "[ ]"} ${n.titulo} — ${t.resp}${t.nota ? `\n    ${t.nota.replace(/\n/g, "\n    ")}` : ""}`);
        }
        e.push("");
      }
      return e.join("\n");
    },
    l = () => navigator.clipboard?.writeText(c()).then(() => t("Relatório copiado", "Cole no WhatsApp e mande para o Christian.")).catch(() => t("Não consegui copiar", "Use \"Baixar relatório\".")),
    u = () => {
      let e = document.createElement("a");
      e.href = URL.createObjectURL(new Blob([c()], {
        type: "text/plain;charset=utf-8"
      })), e.download = "teste-am-express.txt", e.click(), URL.revokeObjectURL(e.href);
    },
    d = e => window.open(e.perfil ? `/login?perfil=${e.perfil}&ir=${encodeURIComponent(e.rota ?? "")}` : e.rota, "_blank");
  return <main className="mx-auto min-h-dvh max-w-3xl px-4 py-6"><header className="mb-5 flex items-center justify-between gap-3"><Link to="/login" className="inline-flex min-h-11 items-center"><Ni_ className="h-9 w-auto" /></Link><Ti_ /></header><h1 className="disp text-[clamp(28px,6vw,44px)] leading-none">Roteiro de teste</h1><p className="mt-2 text-on2">Siga os passos na ordem. Cada botão abre o sistema <b className="text-on">numa nova aba, já entrando no perfil certo</b>. Anote o que for igual ou diferente do amcoletas e mande o relatório no fim.</p><L tone="dark" className="mt-4"><h2 className="disp mb-2 text-lg">Antes de começar</h2><ul className="list-disc space-y-1 pl-5 text-sm text-on2"><li>Use <b className="text-on">sempre o mesmo navegador</b>. As abas compartilham os dados de exemplo, então o que o cliente pede aparece para o motoboy e para a operação.</li><li>São dados de exemplo. Nada afeta o amcoletas nem clientes de verdade.</li><li>Para voltar ao começo a qualquer momento: <button type="button" className="font-semibold text-sky underline" onClick={() => {
            confirm("Voltar aos dados de exemplo? O que foi feito nos testes será perdido.") && (e(), t("Dados de exemplo reiniciados"));
          }}>reiniciar dados de exemplo</button>.</li></ul></L><div className="sticky top-0 z-10 -mx-4 mt-4 bg-frame/90 px-4 py-3 backdrop-blur"><div className="flex items-center justify-between gap-3 text-sm"><b>{o} de {xi.length} passos</b><span className="flex gap-2"><R tone="line" className="!min-h-9 !px-3 !text-xs" onClick={l}>Copiar relatório</R><R tone="line" className="!min-h-9 !px-3 !text-xs" onClick={u}>Baixar</R></span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={xi.length} aria-valuenow={o} aria-label="Passos feitos"><i className="block h-full rounded-full bg-gradient-to-r from-blue to-acc-hi transition-all duration-500" style={{
          width: `${o / xi.length * 100}%`
        }} /></div></div>{s.map(e => <section key={e} className="mt-6"><h2 className="disp mb-2 text-xl">{e}</h2><div className="space-y-3">{xi.filter(t => t.grupo === e).map(e => {
          let t = i(e.id);
          return <L key={e.id} className={t.feito ? "ring-2 ring-ok/50" : ""}><div className="flex items-start gap-3"><input type="checkbox" id={`ck-${e.id}`} checked={t.feito} onChange={t => a(e.id, {
                feito: t.target.checked
              })} className="mt-1 size-6 flex-none accent-[#d63a37]" aria-label={`Passo feito: ${e.titulo}`} /><div className="min-w-0 flex-1"><label htmlFor={`ck-${e.id}`} className="block cursor-pointer break-words text-base font-semibold">{e.titulo}</label><p className="mt-1 break-words text-sm">{e.texto}</p><p className="mt-1 break-words text-xs text-on2"><b>Olhe:</b>{" "}{e.olhar}</p><div className="mt-3 flex flex-wrap items-center gap-2"><R tone="acc" className="!min-h-10" onClick={() => d(e)}>{e.perfil ? "Abrir no perfil" : "Abrir"}</R><select aria-label="Comparado ao amcoletas" value={t.resp} onChange={n => a(e.id, {
                    resp: n.target.value,
                    feito: t.feito || n.target.value !== "Não testei"
                  })} className="min-h-10 min-w-0 max-w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-on">{Si.map(e => <option key={e} className="text-ink">{e}</option>)}</select></div><textarea aria-label="Anotações" value={t.nota} onChange={t => a(e.id, {
                  nota: t.target.value
                })} placeholder="O que você notou? (opcional)" rows={2} className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-on outline-none focus:border-sky" /></div></div></L>;
        })}</div></section>)}<L tone="acc" className="mt-8"><h2 className="disp text-xl">Terminou?</h2><p className="mt-1 text-sm text-white/90">Copie o relatório e mande no WhatsApp do Christian. As anotações ficam salvas neste navegador.</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={l} className="min-h-11 rounded-full bg-white px-5 text-sm font-semibold text-ink">Copiar relatório</button><button type="button" onClick={u} className="min-h-11 rounded-full bg-white/20 px-5 text-sm font-semibold text-white">Baixar relatório</button></div></L></main>;
}

