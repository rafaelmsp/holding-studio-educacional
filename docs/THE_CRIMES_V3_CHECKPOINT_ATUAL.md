# THE CRIMES LIVE — CHECKPOINT V3.8.0

Atualizado em **11/11/2026**.

## Estado
- Baseline funcional preservado: V3.7.0
- Evolução frontend: **V3.8.0 — Entrada Premium e personagens**
- Repositório: `rafaelmsp/holding-studio-educacional`
- Publicação: `https://rafaelmsp.github.io/holding-studio-educacional/live/`

## Entregue na V3.8
- Onboarding responsivo para entrar na partida.
- Nome / apelido com validação de 2 a 24 caracteres.
- Filtros visuais Masculino, Feminino e Neutro.
- Catálogo de 12 personagens / 4 por filtro.
- Cards selecionáveis, descrição e preview.
- Avatar salvo no navegador junto ao token da sala.
- Avatar exposto apenas como detalhe cosmético de presença, sem nova tabela e sem alterar score.
- Personagem visível no celular e em ranking enquanto online.
- Novo CSS para a tela de entrada e refinamentos Host/Telão/Jogador.
- Teste de catálogo conectado ao CI.

## Evidência de QA V3.8
Browser local automatizado (Chrome + Playwright):
- Host 1440×900;
- Telão 1920×1080;
- Mobile 390×844;
- Sala criada `CRIM-7969`;
- 4 perfis por filtro; selecionada Perita;
- `localStorage` persistiu `avatarId:perita`;
- avatar apareceu durante a primeira rodada;
- `overflowX: false` nas três telas;
- `pageerror: []`;
- `node tests/live-ux-v38.test.js`: PASS.

## Critérios ainda não atendidos na visão artística completa
- Retratos fotorrealistas definitivos dos personagens (atualmente avatares SVG estilizados e leves).
- Rearranjo total de TODAS as telas seguindo pixel-a-pixel os conceitos (Host, Telão, resultado, modais).
- Teste ampliado para 30–50 jogadores simultâneos.

**Não confundir a aprovação do onboarding V3.8 com uma aprovação integral da expansão artística acima.**

Próxima etapa: trazer os retratos fotorrealistas aprovados para `assets/the-crimes-v3/avatars/` e completar o refinamento visual de Host/Telão/resultado, sem refazer a lógica multiplayer.
