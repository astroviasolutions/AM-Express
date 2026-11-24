/* Geração de PDFs (jsPDF + autotable), carregada sob demanda.
   Reconstruído do chunk pdf-r5mq_qQs.js do deploy. */
var t = (e) =>
  e
    .replace(/[\u2212\u2013\u2014]/g, `-`)
    .replace(/[\u25B2\u25BC]/g, ``)
    .replace(/\u2192/g, `->`);
async function n(n, r) {
  let { jsPDF: i } = await import("jspdf"),
    a = (await import("jspdf-autotable")).default,
    o = new i({ unit: `pt`, format: `a4` }),
    s = o.internal.pageSize.getWidth();
  (o.setFillColor(13, 27, 58),
    o.rect(0, 0, s, 64, `F`),
    o.setTextColor(255, 255, 255),
    o.setFont(`helvetica`, `bold`),
    o.setFontSize(10),
    o.text(`AM EXPRESS`, 40, 26),
    o.setFontSize(17),
    o.text(n, 40, 48),
    o.setTextColor(26, 34, 56),
    o.setFont(`helvetica`, `normal`),
    o.setFontSize(10),
    o.text(t(r), 40, 88));
  let c = 104,
    l = (e, n = {}) => {
      (a(o, {
        startY: c,
        head: [e.cabecalho.map(t)],
        body: e.linhas.map((e) => e.map(t)),
        foot: n.total ? [n.total.map(t)] : void 0,
        theme: `striped`,
        headStyles: { fillColor: [13, 27, 58] },
        footStyles: { fillColor: [230, 235, 245], textColor: [13, 27, 58] },
        styles: { fontSize: 9 },
        margin: { left: 40, right: 40 },
      }),
        (c = o.lastAutoTable.finalY + 16));
    },
    u = (e, t = !1) => {
      (o.setFont(`helvetica`, t ? `bold` : `normal`),
        o.setFontSize(10),
        o.text(o.splitTextToSize(e, s - 80), 40, c),
        (c += 14 * Math.ceil(e.length / 95) + 4));
    },
    d = (e) => {
      (o.setFont(`helvetica`, `bold`),
        o.setFontSize(12),
        o.setTextColor(214, 58, 55),
        o.text(e, 40, c),
        o.setTextColor(26, 34, 56),
        (c += 10));
    },
    f = () => {
      let e = o.getNumberOfPages(),
        t = o.internal.pageSize.getHeight();
      for (let n = 1; n <= e; n++)
        (o.setPage(n),
          o.setFontSize(8),
          o.setTextColor(120, 130, 150),
          o.text(
            `Gerado em ${new Date().toLocaleString(`pt-BR`)} · dados de exemplo · página ${n} de ${e}`,
            40,
            t - 24,
          ));
    };
  return {
    tabela: l,
    texto: u,
    titulo2: d,
    baixar: (e) => {
      f();
      let t = o.output(`blob`),
        n = URL.createObjectURL(t),
        r = document.createElement(`a`);
      ((r.href = n),
        (r.download = e),
        (r.rel = `noopener`),
        document.body.appendChild(r),
        r.click(),
        r.remove(),
        setTimeout(() => URL.revokeObjectURL(n), 6e4),
        `download` in r || window.open(n, `_blank`, `noopener`));
    },
  };
}
async function r(e) {
  let t = await n(
    `Extrato de acerto`,
    `${e.motoboy} · ${e.periodo} · pagamento por ${e.forma}`,
  );
  (t.titulo2(`Entregas, coletas e indicações`),
    t.tabela({
      cabecalho: [`Data`, `Tipo`, `Código`, `Valor`],
      linhas: e.linhas.length ? e.linhas : [[`—`, `Nenhum lançamento`, ``, ``]],
    }),
    e.ajustes.length &&
      (t.titulo2(`Ajustes`),
      t.tabela({
        cabecalho: [`Data`, `Tipo`, `Descrição`, `Valor`],
        linhas: e.ajustes,
      })),
    t.titulo2(`Resumo`),
    t.tabela(
      {
        cabecalho: [`Item`, `Valor`],
        linhas: [
          [`Bruto`, e.resumo.bruto],
          [`Descontos e adiantamentos`, `− ${e.resumo.descontos}`],
          [`Bônus`, `+ ${e.resumo.bonus}`],
          ...(e.resumo.naoCobrado === `R$ 0,00`
            ? []
            : [
                [
                  `Descontos reembolsados pelo cliente (não cobrados)`,
                  e.resumo.naoCobrado,
                ],
              ]),
        ],
      },
      { total: [`Líquido a receber`, e.resumo.liquido] },
    ),
    t.baixar(
      `extrato-${e.motoboy.toLowerCase().replace(/[^a-z0-9]+/g, `-`)}.pdf`,
    ));
}
async function i(e) {
  let t = await n(
    `Relatório de análise`,
    `${e.periodo} · comparado com ${e.comparado}`,
  );
  (t.titulo2(`Indicadores`),
    t.tabela({
      cabecalho: [`Indicador`, `Valor`, `Variação`],
      linhas: e.indicadores,
    }),
    e.clientes.length &&
      (t.titulo2(`Por cliente`),
      t.tabela({
        cabecalho: [`Cliente`, `Entregas`, `Receita`, `Repasse`, `Margem`],
        linhas: e.clientes,
      })),
    e.motoboys.length &&
      (t.titulo2(`Ranking de motoboys`),
      t.tabela({
        cabecalho: [`Motoboy`, `Entregas`, `Taxa de entrega`, `Ocorrências`],
        linhas: e.motoboys,
      })),
    e.falhas.length &&
      (t.titulo2(`Onde está falhando`),
      t.tabela({
        cabecalho: [`Grupo`, `Item`, `Processos`],
        linhas: e.falhas,
      })),
    t.baixar(`relatorio-analise.pdf`));
}
export { r as extratoMotoboyPdf, i as painelPdf };
