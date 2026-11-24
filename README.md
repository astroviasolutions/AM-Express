# AM Express · Sistema de gestão

Reconstrução do código-fonte do sistema publicado em
https://am-express-sistema.vercel.app, feita a partir do build de produção
(JS + CSS compilados) por não haver o código original disponível.

React 19 · Vite · React Router 7 · jsPDF · qrcode · JsBarcode.
Hoje é uma **demonstração com dados de exemplo**: o estado fica no navegador
(`localStorage`, chave `am-sistema-v6`), sem banco de dados nem login real.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

Para publicar na Vercel basta importar o repositório (`vercel.json` já traz o
rewrite das rotas para o `index.html`).

## Estrutura

```
src/
  main.jsx                    ponto de entrada
  rotas.jsx                   tabela de rotas e perfis (dono, gerente, operacional, motoboy, lojista)
  dados/cidades.js            cidades atendidas, filiais, distâncias
  lib/regras.js               cálculo de tarifa, prazo, margem, acertos
  lib/prazos-metas.jsx        prazos e metas
  lib/pdf.js                  PDFs (carregado sob demanda)
  sistema/estado.jsx          estado global e ações (SistemaProvider)
  sistema/acesso-toast.jsx    permissões por papel, navegação, avisos
  componentes/                ui.jsx (primitivos) e layout.jsx (menu e cabeçalho)
  telas/                      uma tela por rota
  estilos/app.compilado.css   CSS Tailwind já compilado (ver abaixo)
```

## O que é fiel e o que não é

- **Comportamento e visual:** idênticos ao deploy. As telas de todos os perfis
  foram comparadas com o site publicado.
- **Nomes:** os componentes de tela foram renomeados (Processos, Caixa,
  Financeiro…). Funções auxiliares, variáveis locais e constantes ainda têm os
  nomes curtos do build (`Ur`, `qr`, `Wr`…), porque o original não tinha mapa de
  código. Renomear aos poucos, conforme for mexendo em cada módulo.
- **Comentários e a organização original** não existem mais; os arquivos
  seguem a ordem do bundle.
- **CSS:** `estilos/app.compilado.css` é o Tailwind compilado do deploy. Não há
  o CSS-fonte (tokens e camadas). Para voltar a editar com Tailwind, migrar as
  classes e os tokens para um `app.css` com `@import "tailwindcss"`.
- **Nada de back-end:** a versão real (Supabase, RLS, login por e-mail e senha,
  convite por e-mail) ainda precisa ser construída.

## Referência do sistema anterior

`referencia/amcoletas-html/` guarda a estrutura HTML do sistema atual de coleta
e entrega (admin, cliente, motoboy), usada apenas como referência de telas e
fluxos para a versão real.
