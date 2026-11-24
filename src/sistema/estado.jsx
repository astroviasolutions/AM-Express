import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Ar, Cr, Jn, Kn, Sr, Tr, Yn, _r, br, dr, fr, hr, kr, lr, pesoTarifavelG, rr, sr, tr, vr, wr, yr } from '../lib/regras';

export function SistemaProvider({
  children: e
}) {
  let [t, n] = useState(Ar),
    [r, i] = useState(() => {
      try {
        return JSON.parse(sessionStorage.getItem(vr) || "null");
      } catch {
        return null;
      }
    }),
    a = useMemo(() => r ? t.equipe.find(e => e.id === r.id) ?? r : null, [r, t.equipe]),
    o = useCallback(e => {
      n(t => {
        let n = e(t);
        try {
          localStorage.setItem(_r, JSON.stringify(n));
        } catch {}
        return n;
      });
    }, []);
  useEffect(() => {
    let e = e => {
      e.key === _r && e.newValue && n(JSON.parse(e.newValue));
    };
    return window.addEventListener("storage", e), () => window.removeEventListener("storage", e);
  }, []);
  let s = useCallback(e => {
      sessionStorage.setItem(vr, JSON.stringify(e)), i(e);
    }, []),
    c = useCallback(() => {
      sessionStorage.removeItem(vr), i(null);
    }, []),
    l = (e, t) => ({
      ...e,
      notifs: [{
        ...t,
        id: Sr(),
        em: br(),
        lida: !1
      }, ...e.notifs].slice(0, 60)
    }),
    u = (e, t, n) => ({
      ...e,
      eventos: [...e.eventos, {
        tipo: t,
        em: br(),
        por: n
      }]
    }),
    d = (e, t, n) => ({
      ...e,
      registros: [{
        id: Sr(),
        em: br(),
        por: a?.nome ?? "Sistema",
        acao: t,
        detalhe: n
      }, ...e.registros].slice(0, 300)
    }),
    f = (e, t) => e.equipe.find(e => e.id === t)?.motoboy,
    p = (e, t) => e.cfg.pesos.find(e => e.id === t.pesoPersonalizadoId) ?? null,
    m = useMemo(() => {
      let e = e => t.clientes.find(t => t.id === e),
        n = {
          ...t,
          usuario: a,
          entrar: s,
          sair: c,
          clienteDe: e,
          motoristas: t.equipe.filter(e => e.papel === "motorista"),
          minhasRemessas: a ? a.papel === "cliente" ? t.remessas.filter(e => e.clienteId === a.clienteId) : a.papel === "motorista" ? t.remessas.filter(e => e.motoristaId === a.id) : t.remessas : [],
          meusAvisos: a ? t.notifs.filter(e => e.para.includes(a.papel) && (!e.clienteId || e.clienteId === a.clienteId) && (!e.motoristaId || e.motoristaId === a.id)) : [],
          criarRemessa: e => {
            let n = hr.find(t => t.nome === e.cidade),
              r = t.clientes.find(t => t.id === e.clienteId),
              tx = pesoTarifavelG(t.cfg, e.pesoRealG, e.c, e.l, e.a, e.volumes).tarifavelG,
              i = rr(t.cfg, n, tx, r, t.cfg.pesos.find(t => t.id === e.pesoPersonalizadoId));
            if (!i.ok && !e.precoManualC) throw Error("Cliente sem valor base ou desativado.");
            let {
                precoManualC: s,
                ...c
              } = e,
              u = i.ok ? i.dias : 1,
              d = a && a.papel !== "cliente" ? `${a.nome} (para ${r.nome})` : r.nome,
              f = {
                id: Sr(),
                codigo: Cr(),
                ...c,
                pesoTaxG: Math.max(tx, (t.cfg.pesos.find(t => t.id === e.pesoPersonalizadoId)?.kg ?? 0) * 1e3),
                precoC: s ?? (i.ok ? i.precoC : 0),
                prazo: u,
                previsao: Yn(Jn(), u),
                status: "pedido",
                criadoEm: br(),
                eventos: [{
                  tipo: "pedido",
                  em: br(),
                  por: d
                }],
                comissao: r.indicadoPorId && t.cfg.comissaoIndicacaoC > 0 ? {
                  motoboyId: r.indicadoPorId,
                  valorC: t.cfg.comissaoIndicacaoC
                } : void 0
              };
            return o(t => l({
              ...t,
              remessas: [f, ...t.remessas]
            }, {
              para: ["gerente", "operacional", "motorista"],
              titulo: "Nova coleta",
              corpo: `${r.nome} · coleta em ${e.origem} · ${f.codigo}`,
              remessaId: f.id
            })), f;
          },
          cancelar: e => o(t => ({
            ...t,
            remessas: t.remessas.map(t => t.id === e && t.status === "pedido" && !t.motoboyColetaId ? {
              ...u(t, "cancelada", a?.nome),
              status: "cancelada"
            } : t)
          })),
          editarEvento: (e, t, n) => o(r => ({
            ...r,
            remessas: r.remessas.map(r => {
              let i = r.eventos.findIndex(e => e.tipo === t);
              if (r.id !== e || i < 0) return r;
              let o = r.eventos.map((e, t) => t === i ? {
                ...e,
                em: n,
                original: e.original ?? e.em,
                editadoPor: a?.nome
              } : e);
              return {
                ...r,
                eventos: o,
                prova: t === "entregue" && r.prova ? {
                  ...r.prova,
                  em: n
                } : r.prova
              };
            })
          })),
          mudarStatus: (e, t) => o(n => {
            let r = n.remessas.find(t => t.id === e);
            if (!r) return n;
            let i = t === "coletado" && r.motoboyColetaId && !r.pgColeta ? f(n, r.motoboyColetaId) : void 0,
              o = i && i.valorColetaC > 0 && r.motoboyColetaId ? {
                motoboyId: r.motoboyColetaId,
                valorC: i.valorColetaC
              } : r.pgColeta,
              s = {
                ...n,
                remessas: n.remessas.map(n => n.id === e ? {
                  ...u(n, t, a?.nome),
                  status: t,
                  pgColeta: o
                } : n)
              };
            if (t === "coletado" || t === "conferido" || t === "em_rota") {
              let n = {
                coletado: "Coletamos o seu pacote",
                conferido: "Pacote conferido na base",
                em_rota: "Seu pacote saiu para entrega"
              }[t];
              s = l(s, {
                para: ["cliente"],
                clienteId: r.clienteId,
                titulo: n,
                corpo: `${r.codigo} · ${r.cidade}`,
                remessaId: e
              });
            }
            return s;
          }),
          aceitarColeta: (e, t) => o(n => {
            let r = n.remessas.find(t => t.id === e),
              i = n.equipe.find(e => e.id === t);
            if (!r || !i?.motoboy || r.status !== "pedido" || r.motoboyColetaId || !i.motoboy.ativo || !i.motoboy.disponivel || !i.motoboy.todasCidades && i.motoboy.cidade !== r.origem) return n;
            let a = {
              ...n,
              remessas: n.remessas.map(n => n.id === e ? {
                ...u({
                  ...n,
                  motoboyColetaId: t
                }, "a_caminho", i.nome),
                status: "a_caminho"
              } : n)
            };
            return l(a, {
              para: ["cliente"],
              clienteId: r.clienteId,
              titulo: "Motoboy a caminho",
              corpo: `${i.nome} vai coletar ${r.codigo}`,
              remessaId: e
            });
          }),
          atribuirColeta: (e, t) => o(n => {
            let r = n.remessas.find(t => t.id === e),
              i = n.equipe.find(e => e.id === t);
            if (!r || !i?.motoboy || r.status !== "pedido" && r.status !== "a_caminho") return n;
            let o = {
                ...n,
                remessas: n.remessas.map(n => n.id === e ? {
                  ...u({
                    ...n,
                    motoboyColetaId: t
                  }, "a_caminho", a?.nome),
                  status: "a_caminho"
                } : n)
              },
              s = l(o, {
                para: ["motorista"],
                motoristaId: t,
                titulo: "Coleta para você",
                corpo: `${r.codigo} · coleta em ${r.origem}`,
                remessaId: e
              });
            return l(s, {
              para: ["cliente"],
              clienteId: r.clienteId,
              titulo: "Motoboy a caminho",
              corpo: `${i.nome} vai coletar ${r.codigo}`,
              remessaId: e
            });
          }),
          atribuir: (e, t) => o(n => ({
            ...n,
            remessas: n.remessas.map(n => n.id === e ? u({
              ...n,
              motoristaId: t
            }, "motorista", a?.nome) : n)
          })),
          sairParaRota: (e, t) => o(n => {
            let r = n.remessas.find(t => t.id === e);
            if (!r) return n;
            let i = {
              ...n,
              remessas: n.remessas.map(n => n.id === e ? {
                ...u({
                  ...n,
                  motoristaId: t
                }, "em_rota", a?.nome),
                status: "em_rota"
              } : n)
            };
            return i = l(i, {
              para: ["motorista"],
              motoristaId: t,
              titulo: "Nova entrega para você",
              corpo: `${r.destinatario} · ${r.cidade}`,
              remessaId: e
            }), l(i, {
              para: ["cliente"],
              clienteId: r.clienteId,
              titulo: "Seu pacote saiu para entrega",
              corpo: `${r.codigo} · ${r.cidade}`,
              remessaId: e
            });
          }),
          ajustarPeso: (e, t) => o(n => ({
            ...n,
            remessas: n.remessas.map(r => {
              if (r.id !== e) return r;
              let i = hr.find(e => e.nome === r.cidade),
                o = n.clientes.find(e => e.id === r.clienteId),
                tx = pesoTarifavelG(n.cfg, t, r.c, r.l, r.a, r.volumes).tarifavelG,
                s = rr(n.cfg, i, tx, o, p(n, r));
              return u({
                ...r,
                pesoRealG: t,
                pesoTaxG: s.ok ? s.pesoCobradoG : tx,
                precoC: s.ok ? s.precoC : r.precoC
              }, "ajuste_peso", a?.nome);
            })
          })),
          entregar: (e, t, n, r, i) => o(o => {
            let s = o.remessas.find(t => t.id === e);
            if (!s) return o;
            let c = f(o, s.motoristaId),
              d = c && s.motoristaId && !s.pgEntrega ? {
                motoboyId: s.motoristaId,
                valorC: c.valorEntregaC
              } : s.pgEntrega,
              p = {
                ...o,
                remessas: o.remessas.map(o => o.id === e ? {
                  ...u(o, "entregue", a?.nome),
                  status: "entregue",
                  prova: {
                    recebedor: t,
                    documento: n,
                    foto: r,
                    gps: i,
                    em: br()
                  },
                  pgEntrega: d
                } : o)
              };
            return l(p, {
              para: ["cliente"],
              clienteId: s.clienteId,
              titulo: "Pacote entregue",
              corpo: `${s.codigo} · recebido por ${t}`,
              remessaId: e
            });
          }),
          registrarOcorrencia: (e, t, x = {}) => o(n => {
            let r = n.remessas.find(t => t.id === e);
            if (!r) return n;
            let i = {
              ...n,
              remessas: n.remessas.map(n => n.id === e ? {
                ...u(n, "ocorrencia", a?.nome),
                status: "ocorrencia",
                ocorrencia: {
                  motivo: t,
                  detalhe: x.detalhe || void 0,
                  foto: x.foto || void 0,
                  gps: x.gps || void 0,
                  resolvida: !1
                }
              } : n)
            };
            return l(i, {
              para: ["gerente", "operacional"],
              titulo: "Ocorrência na entrega",
              corpo: `${r.codigo} · ${t}${x.detalhe ? ": " + x.detalhe : ""}`,
              remessaId: e
            });
          }),
          resolverOcorrencia: (e, d = {}) => {
            let nota = (d.nota || "").trim();
            if (nota.length < 5) throw Error("Anote o que foi combinado.");
            if (!d.novaData || d.novaData < Jn()) throw Error("Informe uma nova data de entrega a partir de hoje.");
            o(t => ({
              ...t,
              remessas: t.remessas.map(t => {
                if (t.id !== e) return t;
                let w = u(t, "conferido", a?.nome);
                return {
                  ...w,
                  eventos: [...w.eventos, {
                    tipo: "reprogramado",
                    em: br(),
                    por: a?.nome,
                    nota,
                    novaData: d.novaData
                  }],
                  status: "conferido",
                  motoristaId: void 0,
                  previsao: d.novaData,
                  ocorrencia: t.ocorrencia ? {
                    ...t.ocorrencia,
                    resolvida: !0,
                    resolucao: {
                      nota,
                      novaData: d.novaData,
                      por: a?.nome,
                      em: br()
                    }
                  } : void 0
                };
              })
            }));
          },
          marcarLidas: () => o(e => ({
            ...e,
            notifs: e.notifs.map(e => a && e.para.includes(a.papel) && (!e.clienteId || e.clienteId === a.clienteId) && (!e.motoristaId || e.motoristaId === a.id) ? {
              ...e,
              lida: !0
            } : e)
          })),
          salvarCfg: e => o(t => ({
            ...t,
            cfg: e
          })),
          salvarCliente: e => o(t => ({
            ...t,
            clientes: t.clientes.map(t => t.id === e.id ? e : t)
          })),
          addCliente: e => o(t => ({
            ...t,
            clientes: [...t.clientes, {
              ...e,
              id: Sr()
            }]
          })),
          salvarUsuario: e => o(t => ({
            ...t,
            equipe: t.equipe.map(t => t.id === e.id ? e : t)
          })),
          addUsuario: e => o(t => ({
            ...t,
            equipe: [...t.equipe, {
              ...e,
              id: Sr(),
              motoboy: e.papel === "motorista" ? e.motoboy ? {
                ...e.motoboy,
                codigoIndicacao: e.motoboy.codigoIndicacao || wr()
              } : Tr({
                valorEntregaC: t.cfg.motoboyEntregaPadraoC,
                valorColetaC: t.cfg.motoboyColetaPadraoC,
                forma: t.cfg.motoboyFormaPadrao,
                periodo: t.cfg.motoboyPeriodoPadrao,
                codigoIndicacao: wr()
              }) : void 0
            }]
          })),
          alternarDisponivel: e => o(t => ({
            ...t,
            equipe: t.equipe.map(t => t.id === e && t.motoboy ? {
              ...t,
              motoboy: {
                ...t.motoboy,
                disponivel: !t.motoboy.disponivel
              }
            } : t)
          })),
          fecharFatura: e => o(t => {
            let n = fr(t.remessas, e);
            if (!n.length) return t;
            let r = {
                id: Sr(),
                clienteId: e,
                totalC: n.reduce((e, t) => e + t.precoC, 0),
                em: br(),
                remessas: n.length
              },
              i = new Set(n.map(e => e.id)),
              a = t.cfg.caixaAtivo ? [{
                id: Sr(),
                tipo: "entrada",
                descricao: `Fatura · ${t.clientes.find(t => t.id === e)?.nome ?? ""}`,
                categoria: "Fretes",
                valorC: r.totalC,
                data: Yn(Jn(), t.cfg.prazoFaturaDias),
                pago: !1,
                origem: "fatura",
                refId: r.id
              }] : [];
            return {
              ...t,
              faturas: [r, ...t.faturas],
              caixa: [...a, ...t.caixa],
              remessas: t.remessas.map(e => i.has(e.id) ? {
                ...e,
                faturaId: r.id
              } : e)
            };
          }),
          lancarAjuste: e => o(t => ({
            ...t,
            ajustes: [{
              ...e,
              id: Sr(),
              data: br()
            }, ...t.ajustes]
          })),
          removerAjuste: e => o(t => ({
            ...t,
            ajustes: t.ajustes.filter(t => !(t.id === e && !t.acertoId))
          })),
          aprovarAcerto: (e, t, n) => o(r => {
            let i = lr(sr(r.remessas, e)).filter(e => !n || e.em <= n),
              o = r.ajustes.filter(t => t.motoboyId === e && !t.acertoId),
              s = f(r, e);
            if (!s || !i.length && !o.length) return r;
            let c = dr(i, o),
              l = {
                id: Sr(),
                motoboyId: e,
                rotulo: t,
                brutoC: c.brutoC,
                descontosC: c.descontosC,
                bonusC: c.bonusC,
                liquidoC: c.liquidoC,
                linhas: i.length,
                status: "aprovado",
                criadoEm: br(),
                por: a?.nome ?? "Sistema",
                forma: s.forma
              },
              u = new Set(i.map(e => e.remessaId + e.tipo)),
              d = (t, n, r) => t && t.motoboyId === e && !t.pagoEm && !t.acertoId && u.has(r + n) ? {
                ...t,
                acertoId: l.id
              } : t;
            return {
              ...r,
              acertos: [l, ...r.acertos],
              ajustes: r.ajustes.map(t => t.motoboyId === e && !t.acertoId ? {
                ...t,
                acertoId: l.id
              } : t),
              remessas: r.remessas.map(e => ({
                ...e,
                pgEntrega: d(e.pgEntrega, "entrega", e.id),
                pgColeta: d(e.pgColeta, "coleta", e.id),
                comissao: d(e.comissao, "indicacao", e.id)
              }))
            };
          }),
          pagarAcerto: e => o(t => {
            let n = t.acertos.find(t => t.id === e);
            if (!n || n.status === "pago") return t;
            let r = br(),
              i = t => t && t.acertoId === e ? {
                ...t,
                pagoEm: r
              } : t,
              a = t.cfg.caixaAtivo && n.liquidoC > 0 ? [{
                id: Sr(),
                tipo: "saida",
                descricao: `Acerto · ${t.equipe.find(e => e.id === n.motoboyId)?.nome ?? ""}`,
                categoria: "Motoboys",
                valorC: n.liquidoC,
                data: Jn(),
                pago: !0,
                pagoEm: r,
                origem: "acerto",
                refId: e
              }] : [];
            return {
              ...t,
              caixa: [...a, ...t.caixa],
              acertos: t.acertos.map(t => t.id === e ? {
                ...t,
                status: "pago",
                pagoEm: r
              } : t),
              remessas: t.remessas.map(e => ({
                ...e,
                pgEntrega: i(e.pgEntrega),
                pgColeta: i(e.pgColeta),
                comissao: i(e.comissao)
              }))
            };
          }),
          addLancamento: e => o(t => ({
            ...t,
            caixa: [{
              ...e,
              id: Sr(),
              origem: "manual",
              pago: !1
            }, ...t.caixa]
          })),
          pagarLancamento: e => o(t => ({
            ...t,
            caixa: t.caixa.map(t => t.id === e && !t.pago ? {
              ...t,
              pago: !0,
              pagoEm: br()
            } : t)
          })),
          estornarLancamento: e => o(t => ({
            ...t,
            caixa: t.caixa.map(t => t.id === e && t.pago ? {
              ...t,
              pago: !1,
              pagoEm: void 0
            } : t)
          })),
          removerLancamento: e => o(t => ({
            ...t,
            caixa: t.caixa.filter(t => t.id !== e)
          })),
          exportarCopia: () => JSON.stringify({
            app: "am-express-sistema",
            versao: 6,
            em: br(),
            estado: t
          }, null, 1),
          importarCopia: e => {
            try {
              let t = JSON.parse(e),
                n = t.estado;
              if (t.app !== "am-express-sistema" || !n || !Array.isArray(n.remessas) || !Array.isArray(n.clientes) || !Array.isArray(n.equipe) || !n.cfg) return "Este arquivo não é uma cópia do sistema da AM Express.";
              let r = kr();
              return o(() => ({
                ...r,
                ...n,
                cfg: {
                  ...r.cfg,
                  ...n.cfg
                },
                acertos: n.acertos ?? [],
                ajustes: n.ajustes ?? [],
                caixa: n.caixa ?? [],
                registros: n.registros ?? [],
                faturas: n.faturas ?? [],
                notifs: n.notifs ?? []
              })), null;
            } catch {
              return "Não consegui ler o arquivo.";
            }
          },
          resetDemo: () => o(() => kr())
        },
        r = (e, t) => o(n => d(n, e, t)),
        i = e => t.remessas.find(t => t.id === e)?.codigo ?? "processo novo",
        m = e => t.clientes.find(t => t.id === e)?.nome ?? e,
        h = e => t.equipe.find(t => t.id === e)?.nome ?? e,
        g = (e, t, n) => Object.keys(n).filter(n => JSON.stringify(e?.[n]) !== JSON.stringify(t[n])).map(e => n[e]).join(", ");
      return {
        ...n,
        criarRemessa: e => {
          let t = n.criarRemessa(e);
          return r("Remessa criada", `${t.codigo} · ${m(e.clienteId)} · para ${e.cidade}`), t;
        },
        cancelar: e => {
          n.cancelar(e), r("Remessa cancelada", i(e));
        },
        editarEvento: (e, a, o) => {
          let s = t.remessas.find(t => t.id === e)?.eventos.find(e => e.tipo === a)?.em;
          n.editarEvento(e, a, o);
          let c = e => e ? new Date(e).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short"
          }) : "—";
          r("Horário corrigido", `${i(e)} · ${tr[a] ?? a} · de ${c(s)} para ${c(o)}`);
        },
        mudarStatus: (e, t) => {
          n.mudarStatus(e, t), r("Status alterado", `${i(e)} → ${tr[t]}`);
        },
        aceitarColeta: (e, t) => {
          n.aceitarColeta(e, t), r("Coleta aceita", `${i(e)} · ${h(t)}`);
        },
        atribuirColeta: (e, t) => {
          n.atribuirColeta(e, t), r("Motoboy da coleta atribuído", `${i(e)} · ${h(t)}`);
        },
        atribuir: (e, t) => {
          n.atribuir(e, t), r("Motoboy atribuído", `${i(e)} · ${h(t)}`);
        },
        sairParaRota: (e, t) => {
          n.sairParaRota(e, t), r("Saída para rota", `${i(e)} · ${h(t)}`);
        },
        ajustarPeso: (e, t) => {
          n.ajustarPeso(e, t), r("Peso ajustado", `${i(e)} · ${Kn(t)}`);
        },
        entregar: (e, t, a, o) => {
          n.entregar(e, t, a, o), r("Entrega concluída", `${i(e)} · recebido por ${t}`);
        },
        registrarOcorrencia: (e, t, x) => {
          n.registrarOcorrencia(e, t, x), r("Ocorrência registrada", `${i(e)} · ${t}`);
        },
        resolverOcorrencia: (e, d) => {
          n.resolverOcorrencia(e, d), r("Ocorrência resolvida", `${i(e)} · nova data ${d.novaData}`);
        },
        salvarCfg: e => {
          n.salvarCfg(e), r("Configurações alteradas", g(t.cfg, e, {
            limiteKg: "peso incluído",
            excedenteKgC: "excedente por kg",
            tarifas: "tarifas por cidade",
            pesos: "pesos personalizados",
            corteHora: "horário de corte",
            comissaoIndicacaoC: "comissão de indicação",
            motoboyEntregaPadraoC: "padrão por entrega",
            caixaAtivo: "módulo Caixa",
            saldoInicialC: "saldo inicial do caixa",
            prazoFaturaDias: "prazo da fatura",
            categoriasEntrada: "categorias de entrada",
            categoriasSaida: "categorias de saída",
            metaEntregas: "meta de entregas",
            metaResultadoC: "meta de resultado",
            doisPassos: "verificação em dois passos",
            motoboyColetaPadraoC: "padrão por coleta",
            motoboyFormaPadrao: "forma de pagamento padrão",
            motoboyPeriodoPadrao: "periodicidade padrão"
          }) || "sem mudanças");
        },
        salvarCliente: e => {
          n.salvarCliente(e), r("Cliente alterado", `${e.nome} · ${g(t.clientes.find(t => t.id === e.id), e, {
            nome: "nome",
            valorBaseC: "valor base",
            tarifas: "tarifas",
            ativo: "ativo",
            indicadoPorId: "indicação",
            cidade: "cidade",
            documento: "documento",
            whatsapp: "whatsapp",
            email: "e-mail"
          }) || "sem mudanças"}`);
        },
        addCliente: e => {
          n.addCliente(e), r("Cliente criado", e.nome);
        },
        salvarUsuario: e => {
          n.salvarUsuario(e), r("Acesso alterado", `${e.nome} · ${g(t.equipe.find(t => t.id === e.id), e, {
            nome: "nome",
            papel: "papel",
            permissoes: "permissões",
            motoboy: "dados do motoboy",
            cargo: "cargo"
          }) || "sem mudanças"}`);
        },
        addUsuario: e => {
          n.addUsuario(e), r("Acesso criado", `${e.nome} · ${Mr[e.papel]}`);
        },
        fecharFatura: e => {
          let i = fr(t.remessas, e);
          n.fecharFatura(e), i.length && r("Fatura fechada", `${m(e)} · ${i.length} remessa(s) · R$ ${(i.reduce((e, t) => e + t.precoC, 0) / 100).toFixed(2).replace(".", ",")}`);
        },
        lancarAjuste: e => {
          n.lancarAjuste(e), r("Ajuste lançado", `${h(e.motoboyId)} · ${e.tipo} · ${e.descricao}${e.reembolsado ? " (reembolsado pelo cliente)" : ""}`);
        },
        removerAjuste: e => {
          n.removerAjuste(e), r("Ajuste removido", t.ajustes.find(t => t.id === e)?.descricao ?? e);
        },
        aprovarAcerto: (e, t, i) => {
          n.aprovarAcerto(e, t, i), r("Acerto aprovado", `${h(e)} · ${t}`);
        },
        pagarAcerto: e => {
          let i = t.acertos.find(t => t.id === e);
          n.pagarAcerto(e), i && r("Acerto pago", `${h(i.motoboyId)} · ${i.rotulo} · R$ ${(i.liquidoC / 100).toFixed(2).replace(".", ",")}`);
        },
        addLancamento: e => {
          n.addLancamento(e), r("Lançamento no caixa", `${e.tipo === "entrada" ? "Entrada" : "Saída"} · ${e.descricao} · R$ ${(e.valorC / 100).toFixed(2).replace(".", ",")}`);
        },
        pagarLancamento: e => {
          n.pagarLancamento(e), r("Caixa: baixa", t.caixa.find(t => t.id === e)?.descricao ?? e);
        },
        estornarLancamento: e => {
          n.estornarLancamento(e), r("Caixa: estorno", t.caixa.find(t => t.id === e)?.descricao ?? e);
        },
        removerLancamento: e => {
          n.removerLancamento(e), r("Caixa: lançamento removido", t.caixa.find(t => t.id === e)?.descricao ?? e);
        },
        importarCopia: e => {
          let t = n.importarCopia(e);
          return t || r("Cópia de segurança restaurada", "dados substituídos pelo arquivo"), t;
        }
      };
    }, [t, a, s, c, o]);
  return <yr.Provider value={m}>{e}</yr.Provider>;
}

export function useSistema() {
  let e = useContext(yr);
  if (!e) throw Error("useStore fora do StoreProvider");
  return e;
}

export var Mr = {
  dono: "Dono",
  gerente: "Gerente",
  operacional: "Operacional",
  motorista: "Motorista",
  cliente: "Cliente"
};

export var Nr = [{
  id: "visao",
  rotulo: "Visão geral",
  texto: "Indicadores do dia e pacotes por etapa"
}, {
  id: "analise",
  rotulo: "Análise",
  texto: "Comparativos, ranking de motoboys, falhas e metas"
}, {
  id: "operacao",
  rotulo: "Operação",
  texto: "Processos, fila de coletas, conferência, expedição e ocorrências"
}, {
  id: "clientes",
  rotulo: "Clientes",
  texto: "Clientes, valores base e tarifas de contrato"
}, {
  id: "financeiro",
  rotulo: "Financeiro",
  texto: "Faturas dos clientes e acerto dos motoboys"
}, {
  id: "caixa",
  rotulo: "Caixa",
  texto: "Entradas, saídas, contas a pagar e a receber"
}, {
  id: "configuracoes",
  rotulo: "Configurações",
  texto: "Regras de preço, pagamento dos motoboys, metas e cópia de segurança"
}, {
  id: "equipe",
  rotulo: "Equipe e permissões",
  texto: "Criar acessos e definir o que cada conta acessa"
}, {
  id: "registros",
  rotulo: "Registros",
  texto: "Quem fez o quê no sistema"
}];

export var Pr = Nr.map(e => e.id);

export var Fr = [["nenhum", "Não vê"], ["ver", "Só vê"], ["editar", "Vê e altera"]];

export var Ir = {
  nenhum: 0,
  ver: 1,
  editar: 2
};

export var Lr = e => Object.fromEntries(Pr.map(t => [t, e]));

